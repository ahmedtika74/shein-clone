import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  loginUserThunk,
  registerUserThunk,
  fetchAddressesThunk,
  fetchProfileThunk,
  selectAuthStatus,
} from "../../../store/authSlice";
import { fetchWishlistThunk } from "../../../store/wishlistSlice";
import { features } from "../../../config/features";

const emptyMessage = { text: "", isError: false };

export const useAuthForms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("storefront");
  const isLoading = useSelector(selectAuthStatus) === "loading";
  const redirectTo = location.state?.from || "/";

  const [mode, setMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState(emptyMessage);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMsg, setRegMsg] = useState(emptyMessage);

  const syncAccountData = () => {
    dispatch(fetchWishlistThunk());
    if (features.savedAddresses) dispatch(fetchAddressesThunk());
    if (features.profileEdit) dispatch(fetchProfileThunk());
  };

  const submit = async (thunkArgs, thunk, setMessage) => {
    setMessage(emptyMessage);
    try {
      await dispatch(thunk(thunkArgs)).unwrap();
      syncAccountData();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage({ text: error || t("authFailed"), isError: true });
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginMsg({ text: t("enterEmailAndPassword"), isError: true });
      return;
    }
    submit(
      { email: loginEmail, password: loginPassword },
      loginUserThunk,
      setLoginMsg,
    );
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setRegMsg({ text: t("fillAllFields"), isError: true });
      return;
    }
    submit(
      { fullName: regName, email: regEmail, password: regPassword },
      registerUserThunk,
      setRegMsg,
    );
  };

  return {
    mode,
    setMode,
    isLoading,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginMsg,
    handleLoginSubmit,
    regName,
    setRegName,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regMsg,
    handleRegisterSubmit,
  };
};
