# main.py (PHASE 1 - PURE ANPR ONLY)
import requests

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np

from NumberPlateScan.anpr_services import scan_plate_image

from database.mongo import vehicle_logs_collection
from bson import ObjectId
from datetime import datetime

app = FastAPI(title="ANPR ONLY")

# LOG_API_URL = "http://localhost:5000/api/vehicle-logs"
LOG_API_URL = "http://localhost:5000/api/vehicle-logs"
LOG_FOOT_URL = "http://localhost:5000/api/pedestrianLogs"


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SCAN PLATE ----------------
@app.post("/scan_plate")
async def scan_plate(
    image: UploadFile = File(...),
    vehicle_type: str = Form("four")
):
    try:
        contents = await image.read()
        np_arr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return JSONResponse(
                status_code=400,
                content={
                    "plate": None,
                    "confidence": 0,
                    "status": "ERROR",
                    "category": "MANUAL",
                    "message": "Invalid image"
                }
            )

        # ✅ PURE ANPR + ACCESS CHECK
        result = scan_plate_image(frame, vehicle_type)

        # 🔥 RETURN FULL RESULT (DO NOT FILTER)
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ ANPR ERROR:", e)
        return JSONResponse(
            status_code=500,
            content={
                "plate": None,
                "confidence": 0,
                "status": "ERROR",
                "category": "MANUAL",
                "message": "Server error during scan"
            }
        )

# for vehicle logs     
def serialize(doc):
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    if isinstance(doc, dict):
        return {k: serialize(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [serialize(i) for i in doc]
    return doc

@app.get("/vehiclelogs")
async def vehiclelogs(
    page: int = 1,
    limit: int = 10,
    status: str = "all"
):
    print("value of page:",page)
    print("value of status:",status)
    skip = (page - 1) * limit
    print("get old vehicle logs api called",skip,limit,status)
    query = {}
    if status != "all":
        query["movementType"] = status

    logs = (
        vehicle_logs_collection
        .find(query)
        .sort("timestamp", -1)
        .skip(skip)
        .limit(limit)
    )
    # print("logs fetched",logs)
    data = [serialize(log) for log in logs]
    # print("data:",data)
    query = {"movementType": "ENTRY"}
    total_entry = vehicle_logs_collection.count_documents(query)
    query = {"movementType": "EXIT"}
    total_exit = vehicle_logs_collection.count_documents(query)
    print("total entry:",total_entry)
    print("total exit:",total_exit)
    return {
        "data": data,
        "total_entry": total_entry,
        "page": page,
        "total_exit": total_exit
    }

# this is getting called from manualentryform .jsx where all the form data is getting passed along with entry type
# based on entry type the code makes a call to the api for vehicle or pedestrian
# the if else conditions calls the URLs that are linked to Routes in server.js
# in server.js the routers configurations are present that are pointing to pedestrianEntryRoutes.js and vehicleLogs.js
# in the pedestrianEntryRoutes.js and vehicleLogs.js the get and post are their to the respective models
# and in the model file the last line gives the name of the collection in which the data is getting stored

@app.post("/manual_entry")
async def manual_entry(
    entryType: str = Form(...),
    vehicleNo: str = Form(...),
    vehicleType: str = Form(...),
    driverName: str = Form(...),
    phoneNumber: str = Form(...),
    proofType: str = Form(...),
    proofId: str = Form(...),
    reason: str = Form(...)
):
    if entryType=="VEHICLE":
        try:
            print("manual entry api called with:",vehicleNo)
            log_payload = {
                "vehicleNo": vehicleNo,
                "vehicleType": vehicleType,
                "category": "manual",
                "movementType": "ENTRY",
                "decision": "ALLOWED",
                "source": {
                    "type": "MANUAL",
                    "guardId": "GID002"
                },
                "scanTime": datetime.utcnow().isoformat(),
                "driverDetails": {
                    "name": driverName,
                    "phoneNumber": phoneNumber,
                    "proofType": proofType,
                    "proofId": proofId,            
                },
                "reason":reason,
            }
            print("manual_entry vlog_payload:", log_payload)
            requests.post(LOG_API_URL, json=log_payload, timeout=1)
            print("after manual entry post")
            return {"status": "success", "message": "Manual entry logged"}
        except Exception as e:
            print("❌ MANUAL ENTRY ERROR:", e)
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Server error during manual entry"}
            )
    else:
        print("pedestrian manual entry api called")
        try:
            print("manual entry api called foot")
            log_payload = {
                "category": "manual",
                "movementType": "ENTRY",
                "decision": "ALLOWED",
                "source": {
                    "type": "MANUAL",
                    "guardId": "GID002"
                },
                "scanTime": datetime.utcnow().isoformat(),
                "driverDetails": {
                    "name": driverName,
                    "phoneNumber": phoneNumber,
                    "proofType": proofType,
                    "proofId": proofId,            
                },
                "reason":reason,
            }
            print("manual_entry vlog_payload:", log_payload)
            requests.post(LOG_FOOT_URL, json=log_payload, timeout=1)
            print("after manual entry post")
            return {"status": "success", "message": "Manual entry logged"}
        except Exception as e:
            print("❌ MANUAL ENTRY ERROR:", e)
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Server error during manual entry"}
            )
    