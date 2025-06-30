const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to handle fetch responses and errors
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: 'Invalid server response' };
  }
  if (!res.ok) throw data;
  return data;
}

export const adminApi = {
  // Service APIs
  getServices: () =>
    fetch(`${BASE_URL}/services`).then(handleResponse),

  createService: (formData) =>
    fetch(`${BASE_URL}/admin/services`, {
      method: 'POST',
      body: formData,
      // credentials: 'include', // Uncomment if your API needs cookies
    }).then(handleResponse),

  updateService: (id, formData) =>
    fetch(`${BASE_URL}/admin/services/${id}`, {
      method: 'PUT',
      body: formData,
      // credentials: 'include',
    }).then(handleResponse),

  deleteService: (id) =>
    fetch(`${BASE_URL}/admin/services/${id}`, {
      method: 'DELETE',
      // credentials: 'include',
    }).then(handleResponse),

  // Order APIs
  getOrders: () =>
    fetch(`${BASE_URL}/admin/orders`).then(handleResponse),

  assignTailor: (orderId, tailorId) =>
    fetch(`${BASE_URL}/admin/orders/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, tailorId }),
      // credentials: 'include',
    }).then(handleResponse),

  sendPaymentRequest: (orderId) =>
    fetch(`${BASE_URL}/admin/orders/payment-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
      // credentials: 'include',
    }).then(handleResponse),
};