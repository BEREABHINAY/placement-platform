import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,       // { id, name, email, role, ... }
  status: "idle",    // idle | loading | authenticated | unauthenticated
  pendingEmail: null, // email currently mid-OTP-flow
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state) {
      state.status = "loading";
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    setAuthenticated(state, action) {
      state.user = action.payload;
      state.status = "authenticated";
      state.pendingEmail = null;
    },
    setUnauthenticated(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setLoading, setPendingEmail, setAuthenticated, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
