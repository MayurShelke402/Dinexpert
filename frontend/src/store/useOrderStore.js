// store/useOrderStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io } from 'socket.io-client';
 // Adjust import path to your SOCKET_URL

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:808o';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // --- Core State ---
      activeOrders: [],
      completedOrders: [],
      sessionId: null,
      sessionStartTime: null,

      // --- WebSocket State ---
      socket: null,
      connectionStatus: 'disconnected',

      // --- Session Management ---
      startSession: () =>
        set({
          sessionId: `SESSION-${Date.now()}`,
          sessionStartTime: new Date().toISOString(),
          activeOrders: [],
          completedOrders: [],
        }),

      clearSession: () =>
        set({
          activeOrders: [],
          completedOrders: [],
          sessionId: null,
          sessionStartTime: null,
        }),

      // --- Order Management ---
      addActiveOrder: (orderData) =>
        set((state) => ({
          activeOrders: [
            ...state.activeOrders,
            {
              ...orderData,
              localId: `ORDER-${Date.now()}`,
              placedAt: new Date().toISOString(),
              status: 'pending',
            },
          ],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          activeOrders: state.activeOrders.map((order) =>
            order._id === orderId || order.localId === orderId
              ? { ...order, status, lastUpdated: new Date().toISOString() }
              : order
          ),
        })),

      markOrderAsServed: (orderId) =>
        set((state) => {
          const order = state.activeOrders.find(
            (o) => o._id === orderId || o.localId === orderId
          );
          if (!order) return state;

          return {
            activeOrders: state.activeOrders.filter(
              (o) => o._id !== orderId && o.localId !== orderId
            ),
            completedOrders: [
              ...state.completedOrders,
              {
                ...order,
                status: 'ready',
                servedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      // --- Getters ---
      getAllOrders: () => {
        const state = get();
        return [...state.activeOrders, ...state.completedOrders];
      },

      getTotalBill: () => {
        const state = get();
        const allOrders = [...state.activeOrders, ...state.completedOrders];
        return allOrders.reduce((total, order) => total + (order.total || 0), 0);
      },

      getPendingCount: () => {
        const state = get();
        return state.activeOrders.filter((o) => o.status !== 'ready').length;
      },

      getCompletedCount: () => {
        const state = get();
        return state.completedOrders.length;
      },

      getCompletedOrders: () => {
        const state = get();
        return state.completedOrders;
      },

      // --- Summary Helpers (ready orders shown as completed) ---
      getSummaryCompletedOrders: () => {
        const state = get();
        return state.completedOrders.map((order) => ({
          ...order,
          summaryStatus:
            order.status === 'ready' || order.status === 'served'
              ? 'completed'
              : order.status,
        }));
      },

      getSummaryCompletedCount: () => {
        const state = get();
        return state.completedOrders.filter(
          (o) => o.status === 'ready' || o.status === 'served'
        ).length;
      },

      // --- 🔌 WebSocket Integration (EXACT SAME as your dashboard) ---
      connectSocket: (hotelId, tableId) => {
        const existingSocket = get().socket;
        if (existingSocket?.connected) {
          console.log('✅ Socket already connected');
          return;
        }

        console.log('🔌 Connecting socket for', { hotelId, tableId });

        const socket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000,
        });

        // Same handlers as your dashboard
        const handleConnect = () => {
          console.log('✅ Socket connected');
          set({ connectionStatus: 'connected' });

          // Join rooms (match your backend room names)
          if (hotelId) socket.emit('joinHotel', hotelId);
          if (tableId) socket.emit('joinTable', tableId);
        };

        const handleDisconnect = () => {
          console.log('❌ Socket disconnected');
          set({ connectionStatus: 'disconnected' });
        };

        const handleOrderCreated = (newOrder) => {
          console.log('📦 New order created:', newOrder);
          set((state) => ({
            activeOrders: [
              {
                ...newOrder,
                localId: `ORDER-${Date.now()}`,
                placedAt: new Date().toISOString(),
              },
              ...state.activeOrders,
            ],
          }));
        };

        const handleOrderUpdated = (updatedOrder) => {
  console.log('🔄 Order updated - ID:', updatedOrder._id, 'Status:', updatedOrder.status);
  
  if (!updatedOrder?._id) return;

  const orderId = updatedOrder._id.toString();
  
  set((state) => {
    // Replace order in activeOrders OR completedOrders
    let newActiveOrders = state.activeOrders;
    let newCompletedOrders = state.completedOrders;
    let orderFound = false;

    // Check active first
    newActiveOrders = state.activeOrders.map((order) => {
      if (order._id?.toString() === orderId) {
        orderFound = true;
        return updatedOrder;
      }
      return order;
    });

    // If not in active, check completed
    if (!orderFound) {
      newCompletedOrders = state.completedOrders.map((order) => {
        if (order._id?.toString() === orderId) {
          orderFound = true;
          return updatedOrder;
        }
        return order;
      });
    }

    // If still not found, add to active
    if (!orderFound) {
      console.log('➕ Order not found, adding to active');
      newActiveOrders = [updatedOrder, ...state.activeOrders];
    }

    console.log('✅ Updated orders - Active:', newActiveOrders.length, 'Completed:', newCompletedOrders.length);
    return { 
      activeOrders: newActiveOrders, 
      completedOrders: newCompletedOrders 
    };
  });
};



        const handleTableUpdated = (updatedTable) => {
          console.log('🪑 Table updated:', updatedTable);
          // Table updates handled by separate table store or ignored
        };

        // Attach listeners (same events as dashboard)
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('order.created', handleOrderCreated);
        socket.on('order.updated', handleOrderUpdated);
        socket.on('table.updated', handleTableUpdated);

        // Store socket reference
        set({ socket });

        // Cleanup socket on disconnect
        socket.on('disconnect', () => {
          set({ socket: null });
        });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          console.log('🧹 Disconnecting socket');
          socket.off('connect');
          socket.off('disconnect');
          socket.off('order.created');
          socket.off('order.updated');
          socket.off('table.updated');
          socket.disconnect();
          set({ socket: null, connectionStatus: 'disconnected' });
        }
      },

      // Send message via socket (if needed)
      sendWsMessage: (data) => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.emit('message', data);
        }
      },

      // Check connection status
      isSocketConnected: () => {
        const state = get();
        return state.connectionStatus === 'connected';
      },
    }),
    {
      name: 'order-session-storage',
      partialize: (state) => {
        // Don't persist socket or connection state
        const {
          socket,
          connectionStatus,
          connectSocket,
          disconnectSocket,
          sendWsMessage,
          isSocketConnected,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);

export default useOrderStore;
