import { configureStore } from '@reduxjs/toolkit';
import navReducer from './slices/navSlice';
import spotReducer from './slices/spotSlice';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
  reducer: {
    nav: navReducer,
    spot: spotReducer,
    vendor: vendorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

