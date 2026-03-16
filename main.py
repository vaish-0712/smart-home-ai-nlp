from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from nlp_engine import detect_intent
from modes import good_night_mode, movie_mode, morning_mode, away_mode
from state_manager import devices, update_device
from logs import add_log, get_logs


app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Request schema
class Command(BaseModel):
    text: str


# ---------------- COMMAND API ----------------

@app.post("/command")
def process_command(cmd: Command):

    try:

        print("\n----------------------------")
        print("COMMAND RECEIVED:", cmd.text)

        # Detect NLP intent
        intent = detect_intent(cmd.text)

        # Store command log
        add_log(cmd.text, intent)

        print("INTENT DETECTED:", intent)

        # ---------------- MODE EXECUTION ----------------

        if intent.get("intent") == "mode":

            mode = intent.get("mode")

            if mode == "good_night":
                print("EXECUTING GOOD NIGHT MODE")
                good_night_mode()

            elif mode == "movie":
                print("EXECUTING MOVIE MODE")
                movie_mode()

            elif mode == "morning":
                print("EXECUTING MORNING MODE")
                morning_mode()

            elif mode == "away":
                print("EXECUTING AWAY MODE")
                away_mode()

            print("RESULT: MODE EXECUTED")

            return {
                "message": "mode executed",
                "devices": devices
            }

        # ---------------- DEVICE EXECUTION ----------------

        if intent.get("intent") == "multi_device":

            actions = intent.get("actions", [])

            for action in actions:

                device = action["device"]
                act = action["action"]

                print(f"ACTION: {device} -> {act}")

                update_device(device, act)

            if len(actions) == 1:
                print("RESULT: SINGLE DEVICE UPDATED")
            else:
                print("RESULT: MULTIPLE DEVICES UPDATED")

            return {
                "message": "devices updated",
                "actions": actions,
                "devices": devices
            }

        # ---------------- UNKNOWN COMMAND ----------------

        print("RESULT: COMMAND NOT UNDERSTOOD")

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


# ---------------- LOG API ----------------

@app.get("/logs")
def view_logs():
    return get_logs()


# ---------------- DEVICE STATE API ----------------

@app.get("/devices")
def get_devices():
    return devices
@app.get("/")
def home():
    return {"message": "Smart Home AI Backend Running"}