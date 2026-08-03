import { cn } from "../../../utils/cn";
import { Input, Button } from "../../../components/ui";

export const ForgotPasswordForm = ({
  handleForgetSubmit,
  forgetEmail,
  setForgetEmail,
  resetMethod,
  setResetMethod,
  setMode,
  forgetMsg,
}) => {
  return (
    <form onSubmit={handleForgetSubmit}>
      <h2 className={cn("text-center text-2xl font-bold mb-4 text-gray-900")}>
        Reset Password
      </h2>
      <p className={cn("text-xs text-gray-500 text-center mb-6")}>
        Enter your email address and we&apos;ll send you reset instructions.
      </p>
      <div className={cn("relative mb-4")}>
        <i
          className={cn(
            "fa-regular fa-envelope text-gray-500 absolute left-4 top-[14px] z-10",
          )}
        ></i>
        <Input
          type="email"
          placeholder="Email Address"
          value={forgetEmail}
          onChange={(e) => setForgetEmail(e.target.value)}
          className={cn("pl-11 h-12")}
        />
      </div>
      <div className={cn("mb-6")}>
        <label className={cn("block text-xs font-semibold text-gray-700 mb-2")}>
          Reset Method
        </label>
        <select
          value={resetMethod}
          onChange={(e) => setResetMethod(e.target.value)}
          className={cn(
            "w-full h-11 border border-gray-300 rounded-md px-3 text-sm outline-none bg-white",
          )}
        >
          <option value="email">Send via Email</option>
          <option value="phone">Send via SMS Code</option>
        </select>
      </div>
      <Button type="submit" className={cn("w-full h-12")}>
        Send Instructions
      </Button>
      {forgetMsg.text && (
        <p
          className={cn(
            `msg mt-3 text-xs text-center font-bold ${forgetMsg.isError ? "text-red-600" : "text-green-600"}`,
          )}
        >
          {forgetMsg.text}
        </p>
      )}
      <div className={cn("register text-center mt-6 text-sm text-gray-600")}>
        Back to{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn("font-bold text-black hover:underline cursor-pointer")}
        >
          Login
        </button>
      </div>
    </form>
  );
};
