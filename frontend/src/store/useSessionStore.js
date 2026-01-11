import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSessionStore = create(
  persist(
    (set, get) => ({
      hotelId: null,
      tableId: null,
      userId: null,
      hotelName: null, // Added hotel name field
      
      // Enhanced setSession with validation
      setSession: (patch) => {
        // Validate that patch is a proper object
        if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
          console.error('setSession expects an object patch, received:', typeof patch, patch);
          throw new Error(`setSession only accepts objects. Use { userId: "${patch}" } instead of "${patch}"`);
        }
        
        // Updated allowed keys to include hotelName
        const allowedKeys = ['hotelId', 'tableId', 'userId', 'hotelName'];
        const invalidKeys = Object.keys(patch).filter(key => !allowedKeys.includes(key));
        
        if (invalidKeys.length > 0) {
          console.warn('Invalid session keys ignored:', invalidKeys);
        }
        
        // Filter to only allowed keys
        const validPatch = {};
        Object.keys(patch).forEach(key => {
          if (allowedKeys.includes(key)) {
            validPatch[key] = patch[key];
          }
        });
        
        set((state) => ({ ...state, ...validPatch }));
      },
      
      clearSession: () => set({ 
        hotelId: null, 
        tableId: null, 
        userId: null, 
        hotelName: null 
      }),
      
      // Helper to check session completeness
      isSessionComplete: () => {
        const state = get();
        return !!(state.hotelId && state.tableId && state.userId);
      }
    }),
    {
      name: "hotelman-session",
      getStorage: () => ({
        getItem: (name) => {
          try {
            const item = localStorage.getItem(name);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            const state = parsed.state;
            
            // Check for corruption (numeric keys from string spreading)
            const hasNumericKeys = Object.keys(state).some(key => !isNaN(key));
            if (hasNumericKeys) {
              console.warn('🔧 Corrupted session detected and cleared');
              localStorage.removeItem(name);
              return null;
            }
            
            return item;
          } catch (error) {
            console.error('Session storage error:', error);
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name)
      })
    }
  )
);
