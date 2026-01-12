import re
from database.mongo import (
    whitelist_collection,
    blacklist_collection,
    occasional_collection
)

def normalize_plate(plate: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", plate.upper())

def check_plate_access(plate: str):
    plate = normalize_plate(plate)

    if blacklist_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "DENIED",
            "category": "BLACKLIST",
            "message": "Blacklisted vehicle ❌"
        }

    if whitelist_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "ALLOWED",
            "category": "WHITELIST",
            "message": "Whitelisted vehicle ✅"
        }

    if occasional_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "ALLOWED",
            "category": "OCCASIONAL",
            "message": "Occasional entry allowed ✅"
        }

    return {
        "status": "MANUAL",
        "category": "MANUAL",
        "message": "Manual verification required"
    }
