import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
  },
});

export const { setOrigin, setApi } = navSlice.actions;

// Selectors
export const selectOrigin = (state) => state.nav.origin;

export default navSlice.reducer;
