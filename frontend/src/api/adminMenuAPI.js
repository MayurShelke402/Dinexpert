// api/menuItemsAPI.js
const BASE_URL = 'http://localhost:8080';

// Get all menu items
export const fetchMenuItems = async (hotelId) => {
   
    
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/all?hotelId=${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Get single menu item
export const fetchMenuItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

// Create new menu item
// api/adminMenuAPI.js
export const createMenuItem = async (formData) => {
  
  
  try {
    const response = await fetch(`${BASE_URL}/api/menu/create`, {
      method: 'POST',
      headers: {
        // ❌ REMOVE Content-Type - browser will set it automatically with boundary for FormData
        // 'Content-Type': 'application/json',  // DON'T SET THIS
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData  // ✅ Send FormData directly, NO JSON.stringify()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};


// Update menu item
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Patch menu item (partial update)
export const patchMenuItem = async (itemId, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/patch/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error patching menu item:', error);
    throw error;
  }
};

// Delete menu item
export const deleteMenuItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/${itemId}`, {
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
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Toggle item availability
export const toggleMenuItemAvailability = async (itemId, isAvailable) => {
  try {
    return await patchMenuItem(itemId, { isAvailable });
  } catch (error) {
    console.error('Error toggling availability:', error);
    throw error;
  }
};

// Upload image
export const uploadMenuItemImage = async (file,itemId) => {
  try {
    const formData = new FormData();
    formData.append('images', file);

    const response = await fetch(`${BASE_URL}/api/admin/menu-items/upload/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get menu items by category
export const fetchMenuItemsByCategory = async (hotelId, category) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items?hotelId=${hotelId}&category=${category}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw error;
  }
};

// Search menu items
export const searchMenuItems = async (hotelId, searchQuery) => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/menu-items/search?hotelId=${hotelId}&q=${searchQuery}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching menu items:', error);
    throw error;
  }
};
