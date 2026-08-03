import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";

export const RegisterForm = ({
  handleRegisterSubmit,
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  setMode,
  isLoading,
  regMsg,
}) => {
  return (
    <form onSubmit={handleRegisterSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-6 text-gray-900")}>
        Create Account
      </h2>
      <div className={cn("relative mb-4")}>
        <i
          className={cn(
            "fa-regular fa-user text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="text"
          placeholder="Full Name"
          value={regName}
          onChange={(e) => setRegName(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <div className={cn("relative mb-4")}>
        <i
          className={cn(
            "fa-regular fa-envelope text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="email"
          placeholder="Email Address"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <div className={cn("relative mb-6")}>
        <i
          className={cn(
            "fa-solid fa-lock text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="password"
          placeholder="Password"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <Button type="submit" disabled={isLoading} className={cn("w-full h-12")}>
        {isLoading ? "Registering..." : "Register Now"}
      </Button>
      {regMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${regMsg.isError ? "text-red-600" : "text-green-600"}`,
          )}
        >
          {regMsg.text}
        </p>
      )}
      <div className={cn("register text-center mt-6 text-sm text-gray-600")}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
