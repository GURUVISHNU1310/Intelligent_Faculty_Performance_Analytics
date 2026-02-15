import { apiRequest } from './api';

export async function submitFeedback(facultyId, score) {
  return apiRequest('/feedback', {
    method: 'POST',
    body: JSON.stringify({ facultyId, score: Number(score) }),
  });
}

export async function getMyFeedbacks() {
  return apiRequest('/feedback/my');
}

export async function getFacultyFeedbackSummary(facultyId) {
  return apiRequest(`/feedback/summary/${facultyId}`);
}

export async function getAllFeedbackSummaries() {
  return apiRequest('/feedback/all-summaries');
}
