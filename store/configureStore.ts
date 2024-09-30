import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
  },
});


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']