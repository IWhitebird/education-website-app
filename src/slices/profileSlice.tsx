import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  user: any;
  loading: boolean;
}

const initialState: ProfileState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    setUser(state: ProfileState, action: PayloadAction<string | null>) {
      state.user = action.payload;
    },
    setLoading(state: ProfileState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;

export default profileSlice.reducer;
