from state_manager import update_device


def morning_mode():

    update_device("lights", "on")
    update_device("ac", "off")
    update_device("heater", "on")
    update_device("door", "unlock")
    update_device("alarm", "disarm")
    update_device("water_heater","on")


def movie_mode():

    update_device("lights", "off")
    update_device("tv", "on")
    update_device("speaker", "on")
    update_device("ac","on")


def good_night_mode():

    update_device("lights", "off")
    update_device("tv", "off")
    update_device("speaker", "off")
    update_device("door", "lock")
    update_device("alarm", "arm")
    update_device("ac","on")
    update_device("heater","off")


def away_mode():

    update_device("lights", "off")
    update_device("tv", "off")
    update_device("heater", "off")
    update_device("door", "lock")
    update_device("alarm", "arm")
    update_device("cameras","on")