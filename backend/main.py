from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi import UploadFile, File
from typing import List
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from both .env and .env.local if present
# Check in current directory (backend/) and parent directory (project root)
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)

# Try loading from project root first, then backend directory
load_dotenv(dotenv_path=os.path.join(project_root, ".env"), override=False)
load_dotenv(dotenv_path=os.path.join(backend_dir, ".env"), override=False)
load_dotenv(dotenv_path=os.path.join(project_root, ".env.local"), override=False)
load_dotenv(dotenv_path=os.path.join(backend_dir, ".env.local"), override=False)

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok"}


async def _image_part_from_upload(file: UploadFile):
    mime = file.content_type or "image/jpeg"
    data = await file.read()
    return {"mime_type": mime, "data": data}


def _fallback_result(frame_count: int):
    return {
        "overall_analysis": {
            "average_vehicle_count": 12,
            "congestion_trend": "Stable",
            "estimated_clearance_time": "15 minutes",
            "ambulance_present_in_any_frame": False,
            "dominant_vehicle_types": ["cars", "motorcycles"],
            "recommendation": "Traffic is moderate. Consider optimizing signal timing if delays persist.",
        },
        "frame_by_frame_analysis": [
            {
                "frame_number": i + 1,
                "vehicle_count": 10 + (i % 3),
                "congestion_level": "Medium",
                "ambulance_detected": False,
                "vehicle_breakdown": {
                    "cars": 6,
                    "trucks": 1,
                    "buses": 1,
                    "motorcycles": 3,
                },
            }
            for i in range(max(1, frame_count))
        ],
    }


@app.post("/analyze")
async def analyze(files: List[UploadFile] = File(...)):
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
    if not api_key:
        return JSONResponse(
            {"detail": "Missing GEMINI_API_KEY in environment."}, status_code=500
        )

    # Read images into memory
    image_parts = []
    valid_files = []
    for file in files:
        part = await _image_part_from_upload(file)
        if not part["data"]:
            continue
        image_parts.append(part)
        valid_files.append(file.filename)

    if not image_parts:
        return JSONResponse({"detail": "No valid image data received."}, status_code=400)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-2.0-flash",
        generation_config={
            "response_mime_type": "application/json"
        }
    )

    frame_count = len(image_parts)
    prompt = (
        "You are a traffic analysis system. Analyze the provided image frames strictly and produce JSON only. "
        f"There are {frame_count} frame(s). For each frame, estimate vehicle counts (cars, trucks, buses, motorcycles), "
        "total vehicle_count, congestion_level ('Light'|'Medium'|'Heavy'), and ambulance_detected. Also provide an overall_analysis "
        "summarizing averages and trends across frames with a concise recommendation. JSON schema: "
        "{overall_analysis:{average_vehicle_count:number, congestion_trend:'Increasing'|'Decreasing'|'Stable', "
        "estimated_clearance_time:string, ambulance_present_in_any_frame:boolean, dominant_vehicle_types:string[], recommendation?:string}, "
        "frame_by_frame_analysis:[{frame_number:number, vehicle_count:number, congestion_level:'Light'|'Medium'|'Heavy', ambulance_detected:boolean, "
        "vehicle_breakdown:{cars:number, trucks:number, buses:number, motorcycles:number}}]]}. "
        "Rules: (1) Output compact JSON only. (2) Use distinct values per frame based on visual differences. (3) Keep numbers realistic."
    )

    try:
        resp = model.generate_content([prompt, *image_parts])
        # With response_mime_type application/json, resp.text should be raw JSON string.
        text = (getattr(resp, "text", None) or "").strip()
        if not text and getattr(resp, "candidates", None):
            # Fallback path: try to extract from first candidate part
            parts = resp.candidates[0].content.parts
            if parts and hasattr(parts[0], "text"):
                text = (parts[0].text or "").strip()
        # Final guard: strip code fences if model still added them
        if text.startswith("```"):
            text = text.strip('`')
            if text.startswith("json"):
                text = text[4:]
        try:
            data = json.loads(text)
        except Exception:
            # Attempt to extract the first JSON object substring
            import re
            m = re.search(r"\{[\s\S]*\}$", text)
            if not m:
                return JSONResponse({"detail": "Gemini returned non-JSON response."}, status_code=502)
            data = json.loads(m.group(0))
        return JSONResponse(data)
    except Exception as e:
        # Return explicit error so UI shows the issue instead of reusing mock
        return JSONResponse({"detail": f"Gemini analysis failed: {str(e)}"}, status_code=502)


if __name__ == "__main__":
    # Quick local runner for development
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8003)
