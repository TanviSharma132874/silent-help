import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({});
  const [dailyGoal, setDailyGoal] = useState(300);
  const [inputGoal, setInputGoal] = useState("");

  const [subject, setSubject] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breakCount, setBreakCount] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchDashboard = async () => {
    const res = await API.get("/analytics/dashboard");
    setAnalytics(res.data.analytics || {});
    setDailyGoal(res.data.dailyGoal || 300);
  };

  const startSession = async () => {
    if (!subject) return alert("Enter subject");

    const res = await API.post("/session/start", { subject });

    setSessionId(res.data.session._id);
    setIsRunning(true);
    setTimer(0);
    setBreakCount(0);
  };

  const endSession = async () => {
    await API.post("/session/end", { sessionId, breakCount });

    setIsRunning(false);
    setSessionId(null);
    setTimer(0);
    setBreakCount(0);
    setSubject("");

    fetchDashboard();
  };

  const takeBreak = () => {
    setBreakCount(prev => prev + 1);
  };

  const updateGoal = async () => {
    if (!inputGoal) return;

    await API.post("/auth/goal", { goal: Number(inputGoal) });

    setDailyGoal(Number(inputGoal));
    setInputGoal("");
  };

  const total = analytics.totalMinutes || 0;
  const percent = Math.min((total / dailyGoal) * 100, 100);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-container">

        <h2 className="title-gradient">Dashboard</h2>

        {/* STUDY SESSION */}
        <div className="card-modern p-4 mb-4">
          <h5 className="mb-3">Study Session</h5>

          <div className="d-flex flex-column flex-md-row mb-3">
            <input
              type="text"
              className="form-control me-md-2 mb-2 mb-md-0"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {!isRunning ? (
              <button className="btn btn-modern btn-brand" onClick={startSession}>
                Start
              </button>
            ) : (
              <button className="btn btn-modern btn-danger-modern" onClick={endSession}>
                End
              </button>
            )}
          </div>

          <p className="session-timer mb-2">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </p>

          {isRunning && (
            <div className="mt-2">
              <button className="btn btn-modern btn-warn-modern me-2" onClick={takeBreak}>
                Break
              </button>
              <span className="text-muted-small">Breaks: {breakCount}</span>
            </div>
          )}
        </div>

        {/* GOAL */}
        <div className="card-modern p-4 mb-4">
          <h5>Daily Goal</h5>

          <div className="d-flex flex-column flex-md-row mb-3">
            <input
              type="number"
              className="form-control me-md-2 mb-2 mb-md-0"
              placeholder="Set goal"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
            />

            <button className="btn btn-modern btn-ink" onClick={updateGoal}>
              Set
            </button>
          </div>

          <p className="text-muted-small">{total} / {dailyGoal} mins</p>

          <div className="progress">
            <div className="progress-bar" style={{ width: `${percent}%` }}>
              {Math.round(percent)}%
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Total</h6>
              <h3>{total} mins</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-modern p-3 text-center metric-card">
              <h6>🔥 Streak</h6>
              <h3>{analytics.streak || 0}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Focus</h6>
              <h3>{analytics.focusScore}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Burnout</h6>
              <h3>{analytics.burnout}</h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}