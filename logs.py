from datetime import datetime

command_logs = []

def add_log(command, intent):

    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "command": command,
        "intent": intent
    }

    command_logs.append(log_entry)


def get_logs():
    return command_logs