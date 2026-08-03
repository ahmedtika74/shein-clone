import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUserThunk,
  registerUserThunk,
  selectAuthResult,
  clearAuthResult,
  selectAuthStatus,
} from "../../../store/authSlice";

export const useAuthForms = () => {
  const [mode, setMode] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(selectAuthStatus);
  const isLoading = authStatus === "loading";

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", isError: false });

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMsg, setRegMsg] = useState({ text: "", isError: false });

  // Forget
  const [forgetEmail, setForgetEmail] = useState("");
  const [resetMethod, setResetMethod] = useState("email");
  const [forgetMsg, setForgetMsg] = useState({ text: "", isError: false });

  const authResult = useSelector(selectAuthResult);

  useEffect(() => {
    if (authResult) {
      if (mode === "login") {
        setLoginMsg({ text: authResult.message, isError: !authResult.success });
        if (authResult.success) {
          setTimeout(() => navigate("/"), 1000);
        }
      } else if (mode === "register") {
        setRegMsg({ text: authResult.message, isError: !authResult.success });
        if (authResult.success) {
          setTimeout(() => {
            setLoginEmail(regEmail);
            setMode("login");
            setRegMsg({ text: "", isError: false });
          }, 1000);
        }
      }
      dispatch(clearAuthResult());
    }
  }, [authResult, mode, navigate, dispatch, regEmail]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginMsg({ text: "Please enter your email", isError: true });
      return;
    }
    if (!loginPassword) {
      setLoginMsg({ text: "Please enter email and password.", isError: true });
      return;
    }
    dispatch(loginUserThunk({ email: loginEmail, password: loginPassword }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setRegMsg({ text: "Please fill all fields correctly.", isError: true });
      return;
    }

    dispatch(
      registerUserThunk({
        name: regName,
        email: regEmail,
        password: regPassword,
      }),
    );
  };

  const handleForgetSubmit = (e) => {
    e.preventDefault();
    if (!forgetEmail) {
      setForgetMsg({ text: "Please enter email", isError: true });
      return;
    }
    setForgetMsg({
      text:
        resetMethod === "email"
          ? "Reset link sent to your Email 📧"
          : "Code sent to your Phone 📱",
      isError: false,
    });
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
    forgetEmail,
    setForgetEmail,
    resetMethod,
    setResetMethod,
    forgetMsg,
    handleForgetSubmit,
  };
};
