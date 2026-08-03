import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../services/apiClient";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// --- THUNKS ---

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      return response; // { user, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response; // { user, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/admin-login", {
        username,
        password,
      });
      return response; // { token, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  registeredUser: loadFromStorage("user", null),
  user: loadFromStorage("currentUser", null),
  isLoggedIn: localStorage.getItem("loggedIn") === "true",
  isAdminLoggedIn: localStorage.getItem("adminLoggedIn") === "true",
  _lastResult: null,
  status: "idle", // idle | loading | succeeded | failed
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    logoutAdmin(state) {
      state.isAdminLoggedIn = false;
    },
    clearAuthResult(state) {
      state._lastResult = null;
      state.status = "idle";
    },
    updateProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (state.registeredUser) {
          state.registeredUser = { ...state.registeredUser, ...action.payload };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUserThunk.pending, (state) => {
        state.status = "loading";
        state._lastResult = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state._lastResult = { success: true, message: action.payload.message };
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state._lastResult = { success: false, message: action.payload };
      })

      // registerUser
      .addCase(registerUserThunk.pending, (state) => {
        state.status = "loading";
        state._lastResult = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.registeredUser = action.payload.user;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state._lastResult = { success: true, message: action.payload.message };
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state._lastResult = { success: false, message: action.payload };
      })

      // loginAdmin
      .addCase(loginAdminThunk.pending, (state) => {
        state.status = "loading";
        state._lastResult = null;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAdminLoggedIn = true;
        state._lastResult = { success: true, message: action.payload.message };
      })
      .addCase(loginAdminThunk.rejected, (state, action) => {
        state.status = "failed";
        state._lastResult = { success: false, message: action.payload };
      });
  },
});

export const { logoutUser, logoutAdmin, clearAuthResult, updateProfile } =
  authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsAdminLoggedIn = (state) => state.auth.isAdminLoggedIn;
export const selectAuthResult = (state) => state.auth._lastResult;
export const selectAuthStatus = (state) => state.auth.status;

export const authReducer = authSlice.reducer;
