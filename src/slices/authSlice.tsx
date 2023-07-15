import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  signupData: any;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")!) : null,
  loading: false,
  signupData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setToken(state: AuthState, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    setLoading(state: AuthState, action: PayloadAction<boolean>) { 
      state.loading = action.payload;
    },
    setSignupData(state: AuthState, action: PayloadAction<any>) {
        state.signupData = action.payload;
    }
  },
});

export const { setToken , setLoading , setSignupData } = authSlice.actions;

export default authSlice.reducer;
