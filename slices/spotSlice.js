import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spot: null,
};

export const spotSlice = createSlice({
  name: "spot",
  initialState,
  reducers: {
    setSpot: (state, action) => {
      state.spot = action.payload;
    },
  },
});

export const { setSpot } = spotSlice.actions;

// Selectors
export const selectSpot = (state) => state.nav.spot;

export default spotSlice.reducer;
