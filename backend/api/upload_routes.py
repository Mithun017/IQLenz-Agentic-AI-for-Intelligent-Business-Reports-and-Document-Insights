from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Depends
from agents.document_agent import extract_document_data
from agents.report_agent import generate_report
from models import DocumentDB, ReportDB
from core.database import get_db

router = APIRouter()

@router.post("/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...), db = Depends(get_db)):
    """
    Endpoint to receive a document, process it via the Agentic Architecture,
    store it in MongoDB, and trigger the report pipeline.
    """
    if file.content_type not in ["application/pdf", "image/png", "image/jpeg", "text/csv"]:
         raise HTTPException(status_code=400, detail="Unsupported file type.")
    
    try:
        content = await file.read()
        
        # 1. Document AI Extraction
        extracted_data = await extract_document_data(content, file.content_type)
        
        # 2. Store original Document Record in MongoDB
        doc_record = DocumentDB(
             filename=file.filename,
             file_path="simulated/path/for/now",
             file_type=file.content_type,
             status="completed",
             structured_data=extracted_data
        )
        
        doc_dict = doc_record.model_dump(by_alias=True, exclude={"id"})
        insert_doc_result = await db.documents.insert_one(doc_dict)
        doc_id = str(insert_doc_result.inserted_id)

        # 3. Report Generation Agent
        report_data = await generate_report(extracted_data, extracted_data)

        # 4. Store Report in MongoDB
        report_record = ReportDB(
            title=f"Report for {file.filename}",
            summary=report_data.get("summary", "Generated analysis."),
            financial_analysis=report_data.get("financial_analysis", {}),
            document_id=doc_id
        )
        
        report_dict = report_record.model_dump(by_alias=True, exclude={"id"})
        await db.reports.insert_one(report_dict)
        
        # 5. Store Generated Proposals as Strategic Recommendations
        proposals = report_data.get("proposals", [])
        if proposals:
            recommendations_to_insert = []
            for prop in proposals:
                recommendations_to_insert.append({
                    "category": prop.get("category", "General Optimization"),
                    "suggestion": prop.get("suggestion", ""),
                    "impact": prop.get("impact", "TBD"),
                    "approved": False,
                    "document_id": doc_id,
                    "strategy_details": ""
                })
            if recommendations_to_insert:
                await db.recommendations.insert_many(recommendations_to_insert)
        
        return {
            "status": "Processing Completed",
            "filename": file.filename,
            "document_id": doc_id,
            "extracted_preview": extracted_data # MVP visualization
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
