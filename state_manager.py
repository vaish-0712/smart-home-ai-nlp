import time

devices = {
    "lights": {"state": "off"},
    "tv": {"state": "off"},
    "speaker": {"state": "off"},
    "ac": {"state": "off"},
    "heater": {"state": "off"},
    "exhaust_fan": {"state": "off"},
    "water_heater": {"state": "off"},
    "cameras": {"state": "off"},
    "alarm": {"state": "disarmed"},
    "door": {"state": "locked"}
}

POWER_RATINGS = {
    "lights": 10,
    "tv": 100,
    "speaker": 20,
    "ac": 1500,
    "heater": 2000,
    "exhaust_fan": 70,
    "water_heater": 2000,
    "cameras": 15,
    "alarm": 10
}

usage_tracker = {}

# ✅ SINGLE CORRECT FUNCTION
def update_device(device, action, value=None):

    if device not in devices:
        print("INVALID DEVICE:", device)
        return

    # ---------------- ON ----------------
    if action == "on":
        devices[device]["state"] = "on"
        usage_tracker[device] = time.time()

    # ---------------- OFF ----------------
    elif action == "off":
        devices[device]["state"] = "off"

        if device in usage_tracker:
            duration = time.time() - usage_tracker[device]

            energy = (POWER_RATINGS.get(device, 0) * duration) / 3600000

            devices[device]["energy"] = devices[device].get("energy", 0) + energy

            del usage_tracker[device]

    # ---------------- DOOR ----------------
    elif action == "lock":
        devices[device]["state"] = "locked"

    elif action == "unlock":
        devices[device]["state"] = "unlocked"

    # ---------------- ALARM ----------------
    elif action == "arm":
        devices[device]["state"] = "armed"

    elif action == "disarm":
        devices[device]["state"] = "disarmed"

    # ---------------- TEMPERATURE ----------------
    elif action == "set_temp":
        devices[device]["temperature"] = value

    # ---------------- DIM ----------------
    elif action == "dim":
        devices[device]["brightness"] = value

    # ---------------- COOL MODE ----------------
    elif action == "cool":
        devices[device]["state"] = "on"
        devices[device]["temperature"] = 22
        usage_tracker[device] = time.time()

    return {
        "device": device,
        "status": devices[device]
    }
def energy_suggestions():

    suggestions = []

    if devices["ac"]["state"] == "on":
        suggestions.append("Set AC to 24°C to save energy")

    if devices["lights"]["state"] == "on":
        suggestions.append("Turn off lights in unused rooms")

    if devices["water_heater"]["state"] == "on":
        suggestions.append("Turn off water heater when not needed")

    if devices["heater"]["state"] == "on":
        suggestions.append("Lower heater usage to save power")

    return suggestions