import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  profilePic: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  profilePic: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profilePic = action.payload.user.profilePic || null;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.profilePic = action.payload.profilePic || null;
    },
    updateProfilePic: (state, action: PayloadAction<string>) => {
      state.profilePic = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profilePic = null;
    },
  },
});

export const { loginSuccess, logout, setProfile, updateProfilePic } = authSlice.actions;
export default authSlice.reducer;
