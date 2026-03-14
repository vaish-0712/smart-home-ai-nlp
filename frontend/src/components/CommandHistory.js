import React, { useEffect } from "react";

function CommandHistory({ logs, refreshLogs }) {

  useEffect(() => {
  refreshLogs();
}, [refreshLogs]);
  return (

    <div style={{ marginTop: "40px" }}>

      <h2>Command History</h2>

      {logs.length === 0 ? (
        <p>No commands yet</p>
      ) : (
        logs.map((log, index) => (

          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0"
            }}
          >

            <strong>{log.timestamp}</strong>

            <div>
              Command: {log.command}
            </div>

          </div>

        ))
      )}

    </div>

  );
}

export default CommandHistory;