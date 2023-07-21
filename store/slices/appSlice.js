import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  username: "",
  qrData: "",
  imageLink: ""
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setQRData: (state, action) => {
      state.qrData = action.payload;
    },
    setImageLink: (state, action) => {
      console.log('stateImage',action.payload)
      state.imageLink = action.payload;
    }
  },
});

export const { setUsername, setQRData, setImageLink } = appSlice.actions;

export default appSlice.reducer;