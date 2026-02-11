import { apiRequest } from './api';

export async function addPerformance(body) {
  return apiRequest('/performance', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchPerformance(facultyId) {
  return apiRequest(`/performance/${facultyId}`);
}

export async function updatePerformance(id, body) {
  return apiRequest(`/performance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deletePerformance(id) {
  return apiRequest(`/performance/${id}`, { method: 'DELETE' });
}

export async function getAllReports() {
  return apiRequest('/reports');
}

export async function getFacultyReport(facultyId) {
  return apiRequest(`/reports/faculty/${facultyId}`);
}
