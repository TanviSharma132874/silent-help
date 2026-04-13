import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Session() {
  const [subject, setSubject] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [breakCount, setBreakCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  // ⏱ TIMER LOGIC
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // ▶ START
  const startSession = async () => {
    if (!subject) {
      alert("Enter subject");
      return;
    }

    const res = await API.post("/session/start", { subject });
    setSessionId(res.data.session._id);
    setIsRunning(true);
    setSeconds(0);
  };

  // ⏹ END
  const endSession = async () => {
    await API.post("/session/end", {
      sessionId,
      breakCount
    });

    setIsRunning(false);
    alert("Session Ended");
    navigate("/dashboard");
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-container">

        <div className="card-modern p-4">

          <h3 className="title-gradient mb-3">Study Session</h3>

          <input
            className="form-control mb-3"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* TIMER */}
          <div className="mb-3">
            <p className="session-timer">{formatTime()}</p>
          </div>

          {/* BUTTONS */}
          <div className="mb-3">
            <button
              className="btn btn-modern btn-brand me-2 mb-2 mb-md-0"
              onClick={startSession}
              disabled={isRunning}
            >
              Start
            </button>

            <button
              className="btn btn-modern btn-danger-modern me-2 mb-2 mb-md-0"
              onClick={endSession}
              disabled={!isRunning}
            >
              End
            </button>

            <button
              className="btn btn-modern btn-warn-modern"
              onClick={() => setBreakCount(breakCount + 1)}
              disabled={!isRunning}
            >
              Break ({breakCount})
            </button>
          </div>

          {/* STATUS */}
          {isRunning && (
            <span className="status-pill">Session is running</span>
          )}

        </div>

      </div>
    </div>
  );
}