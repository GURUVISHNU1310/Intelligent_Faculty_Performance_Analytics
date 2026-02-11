/**
 * Performance Score Logic
 * totalScore = teachingScore*0.3 + studentFeedback*0.25 + attendance*0.2 + researchPapers*0.15 + adminWork*0.1
 * Level: >=85 Excellent, >=70 Very Good, >=55 Good, <55 Needs Improvement
 */
function calculatePerformanceScore(teachingScore, studentFeedback, attendance, researchPapers, adminWork) {
  const totalScore = Math.round(
    teachingScore * 0.3 +
    studentFeedback * 0.25 +
    attendance * 0.2 +
    researchPapers * 0.15 +
    adminWork * 0.1
  );
  let performanceLevel = 'Needs Improvement';
  if (totalScore >= 85) performanceLevel = 'Excellent';
  else if (totalScore >= 70) performanceLevel = 'Very Good';
  else if (totalScore >= 55) performanceLevel = 'Good';
  return { totalScore, performanceLevel };
}

module.exports = { calculatePerformanceScore };
