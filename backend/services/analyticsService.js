exports.calculateAnalytics = (sessions) => {

  let totalMinutes = 0;
  let totalBreaks = 0;

  sessions.forEach(s => {
    totalMinutes += s.duration || 0;
    totalBreaks += s.breakCount || 0;
  });

  // Burnout
  let burnout = "Low";

  if (totalMinutes > 300 && totalBreaks < 2) {
    burnout = "High";
  } else if (totalMinutes > 180) {
    burnout = "Medium";
  }

  // Focus Score
  let focusScore = 50;

  if (totalBreaks <= 2) focusScore += 20;
  if (totalMinutes > 120) focusScore += 20;

  if (totalBreaks > 5) focusScore -= 20;

  if (focusScore > 100) focusScore = 100;
  if (focusScore < 0) focusScore = 0;

  // Suggestion
  let suggestion = "Good consistency";

  if (burnout === "High") {
    suggestion = "Take more breaks to avoid burnout";
  } else if (focusScore < 50) {
    suggestion = "Try longer focused sessions";
  }

  // 🔥 STREAK LOGIC
  const uniqueDays = new Set();

  sessions.forEach(s => {
    const date = new Date(s.createdAt).toISOString().split("T")[0];
    uniqueDays.add(date);
  });

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  let streak = 0;
  let today = new Date();

  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(today.getDate() - i);

    const expectedStr = expectedDate.toISOString().split("T")[0];

    if (sortedDays.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalMinutes,
    focusScore,
    burnout,
    suggestion,
    streak // ✅ NEW
  };
};