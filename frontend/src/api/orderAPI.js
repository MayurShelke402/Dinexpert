import axios from "axios";

const API="http://localhost:8080/api/orders";

// utils/api.js

export const createOrder = async ({ tableId, items, notes, userId, hotelId,total }) => {
  const res = await fetch(`${API}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, items, notes, userId, hotelId,total }),
  });
  
  let data;

  try {
    data = await res.json();
  } catch (err) {
    // If response is HTML or not JSON, throw a generic error
    throw new Error("Server returned invalid JSON response.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
};


