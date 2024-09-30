import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
  },
});

export const { setProducts, addProduct } = productSlice.actions;

export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data: Product[] = await response.json();
    await AsyncStorage.setItem("products", JSON.stringify(data));
    dispatch(setProducts(data));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export default productSlice.reducer;
