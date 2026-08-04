import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../services/apiClient";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        if (parsed.address && !parsed.addresses) {
          parsed.addresses = [
            {
              id: Date.now().toString(),
              label: "Home",
              isDefault: true,
              ...parsed.address,
            },
          ];
        } else if (!parsed.addresses) {
          parsed.addresses = [];
        }
      }
      return parsed;
    }
    return fallback;
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
        localStorage.setItem("currentUser", JSON.stringify(state.user));
        if (state.registeredUser)
          localStorage.setItem("user", JSON.stringify(state.registeredUser));
      }
    },
    addAddress(state, action) {
      if (state.user) {
        if (!state.user.addresses) state.user.addresses = [];
        if (state.user.addresses.length >= 3) return; // Max 3 addresses

        const newAddress = {
          id: Date.now().toString(),
          isDefault: state.user.addresses.length === 0,
          ...action.payload,
        };
        state.user.addresses.push(newAddress);

        if (state.registeredUser) {
          state.registeredUser.addresses = state.user.addresses;
        }
        localStorage.setItem("currentUser", JSON.stringify(state.user));
        if (state.registeredUser)
          localStorage.setItem("user", JSON.stringify(state.registeredUser));
      }
    },
    editAddress(state, action) {
      if (state.user && state.user.addresses) {
        const { id, ...updates } = action.payload;
        const index = state.user.addresses.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.user.addresses[index] = {
            ...state.user.addresses[index],
            ...updates,
          };
          if (state.registeredUser) {
            state.registeredUser.addresses = state.user.addresses;
          }
          localStorage.setItem("currentUser", JSON.stringify(state.user));
          if (state.registeredUser)
            localStorage.setItem("user", JSON.stringify(state.registeredUser));
        }
      }
    },
    deleteAddress(state, action) {
      if (state.user && state.user.addresses) {
        const id = action.payload;
        const index = state.user.addresses.findIndex((a) => a.id === id);
        if (index !== -1) {
          const wasDefault = state.user.addresses[index].isDefault;
          state.user.addresses.splice(index, 1);

          if (wasDefault && state.user.addresses.length > 0) {
            state.user.addresses[0].isDefault = true;
          }

          if (state.registeredUser) {
            state.registeredUser.addresses = state.user.addresses;
          }
          localStorage.setItem("currentUser", JSON.stringify(state.user));
          if (state.registeredUser)
            localStorage.setItem("user", JSON.stringify(state.registeredUser));
        }
      }
    },
    setDefaultAddress(state, action) {
      if (state.user && state.user.addresses) {
        const id = action.payload;
        state.user.addresses.forEach((a) => {
          a.isDefault = a.id === id;
        });
        if (state.registeredUser) {
          state.registeredUser.addresses = state.user.addresses;
        }
        localStorage.setItem("currentUser", JSON.stringify(state.user));
        if (state.registeredUser)
          localStorage.setItem("user", JSON.stringify(state.registeredUser));
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
        const user = action.payload.user;
        if (user && user.address && !user.addresses) {
          user.addresses = [
            {
              id: Date.now().toString(),
              label: "Home",
              isDefault: true,
              ...user.address,
            },
          ];
        } else if (user && !user.addresses) {
          user.addresses = [];
        }
        state.user = user;
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
        const user = action.payload.user;
        if (user && user.address && !user.addresses) {
          user.addresses = [
            {
              id: Date.now().toString(),
              label: "Home",
              isDefault: true,
              ...user.address,
            },
          ];
        } else if (user && !user.addresses) {
          user.addresses = [];
        }
        state.registeredUser = user;
        state.user = user;
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

export const {
  logoutUser,
  logoutAdmin,
  clearAuthResult,
  updateProfile,
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsAdminLoggedIn = (state) => state.auth.isAdminLoggedIn;
export const selectAuthResult = (state) => state.auth._lastResult;
export const selectAuthStatus = (state) => state.auth.status;

export const authReducer = authSlice.reducer;
