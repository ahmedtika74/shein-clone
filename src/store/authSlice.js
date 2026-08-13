import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getApiErrorMessage, toList } from "../services/apiClient";
import {
  toAddress,
  toAddressPayload,
  toProfile,
  toProfilePayload,
} from "../services/mappers";
import { loadJson } from "../utils/storage";

export const STORAGE_KEYS = {
  user: "currentUser",
  adminToken: "adminToken",
};

/**
 * The API may answer with the user, `{ user, token }`, or a bare token, so
 * flatten it into one object that always carries the bearer token.
 */
const normalizeSession = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") return { token: payload };

  const { user, token, ...rest } = payload;
  const account = user ?? rest;

  return {
    ...account,
    name: account.fullName ?? account.name ?? "",
    fullName: account.fullName ?? account.name ?? "",
    phoneNumber: account.phoneNumber ?? account.phone ?? "",
    token: token ?? account.token ?? null,
    addresses: Array.isArray(account.addresses)
      ? account.addresses.map(toAddress)
      : [],
  };
};

const asThunk = (name, work) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      return await work(arg);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  });

export const loginUserThunk = asThunk("auth/loginUser", ({ email, password }) =>
  apiClient.post("/auth/login", { email, password }, { authScope: "none" }),
);

export const registerUserThunk = asThunk(
  "auth/registerUser",
  ({ fullName, email, password }) =>
    apiClient.post(
      "/auth/register",
      { fullName, email, password },
      { authScope: "none" },
    ),
);

export const loginAdminThunk = asThunk(
  "auth/loginAdmin",
  ({ username, password }) =>
    apiClient.post(
      "/auth/admin-login",
      { username, password },
      { authScope: "none" },
    ),
);

export const fetchProfileThunk = asThunk("auth/fetchProfile", async () =>
  toProfile(await apiClient.get("/profile")),
);

export const updateProfileThunk = asThunk("auth/updateProfile", async (form) =>
  toProfile(await apiClient.put("/profile", toProfilePayload(form))),
);

export const changePasswordThunk = asThunk(
  "auth/changePassword",
  ({ currentPassword, newPassword }) =>
    apiClient.post("/auth/change-password", { currentPassword, newPassword }),
);

export const fetchAddressesThunk = asThunk("auth/fetchAddresses", async () =>
  toList(await apiClient.get("/addresses")).map(toAddress),
);

export const createAddressThunk = asThunk(
  "auth/createAddress",
  async (form) => {
    await apiClient.post("/addresses", toAddressPayload(form));
    return toList(await apiClient.get("/addresses")).map(toAddress);
  },
);

export const updateAddressThunk = asThunk(
  "auth/updateAddress",
  async ({ id, ...form }) => {
    await apiClient.put(`/addresses/${id}`, toAddressPayload(form));
    return toList(await apiClient.get("/addresses")).map(toAddress);
  },
);

export const deleteAddressThunk = asThunk("auth/deleteAddress", async (id) => {
  await apiClient.delete(`/addresses/${id}`);
  return toList(await apiClient.get("/addresses")).map(toAddress);
});

export const setDefaultAddressThunk = asThunk(
  "auth/setDefaultAddress",
  async (id) => {
    await apiClient.put(`/addresses/${id}/default`);
    return toList(await apiClient.get("/addresses")).map(toAddress);
  },
);

const initialState = {
  user: loadJson(STORAGE_KEYS.user, null),
  adminToken: localStorage.getItem(STORAGE_KEYS.adminToken),
  status: "idle",
  profileStatus: "idle",
  addressStatus: "idle",
  passwordStatus: "idle",
  error: null,
};

const mergeProfileIntoUser = (user, profile) => {
  if (!user) return user;
  return {
    ...user,
    name: profile.name ?? user.name,
    fullName: profile.fullName ?? profile.name ?? user.fullName,
    email: profile.email || user.email,
    phoneNumber: profile.phoneNumber ?? user.phoneNumber,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.error = null;
    },
    logoutAdmin(state) {
      state.adminToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const session = normalizeSession(action.payload);
        state.adminToken = session?.token ?? null;
      })
      .addCase(fetchProfileThunk.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.user = mergeProfileIntoUser(state.user, action.payload);
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.user = mergeProfileIntoUser(state.user, action.payload);
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      })
      .addCase(changePasswordThunk.pending, (state) => {
        state.passwordStatus = "loading";
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.passwordStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAddressesThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addCase(createAddressThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addCase(updateAddressThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addCase(deleteAddressThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addCase(setDefaultAddressThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addMatcher(
        (action) =>
          [
            fetchAddressesThunk.fulfilled.type,
            createAddressThunk.fulfilled.type,
            updateAddressThunk.fulfilled.type,
            deleteAddressThunk.fulfilled.type,
            setDefaultAddressThunk.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.addressStatus = "succeeded";
          if (state.user) state.user.addresses = action.payload;
        },
      )
      .addMatcher(
        (action) =>
          [
            fetchAddressesThunk.rejected.type,
            createAddressThunk.rejected.type,
            updateAddressThunk.rejected.type,
            deleteAddressThunk.rejected.type,
            setDefaultAddressThunk.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.addressStatus = "failed";
          state.error = action.payload;
        },
      )
      .addMatcher(
        (action) =>
          [
            loginUserThunk.fulfilled.type,
            registerUserThunk.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.status = "succeeded";
          state.user = normalizeSession(action.payload);
        },
      )
      .addMatcher(
        (action) =>
          [
            loginUserThunk.pending.type,
            registerUserThunk.pending.type,
            loginAdminThunk.pending.type,
          ].includes(action.type),
        (state) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action) =>
          [
            loginUserThunk.rejected.type,
            registerUserThunk.rejected.type,
            loginAdminThunk.rejected.type,
          ].includes(action.type),
        (state) => {
          state.status = "failed";
        },
      );
  },
});

export const { logoutUser, logoutAdmin } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => Boolean(state.auth.user);
export const selectIsAdminLoggedIn = (state) => Boolean(state.auth.adminToken);
export const selectAuthStatus = (state) => state.auth.status;
export const selectProfileStatus = (state) => state.auth.profileStatus;
export const selectAddressStatus = (state) => state.auth.addressStatus;
export const selectPasswordStatus = (state) => state.auth.passwordStatus;
export const selectAuthError = (state) => state.auth.error;

export const authReducer = authSlice.reducer;
