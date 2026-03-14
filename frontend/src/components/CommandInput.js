import React, { useState } from "react";

function CommandInput({ refreshDevices, refreshLogs }) {

  const [command, setCommand] = useState("");
  const [status, setStatus] = useState("");
  const [listening, setListening] = useState(false);

  const sendCommand = async (text) => {

  const commandText = text || command;

  if (!commandText.trim()) return;

  try {

    const response = await fetch("http://127.0.0.1:8000/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: commandText })
    });

    const data = await response.json();
    // SMART SPEECH RESPONSE

if (data.actions && data.actions.length > 0) {

  const action = data.actions[0];
  const device = action.device.replace("_", " ");
  const act = action.action;

  if (act === "on") {
    speak(`${device} turned on`);
  }

  else if (act === "off") {
    speak(`${device} turned off`);
  }

  else if (act === "lock") {
    speak(`${device} locked`);
  }

  else if (act === "unlock") {
    speak(`${device} unlocked`);
  }

  else if (act === "arm") {
    speak(`${device} armed`);
  }

  else if (act === "disarm") {
    speak(`${device} disarmed`);
  }

}

else if (data.message === "mode executed") {

  speak("Automation mode activated");

}

else {

  speak("Command executed");

}


    setStatus("✅ Command executed");

    setCommand("");

    refreshDevices();
    refreshLogs();

  } catch (error) {

    setStatus("⚠ Backend connection error");
    speak("Backend connection error");

  }

};
  const startVoiceRecognition = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {

      const speechText = event.results[0][0].transcript;

      setCommand(speechText);

      sendCommand(speechText);
    };

    recognition.onend = () => {
      setListening(false);
    };

  };

  function speak(text) {

  const speech = new SpeechSynthesisUtterance(text);

  const voices = window.speechSynthesis.getVoices();

  // choose a good voice
  const preferredVoice = voices.find(
    voice => voice.name.includes("Samantha") || voice.name.includes("Google")
  );

  if (preferredVoice) {
    speech.voice = preferredVoice;
  }

  speech.rate = 0.95;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);

}

  return (

    <div>

      <h2>Command Center</h2>

      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter command..."
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={() => sendCommand()}
        style={{ marginLeft: "10px", padding: "8px 15px" }}
      >
        Send
      </button>

      <button
        onClick={startVoiceRecognition}
        style={{ marginLeft: "10px", padding: "8px 15px" }}
      >
        🎤 {listening ? "Listening..." : "Voice"}
      </button>

      {status && (
        <div style={{ marginTop: "15px", color: "green" }}>
          {status}
        </div>
      )}

    </div>

  );
}

export default CommandInput;