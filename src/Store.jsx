import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlices";

export const store = configureStore({
  reducer: {
    userData: userSlice,
  },
});
