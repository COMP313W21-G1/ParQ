import { configureStore } from '@reduxjs/toolkit';
import navReducer from './slices/navSlice';
import spotReducer from './slices/spotSlice';

export const store = configureStore({
  reducer: {
    nav: navReducer,
    spot: spotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

