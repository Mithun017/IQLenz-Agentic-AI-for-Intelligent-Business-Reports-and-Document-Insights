from fastapi import APIRouter, Depends
from core.database import get_db
# from models import DocumentDB, ReportDB

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data(db = Depends(get_db)):
    """
    Fetch dynamic data for the Interactive Dashboard charts.
    """
    # Pull all completed reports/documents to map dynamically
    cursor = db.documents.find({"status": "completed"})
    docs = await cursor.to_list(length=100)

    total_expenses = 0
    total_revenue = 0
    
    vendor_dict = {}
    doc_type_counts = {
        "Invoice": 0,
        "Contract": 0,
        "Receipt": 0,
        "Financial Report": 0,
        "Other": 0
    }

    if docs:
        for doc in docs:
            extracted = doc.get("structured_data", {})
            
            # Aggregate Financials
            rev = extracted.get("total_revenue") or 0
            exp = extracted.get("total_expenses") or 0
            
            try:
                total_revenue += float(rev)
            except: pass
                
            try:
                total_expenses += float(exp)
            except: pass
                
            # Aggregate Document Types
            doc_type = extracted.get("document_type", "Other")
            if doc_type in doc_type_counts:
                 doc_type_counts[doc_type] += 1
            else:
                 doc_type_counts["Other"] += 1

            # Aggregate Vendors
            vendors_list = extracted.get("vendors", [])
            if isinstance(vendors_list, list):
                for v in vendors_list:
                    v_name = v.get("name", "Unknown")
                    v_cost = v.get("cost", 0)
                    try:
                        v_cost = float(v_cost)
                    except:
                        v_cost = 0
                    
                    if v_name in vendor_dict:
                        vendor_dict[v_name] += v_cost
                    else:
                        vendor_dict[v_name] = v_cost

    # Convert vendor dict back to chart-friendly array
    vendor_data = [{"name": k, "cost": v} for k, v in vendor_dict.items()]

    # Mock trend lines for area chart, offset by actual expense/revenue calculations for demonstration
    monthly_data = [
      {"name": 'Jan', "expense": 4000, "revenue": 2400},
      {"name": 'Feb', "expense": 3000, "revenue": 1390},
      {"name": 'Mar', "expense": 2000, "revenue": 9800},
      {"name": 'Apr', "expense": 2780, "revenue": 3908},
      {"name": 'May', "expense": 1890, "revenue": 4800},
      {"name": 'Jun', "expense": 2390, "revenue": 3800},
      {"name": 'Jul (Current)', "expense": total_expenses if total_expenses > 0 else 3490, "revenue": total_revenue if total_revenue > 0 else 4300},
    ]

    docs_processed = len(docs)
    avg_confidence = 0.92
    
    if docs:
        confidences = [doc.get("ai_metadata", {}).get("confidence_score", 0.92) for doc in docs]
        if confidences:
            avg_confidence = sum(confidences) / len(confidences)

    # Calculate Margin from real Extracted values
    net_profit_margin = ((total_revenue - total_expenses) / total_revenue) * 100 if total_revenue > 0 else 0

    doc_types = [
        {"name": "Invoices", "value": doc_type_counts.get("Invoice", 0)},
        {"name": "Contracts", "value": doc_type_counts.get("Contract", 0)},
        {"name": "Receipts", "value": doc_type_counts.get("Receipt", 0)},
        {"name": "Reports", "value": doc_type_counts.get("Financial Report", 0)},
        {"name": "Other", "value": doc_type_counts.get("Other", 0)},
    ]
    # Filter out 0 value doc types, but keep at least one to prevent recharts error
    doc_types = [d for d in doc_types if d["value"] > 0]
    if not doc_types:
         doc_types = [{"name": "No Documents", "value": 1}]

    processing_trend = [
        {"name": "Mon", "time": 120, "docs": 5},
        {"name": "Tue", "time": 132, "docs": 8},
        {"name": "Wed", "time": 101, "docs": 12},
        {"name": "Thu", "time": 134, "docs": 7},
        {"name": "Fri", "time": 90, "docs": 15},
    ]

    return {
        "monthly_performance": monthly_data,
        "vendor_spending": vendor_data,
        "document_types": doc_types,
        "processing_trend": processing_trend,
        "metrics": {
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "net_profit_margin": f"{round(net_profit_margin, 1)}%",
            "active_vendors": len(vendor_dict),
            "documents_analyzed": docs_processed,
            "avg_ai_confidence": f"{round(avg_confidence * 100, 1)}%"
        }
    }
