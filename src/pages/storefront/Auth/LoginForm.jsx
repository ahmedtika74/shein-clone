import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";

export const LoginForm = ({
  handleLoginSubmit,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  setMode,
  isLoading,
  loginMsg,
}) => {
  return (
    <form onSubmit={handleLoginSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-6 text-gray-900")}>
        Login
      </h2>
      <div className={cn("relative mb-4")}>
        <i
          className={cn(
            "fa-regular fa-envelope text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="email"
          placeholder="Email Address"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <div className={cn("relative mb-2")}>
        <i
          className={cn(
            "fa-solid fa-lock text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <div className={cn("forget text-right mb-5")}>
        <button
          type="button"
          onClick={() => setMode("forget")}
          className={cn(
            "text-xs text-gray-600 hover:text-black font-semibold cursor-pointer",
          )}
        >
          Forgot Password?
        </button>
      </div>
      <Button type="submit" disabled={isLoading} className={cn("w-full h-12")}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
      {loginMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${loginMsg.isError ? "text-red-600" : "text-green-600"}`,
          )}
        >
          {loginMsg.text}
        </p>
      )}
      <div
        className={cn(
          "or text-center my-5 text-xs text-gray-400 font-semibold tracking-wider uppercase",
        )}
      >
        OR
      </div>
      <Button
        type="button"
        variant="secondary"
        className={cn("w-full h-12 flex items-center justify-center gap-2")}
      >
        <i className={cn("fa-brands fa-google text-red-500 text-base")}></i>{" "}
        Continue with Google
      </Button>
      <div className={cn("register text-center mt-6 text-sm text-gray-600")}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("register")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          Register
        </button>
      </div>
    </form>
  );
};
