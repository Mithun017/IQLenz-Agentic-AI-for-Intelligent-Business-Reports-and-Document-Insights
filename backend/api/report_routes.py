from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from core.database import get_db
from bson import ObjectId

router = APIRouter()

class UpdateStrategyRequest(BaseModel):
    strategy_details: str

@router.get("/reports")
async def get_reports(db = Depends(get_db)):
    """
    Retrieve all generated reports from the database.
    """
    cursor = db.reports.find().sort("created_at", -1)
    reports = await cursor.to_list(length=100)
    
    formatted_reports = []
    for r in reports:
        formatted_reports.append({
            "id": str(r["_id"]),
            "title": r.get("title", "Untitled Report"),
            "date": r.get("created_at").strftime("%b %d, %Y") if r.get("created_at") else "Just now",
            "type": "Generated Analysis",
            "status": "Completed"
        })
        
    return {"reports": formatted_reports}

@router.get("/reports/{report_id}/download")
async def download_report(report_id: str, db = Depends(get_db)):
    """
    Download a report's financial analysis as a text file.
    """
    try:
        obj_id = ObjectId(report_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Report ID")

    report = await db.reports.find_one({"_id": obj_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    title = report.get('title', 'Financial_Report')
    content = f"# {title}\n\n{report.get('financial_analysis', '')}"
    
    clean_title = title.replace(" ", "_")
    return PlainTextResponse(
        content=content, 
        media_type="text/markdown", 
        headers={"Content-Disposition": f"attachment; filename={clean_title}.md"}
    )

@router.get("/proposals")
async def get_proposals(db = Depends(get_db)):
    """
    Retrieve all pending strategic recommendations and proposals.
    """
    cursor = db.recommendations.find({"approved": False})
    proposals = await cursor.to_list(length=100)
    
    formatted_proposals = []
    for p in proposals:
        formatted_proposals.append({
            "id": str(p["_id"]),
            "title": p.get("category", "Optimization Strategy"),
            "description": p.get("suggestion", ""),
            "impact": p.get("impact", ""),
        })
    
    return {"proposals": formatted_proposals}

@router.post("/proposals/{proposal_id}/approve")
async def approve_proposal(proposal_id: str, db = Depends(get_db)):
    try:
        obj_id = ObjectId(proposal_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Proposal ID")

    await db.recommendations.update_one({"_id": obj_id}, {"$set": {"approved": True}})
    return {"status": "approved"}

@router.post("/proposals/{proposal_id}/dismiss")
async def dismiss_proposal(proposal_id: str, db = Depends(get_db)):
    try:
        obj_id = ObjectId(proposal_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Proposal ID")

    await db.recommendations.delete_one({"_id": obj_id})
    return {"status": "dismissed"}

@router.get("/strategies")
async def get_strategies(db = Depends(get_db)):
    cursor = db.recommendations.find({"approved": True}).sort("created_at", -1)
    strategies = await cursor.to_list(length=100)
    
    formatted = []
    for s in strategies:
        formatted.append({
            "id": str(s["_id"]),
            "title": s.get("category", "Optimization Strategy"),
            "description": s.get("suggestion", ""),
            "impact": s.get("impact", ""),
            "strategy_details": s.get("strategy_details", "")
        })
    return {"strategies": formatted}

@router.put("/strategies/{strategy_id}")
async def update_strategy(strategy_id: str, req: UpdateStrategyRequest, db = Depends(get_db)):
    try:
        obj_id = ObjectId(strategy_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Strategy ID")
        
    await db.recommendations.update_one({"_id": obj_id}, {"$set": {"strategy_details": req.strategy_details}})
    return {"status": "updated"}
