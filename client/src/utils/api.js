const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    return data;
  } else {
    // If not JSON, it might be an HTML error page (404/500)
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Server Error (${response.status}): The server returned a non-JSON response. Check if your API URL is correct.`);
    }
    return text;
  }
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
  },

  // Admin
  adminReset: async (password) => {
    const res = await fetch(`${API_BASE}/seats/admin/reset`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'x-admin-password': password
      }
    });
    return handleResponse(res);
  },

  adminIncrease: async (password, count) => {
    const res = await fetch(`${API_BASE}/seats/admin/increase`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'x-admin-password': password
      },
      body: JSON.stringify({ count })
    });
    return handleResponse(res);
  },

  adminDecrease: async (password, count) => {
    const res = await fetch(`${API_BASE}/seats/admin/decrease`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'x-admin-password': password
      },
      body: JSON.stringify({ count })
    });
    return handleResponse(res);
  }
};
