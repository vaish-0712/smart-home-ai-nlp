from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import json
import asyncio

from nlp_engine import detect_intent
from modes import good_night_mode, movie_mode, morning_mode, away_mode
from state_manager import devices, update_device, energy_suggestions
from logs import add_log, get_logs

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- REQUEST MODEL ----------------
class Command(BaseModel):
    text: str


# ---------------- COMMAND API ----------------
@app.post("/command")
def process_command(cmd: Command):

    try:
        print("\nCOMMAND:", cmd.text)

        intent = detect_intent(cmd.text)
        add_log(cmd.text, intent)

        # ---------------- MODE ----------------
        if intent.get("intent") == "mode":

            mode = intent.get("mode")

            if mode == "good_night":
                good_night_mode()

            elif mode == "movie":
                movie_mode()

            elif mode == "morning":
                morning_mode()

            elif mode == "away":
                away_mode()

            return {
                "message": "mode executed",
                "devices": devices
            }

        # ---------------- DEVICE ----------------
        if intent.get("intent") == "multi_device":

            actions = intent.get("actions", [])

            for action in actions:

                device = action["device"]
                act = action["action"]

                # ✅ FIXED: always use update_device
                if act == "set_temp":
                    update_device(device, "set_temp", action.get("value"))
                    update_device(device, "on")  # ensures energy tracking

                else:
                    update_device(device, act)

            return {
                "message": "devices updated",
                "actions": actions,
                "devices": devices
            }

        # ---------------- UNKNOWN ----------------
        return {
            "message": "command not understood",
            "devices": devices
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "message": "internal error",
            "devices": devices
        }


# ---------------- SSE STREAM ----------------
async def event_generator():
    try:
        while True:
            yield f"data: {json.dumps(devices)}\n\n"
            await asyncio.sleep(1)
    except asyncio.CancelledError:
        print("SSE client disconnected cleanly")


@app.get("/stream")
def stream():
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


# ---------------- ENERGY API ----------------
@app.get("/energy")
def get_energy():

    total = 0

    for device in devices:
        total += devices[device].get("energy", 0)

    cost_per_unit = 6  # ₹ per kWh

    return {
        "total_energy": round(total, 3),
        "estimated_bill": round(total * cost_per_unit, 2),
        "devices": devices  # ✅ important for frontend
    }


# ---------------- ENERGY SUGGESTIONS ----------------
@app.get("/energy-suggestions")
def get_suggestions():
    return {
        "suggestions": energy_suggestions()
    }


# ---------------- OTHER APIs ----------------
@app.get("/devices")
def get_devices():
    return devices


@app.get("/logs")
def view_logs():
    return get_logs()


@app.get("/")
def home():
    return {
        "message": "Smart Home AI Backend Running"
    }