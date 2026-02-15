import { apiRequest } from './api';

export async function login(username, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data;
}

export async function register(username, password, role = 'FACULTY', email = null) {
  const body = { username, password, role };
  if (role === 'FACULTY' && email) body.email = email;
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
}

export function storeToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function logout() {
  removeToken();
}
