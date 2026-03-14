import React, { useState } from "react";

function CommandInput({ refreshDevices, refreshLogs }) {

  const [command, setCommand] = useState("");
  const [status, setStatus] = useState("");
  const [listening, setListening] = useState(false);

  const sendCommand = async (text) => {

    const commandText = text || command;

    if (!commandText.trim()) return;

    try {

      await fetch("http://127.0.0.1:8000/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: commandText })
      });

      setStatus("✅ Command executed");

      setCommand("");

      refreshDevices();
      refreshLogs();

    } catch (error) {

      setStatus("⚠ Backend connection error");

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