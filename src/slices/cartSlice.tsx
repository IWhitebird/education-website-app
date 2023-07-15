import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

interface CartState {
  totalItems: number;
}

const initialState: CartState = {
  totalItems: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")!) : '0',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    setTotalItems(state: CartState, action: PayloadAction<number>) {
      state.totalItems = action.payload;
    },
  },
});

export const { setTotalItems } = cartSlice.actions;

export default cartSlice.reducer;
