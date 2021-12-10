import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  api: null,
  favorite: null,
  //destination: null,
  //travelTimeInformation: null
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      //console.log(action);
      state.origin = action.payload;
    },
    setApi: (state, action) => {
      state.api = action.payload;
    },
    setFavorite: (state, action) => {
      state.favorite = action.payload;
    },
    // setDestination: (state, action) => {
    //   state.destination = action.payload;
    // },
    // setTravelTimeInformation: (state, action) => {
    //   state.travelTimeInformation = action.payload;
    // },
  },
});

export const { setOrigin, setApi, setFavorite } = navSlice.actions;

// export const { setOrigin, setDestination, setTravelTimeInformation } =
//   navSlice.actions;

// Selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectApi = (state) => state.nav.api;
export const selectFavorite = (state) => state.nav.favorite;
//export const selectDestination = (state) => state.nav.destination;
//export const selectTravelTimeInformation = (state) =>
//state.nav.travelTimeInformation;

export default navSlice.reducer;
