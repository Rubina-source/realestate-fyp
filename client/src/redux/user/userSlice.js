import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // This will store { username, email, role, etc. }
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // This is where the 'role' is saved!
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { 
  signInStart, 
  signInSuccess, 
  signInFailure, 
  signOutUserSuccess 
} = userSlice.actions;

export default userSlice.reducer;