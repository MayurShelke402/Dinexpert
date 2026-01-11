import axios from "axios";
const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

export async function fetchTablesWithOrders() {
  const res = await fetch(`${BASE}/tables?includeOrders=true`);
  if (!res.ok) throw new Error("Failed to load tables");
  return res.json(); // expect { tables: [...] }
}

export async function fetchAllOrders() {
  const res = await fetch(`${BASE}/orders/all`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function updateOrderStatus(orderId, newStatus) {
  const res = await fetch(`${BASE}/orders/update/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update order");
  }
  return res.json();
}

export async function updateTableState(tableId, payload) {
  const res = await fetch(`${BASE}/tables/${tableId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update table");
  return res.json();
}

// api/adminAPI.js - Add this function
export const fetchOrderHistory = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Make hotelId optional for testing
    if (filters.hotelId) queryParams.append('hotelId', filters.hotelId);
    
    // Optional filters
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tableId) queryParams.append('tableId', filters.tableId);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    // Pagination parameters
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${BASE}/admin/orders/history?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Invalid response from server');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE}/admin/menu-items/delete/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to delete item`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
