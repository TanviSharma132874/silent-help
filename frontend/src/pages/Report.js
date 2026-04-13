import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Report() {
  const [analytics, setAnalytics] = useState(null);
  const [weeklyChart, setWeeklyChart] = useState(null);
  const [subjectChart, setSubjectChart] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#244764",
          font: {
            family: "Manrope"
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#58708a" },
        grid: { color: "rgba(53,96,143,0.08)" }
      },
      y: {
        ticks: { color: "#58708a" },
        grid: { color: "rgba(53,96,143,0.08)" }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const report = await API.get("/analytics/report");
    const weekly = await API.get("/analytics/weekly-chart");
    const subject = await API.get("/analytics/subject-wise");

    setAnalytics(report.data.analytics);

    setWeeklyChart({
      labels: weekly.data.labels,
      datasets: [{
        label: "Study Minutes",
        data: weekly.data.data,
        backgroundColor: "rgba(31,111,235,0.82)",
        borderRadius: 8,
        borderSkipped: false
      }]
    });

    setSubjectChart({
      labels: subject.data.labels,
      datasets: [{
        label: "Subject Time",
        data: subject.data.data,
        backgroundColor: [
          "#2db591", "#f4a259", "#1f6feb",
          "#e76f51", "#264653", "#6aaed6"
        ],
        borderColor: "#ffffff",
        borderWidth: 2
      }]
    });
  };

  if (!analytics) return <p className="text-center mt-5">Loading...</p>;

  const totalHours = ((analytics.totalMinutes || 0) / 60).toFixed(2);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-container">

        <h2 className="title-gradient">Weekly Report</h2>

        {/* WEEKLY */}
        <div className="card-modern p-4 mb-4">
          <h5>Study Trend</h5>
          <div className="chart-wrap">
            {weeklyChart && <Bar data={weeklyChart} options={chartOptions} />}
          </div>
        </div>

        {/* SUBJECT */}
        <div className="card-modern p-4 mb-4">
          <h5>Subject Analysis</h5>

          <div className="d-flex justify-content-center">
            <div style={{ width: "300px", height: "300px" }}>
              {subjectChart && <Pie data={subjectChart} options={chartOptions} />}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Total Study</h6>
              <h3>{totalHours} hrs</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Focus</h6>
              <h3>{analytics.focusScore}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-modern p-3 text-center metric-card">
              <h6>Burnout</h6>
              <h3>{analytics.burnout}</h3>
            </div>
          </div>
        </div>

        <div className="card-modern p-3 mt-4">
          <p className="mb-0"><strong>Insight:</strong> {analytics.suggestion}</p>
        </div>

      </div>
    </div>
  );
}