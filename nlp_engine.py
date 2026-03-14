import re

# ---------------- DEVICE LIST ----------------

devices = [
    "lights",
    "tv",
    "speaker",
    "ac",
    "heater",
    "exhaust_fan",
    "water_heater",
    "cameras",
    "alarm",
    "door"
]

# ---------------- DEVICE ALIASES ----------------

device_alias = {
    "fan": "exhaust_fan",
    "bath heater": "water_heater",
    "water heater": "water_heater",
    "camera": "cameras",
    "security camera": "cameras"
}

# ---------------- ACTION WORDS ----------------

on_words = ["turn on", "switch on", "start", "activate", "enable"]
off_words = ["turn off", "switch off", "stop", "disable"]

# ---------------- TEXT NORMALIZATION ----------------

def normalize_text(text):

    text = text.lower()

    # remove punctuation
    text = re.sub(r"[^\w\s]", "", text)

    fillers = [
        "please",
        "can you",
        "could you",
        "would you",
        "hey",
        "assistant"
    ]

    for word in fillers:
        text = text.replace(word, "")

    return text.strip()

# ---------------- INTENT DETECTION ----------------

def detect_intent(text):

    text = normalize_text(text)

    # ---------------- DEVICE ALIASES ----------------

    for alias, real_device in device_alias.items():
        text = re.sub(rf"\b{alias}\b", real_device, text)

    # ---------------- SMART MODES ----------------

    if "good night" in text:
        return {"intent": "mode", "mode": "good_night"}

    if "movie mode" in text or "movie" in text:
        return {"intent": "mode", "mode": "movie"}

    if "morning mode" in text or "morning" in text:
        return {"intent": "mode", "mode": "morning"}

    if "away mode" in text or "leaving" in text or "away" in text:
        return {"intent": "mode", "mode": "away"}

    # ---------------- CONTEXT COMMANDS ----------------

    if "cool the room" in text or "im hot" in text:
        return {
            "intent": "multi_device",
            "actions": [
                {"device": "ac", "action": "cool"}
            ]
        }

    # ---------------- TEMPERATURE COMMAND ----------------

    match = re.search(r"set ac to (\d+)", text)

    if match:

        temp = int(match.group(1))

        return {
            "intent": "multi_device",
            "actions": [
                {"device": "ac", "action": "set_temp", "value": temp}
            ]
        }

    # ---------------- SECURITY COMMANDS ----------------

    if "arm alarm" in text or "turn on alarm" in text:
        return {
            "intent": "multi_device",
            "actions": [{"device": "alarm", "action": "arm"}]
        }

    if "disarm alarm" in text or "turn off alarm" in text:
        return {
            "intent": "multi_device",
            "actions": [{"device": "alarm", "action": "disarm"}]
        }

    # ---------------- DEVICE COMMAND PARSER ----------------

    actions = []

    for device in sorted(devices, key=len, reverse=True):

        if device in text:

            # Door special handling
            if device == "door":

                if "unlock" in text:
                    actions.append({"device": "door", "action": "unlock"})
                    continue

                elif "lock" in text:
                    actions.append({"device": "door", "action": "lock"})
                    continue

            # ON commands
            for word in on_words:
                if word in text:
                    actions.append({"device": device, "action": "on"})
                    break

            # OFF commands
            for word in off_words:
                if word in text:
                    actions.append({"device": device, "action": "off"})
                    break
            # ---------------- LIGHT CONTEXT COMMANDS ----------------

            if "dark" in text or "too dark" in text or "its dark" in text:
                return {
                "intent": "multi_device",
                "actions": [
                {"device": "lights", "action": "on"}]}
            if "cold" in text or "freezing" in text:
                return {
                "intent": "multi_device",
                "actions": [{"device": "heater", "action": "on"}]
                }
            if "leaving the house" in text:
                return {"intent": "mode", "mode": "away"}
    
    

    if actions:
        return {"intent": "multi_device", "actions": actions}

    return {"intent": "unknown"}