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


def update_device(device, action, value=None):
    if device not in devices:
        print("INVALID DEVICE:", device)
        return
    # standard power actions
    if action == "on":
        devices[device]["state"] = "on"

    elif action == "off":
        devices[device]["state"] = "off"

    # door security
    elif action == "lock":
        devices[device]["state"] = "locked"

    elif action == "unlock":
        devices[device]["state"] = "unlocked"

    # alarm system
    elif action == "arm":
        devices[device]["state"] = "armed"

    elif action == "disarm":
        devices[device]["state"] = "disarmed"

    # temperature devices
    elif action == "set_temp":
        devices[device]["temperature"] = value

    # brightness control
    elif action == "dim":
        devices[device]["brightness"] = value

    # cooling shortcut
    elif action == "cool":
        devices[device]["state"] = "on"
        devices[device]["temperature"] = 22

    return {
        "device": device,
        "status": devices[device]
    }