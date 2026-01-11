import express from 'express';
import http from "http";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import orderrouter from './routes/orderRoutes.js'
import tablerouter from './routes/tableRoutes.js';
import authrouter from './routes/authRoutes.js';
import menurouter from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import presetRoutes from './routes/presetRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminMenuRoutes from './routes/adminMenuRoutes.js';

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // In production, use your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit('hello', 'This is from the server!');
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.use(express.json());
app.use(cors());

app.use('/api/hotels', hotelRoutes);
app.use('/api/tables',tablerouter)
app.use('/api/orders',orderrouter)
app.use('/api/user',authrouter)
app.use('/api/menu',menurouter)
app.use("/api/categories", categoryRoutes);
app.use("/api/presets", presetRoutes);
app.use("/api/admin/orders", orderrouter);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/menu-items", adminMenuRoutes);



mongoose.connect(process.env.MONGO_URI, )
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
