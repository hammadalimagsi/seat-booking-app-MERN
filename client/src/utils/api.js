const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Seats
  getSeats: async () => {
    const res = await fetch(`${API_BASE}/seats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  bookSeat: async (seatId) => {
    const res = await fetch(`${API_BASE}/seats/book/${seatId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  cancelBooking: async () => {
    const res = await fetch(`${API_BASE}/seats/cancel`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
