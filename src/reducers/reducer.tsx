import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import cartReducer from '../slices/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
