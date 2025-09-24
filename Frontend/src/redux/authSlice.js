import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload; // user contient {id, name, email, role, ...}
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLoading, setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
