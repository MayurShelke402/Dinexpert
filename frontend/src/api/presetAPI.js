// api/presetAPI.js
const BASE_URL = 'http://localhost:8080/api/presets';

// Get all active presets for a hotel
export const fetchActivePresets = async (hotelId) => {
  try {
    const response = await fetch(`${BASE_URL}/active?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching active presets:', error);
    throw error;
  }
};

// Get all presets for a hotel (admin)
export const fetchPresets = async (hotelId) => {
  try {
    const response = await fetch(`${BASE_URL}?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching presets:', error);
    throw error;
  }
};

// Get presets by tag
export const fetchPresetsByTag = async (hotelId, tag) => {
  try {
    const response = await fetch(`${BASE_URL}/tag?hotelId=${hotelId}&tag=${tag}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching presets by tag:', error);
    throw error;
  }
};

// Get single preset by ID
export const fetchPresetById = async (presetId) => {
  try {
    const response = await fetch(`${BASE_URL}/${presetId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching preset:', error);
    throw error;
  }
};

// Create new preset
export const createPreset = async (presetData) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(presetData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating preset:', error);
    throw error;
  }
};

// Update preset
export const updatePreset = async (presetId, presetData) => {
  try {
    const response = await fetch(`${BASE_URL}/${presetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(presetData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating preset:', error);
    throw error;
  }
};

// Delete preset
export const deletePreset = async (presetId) => {
  try {
    const response = await fetch(`${BASE_URL}/${presetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting preset:', error);
    throw error;
  }
};

// Toggle preset active status
export const togglePresetStatus = async (presetId, isActive) => {
  try {
    const response = await fetch(`${BASE_URL}/${presetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ isActive })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling preset status:', error);
    throw error;
  }
};
