import { apiRequest } from './api';

export async function fetchFaculty() {
  return apiRequest('/faculty');
}

export async function fetchFacultyById(id) {
  return apiRequest(`/faculty/${id}`);
}

export async function addFaculty(body) {
  return apiRequest('/faculty', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateFaculty(id, body) {
  return apiRequest(`/faculty/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteFaculty(id) {
  return apiRequest(`/faculty/${id}`, { method: 'DELETE' });
}
