import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendor: null,
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
    },
  },
});

export const { setVendor } = vendorSlice.actions;

// Selectors
export const selectVendor = (state) => state.vendor.vendor;

export default vendorSlice.reducer;
