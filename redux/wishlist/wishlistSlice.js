import { createSlice } from '@reduxjs/toolkit';

// Helper function to load wishlist from localStorage
const loadWishlistFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlistItems) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }
};

const initialState = {
  items: loadWishlistFromStorage(), 
  status: 'idle',
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // ---- Local Reducers ----
    toggleWishlistItem: (state, action) => {
      const productData = action.payload;

      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      // Check if item already exists in wishlist
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === productData._id
      );

      if (existingItemIndex >= 0) {
        // Remove item if it exists
        state.items.splice(existingItemIndex, 1);
      } else {
        // Add new item to wishlist
        state.items.push(productData);
      }

      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
    clearWishlistRequest: (state) => {
      // Optimistic locally
      state.items = [];
      saveWishlistToStorage(state.items);
      state.status = 'clearing';
    },
    clearWishlistSuccess: (state) => {
      state.status = 'succeeded';
    },
    clearWishlistFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    // Sync wishlist from localStorage (useful after page reload or cross-tab sync)
    syncWishlistFromStorage: (state) => {
      state.items = loadWishlistFromStorage();
    },

    // ---- Saga Actions ----
    fetchWishlistRequest: (state) => {
      state.status = 'loading';
    },
    fetchWishlistSuccess: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
    fetchWishlistFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    syncWishlistRequest: (state) => {
      state.status = 'syncing';
    },
    syncWishlistSuccess: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
    syncWishlistFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    toggleWishlistItemRequest: (state, action) => {
      // Optimistic update locally
      const productData = action.payload;
      if (!Array.isArray(state.items)) state.items = [];
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === productData._id
      );
      if (existingItemIndex >= 0) {
        state.items.splice(existingItemIndex, 1);
      } else {
        state.items.push(productData);
      }
      saveWishlistToStorage(state.items);
    },
    toggleWishlistItemSuccess: (state, action) => {
      // Re-sync with exact server response just in case
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
    toggleWishlistItemFailure: (state, action) => {
      // We could revert optimistic update here
      state.error = action.payload;
    },
  },
});

export const {
  toggleWishlistItem,
  clearWishlist,
  syncWishlistFromStorage,
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  syncWishlistRequest,
  syncWishlistSuccess,
  syncWishlistFailure,
  toggleWishlistItemRequest,
  toggleWishlistItemSuccess,
  toggleWishlistItemFailure,
  clearWishlistRequest,
  clearWishlistSuccess,
  clearWishlistFailure,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => {
  const items = state.wishlist?.items;
  return Array.isArray(items) ? items : [];
};

export const selectWishlistItemCount = (state) => {
  const items = state.wishlist?.items;
  if (!Array.isArray(items)) return 0;
  return items.length;
};

// Check if a specific product is in the wishlist
export const selectIsInWishlist = (state, productId) => {
  const items = state.wishlist?.items;
  if (!Array.isArray(items)) return false;
  return items.some((item) => item._id === productId);
};

export default wishlistSlice.reducer;
