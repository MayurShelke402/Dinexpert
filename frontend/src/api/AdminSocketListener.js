import { io } from "socket.io-client";
import { useEffect } from "react";

export default function AdminSocketListener() {
  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("newOrder", (order) => {
      console.log("New order:", order);
      // Update state here
    });

    socket.on("orderUpdated", (order) => {
      console.log("Order updated:", order);
      // Update state here
    });

    socket.on('hello', (msg) => {
  console.log('Server says:', msg);
    });

    socket.on("tableUpdated", (table) => {
      console.log("Table updated:", table);
      // Update state here
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
