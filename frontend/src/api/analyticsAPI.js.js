// api/analyticsAPI.js
const BASE_URL = 'http://localhost:8080'; // Your backend URL

export const fetchAnalytics = async (startDate, endDate, hotelId) => {

  
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (hotelId) params.append('hotelId', hotelId);

    const response = await fetch(`${BASE_URL}/api/admin/analytics?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // If using auth
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const fetchDailySummary = async (date, hotelId) => {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (hotelId) params.append('hotelId', hotelId);

    const response = await fetch(`${BASE_URL}/api/admin/analytics/daily?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

export const fetchPeakHours = async (startDate, endDate, hotelId) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (hotelId) params.append('hotelId', hotelId);

    const response = await fetch(`${BASE_URL}/api/admin/analytics/peak-hours?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching peak hours:', error);
    throw error;
  }
};
