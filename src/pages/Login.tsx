import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { students } from "@/data/students";
import { Eye, EyeOff, GraduationCap, Lock, User, AlertCircle, LogIn, Phone, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

type ForgotStep = "idle" | "enterPhone" | "enterOtp" | "newPassword" | "success";

const Login: React.FC = () => {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, changePassword } = useAuth();
  const navigate = useNavigate();

  // Forgot password states
  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [foundRegNo, setFoundRegNo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = login(regNo, password);
    setIsLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleForgotPhone = async () => {
  setForgotError("");

  const student = students.find(s => s.phone === forgotPhone);
  if (!student) {
    setForgotError("Student with this mobile number not found");
    return;
  }

  setFoundRegNo(student.regNo);

  try {
    await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: forgotPhone }),
    });

    setForgotStep("enterOtp");
  } catch (err) {
    setForgotError("Failed to send OTP");
  }
};


  const handleVerifyOtp = async () => {
  try {
    const res = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: forgotPhone, otp: enteredOtp }),
    });

    const data = await res.json();

    if (!data.success) {
      setForgotError("Invalid OTP. Please try again.");
      return;
    }

    setForgotError("");
    setForgotStep("newPassword");
  } catch (err) {
    setForgotError("Verification failed");
  }
};

  const handleResetPassword = () => {
    if (newPass.length < 6) { setForgotError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setForgotError("Passwords do not match."); return; }
    changePassword(foundRegNo, newPass);
    setForgotStep("success");
    setForgotError("");
  };

  const resetForgotFlow = () => {
    setForgotStep("idle");
    setForgotPhone("");
    setForgotError("");
    setGeneratedOtp("");
    setEnteredOtp("");
    setNewPass("");
    setConfirmPass("");
    setFoundRegNo("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden dark">
      <div className="fixed inset-0 bg-[hsl(200,50%,6%)]" />
      <div className="fixed inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(174,72%,46%,0.08)] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(192,85%,38%,0.06)] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4" style={{ animation: "scaleIn 0.6s ease-out" }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[hsl(200,45%,12%)] border border-[hsl(174,72%,46%,0.3)] mb-4 pulse-glow">
            <GraduationCap className="w-8 h-8 text-[hsl(174,72%,50%)]" />
          </div>
          <h1 className="text-3xl font-display font-bold italic text-[hsl(174,72%,50%)]">Student Life</h1>
          <p className="text-[hsl(200,15%,55%)] mt-1 text-sm">Management System</p>
        </div>

        <div className="bg-[hsl(200,45%,10%,0.8)] backdrop-blur-xl rounded-2xl p-8 border border-[hsl(174,72%,46%,0.15)] shadow-[0_16px_48px_hsl(174,72%,46%,0.1)]">
          {forgotStep === "idle" ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[hsl(174,72%,50%)] mb-2">Registration Number</label>
                  <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="e.g. 24121632"
                    className="w-full px-4 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none transition-all text-[hsl(180,20%,90%)] placeholder:text-[hsl(200,15%,40%)]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(174,72%,50%)] mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                      className="w-full px-4 pr-12 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none transition-all text-[hsl(180,20%,90%)] placeholder:text-[hsl(200,15%,40%)]" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(200,15%,45%)] hover:text-[hsl(174,72%,50%)] transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[hsl(0,84%,60%,0.1)] border border-[hsl(0,84%,60%,0.2)] text-[hsl(0,84%,60%)] text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}
                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[hsl(174,72%,46%)] to-[hsl(187,80%,42%)] text-[hsl(200,50%,6%)] font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[hsl(200,50%,6%,0.3)] border-t-[hsl(200,50%,6%)] rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (<><LogIn className="w-4 h-4" /> Sign In</>)}
                </button>
              </form>
              <button onClick={() => setForgotStep("enterPhone")}
                className="w-full mt-4 text-center text-sm text-[hsl(174,72%,50%)] hover:text-[hsl(174,72%,60%)] transition-colors flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Forgot Password?
              </button>
              <p className="text-center text-xs text-[hsl(200,15%,45%)] mt-4">
                Demo: <span className="font-mono text-[hsl(180,20%,70%)]">24121632</span> / <span className="font-mono text-[hsl(180,20%,70%)]">@Powerstar45</span>
              </p>
            </>
          ) : forgotStep === "enterPhone" ? (
            <div className="space-y-5">
              <button onClick={resetForgotFlow} className="flex items-center gap-2 text-sm text-[hsl(200,15%,55%)] hover:text-[hsl(174,72%,50%)] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
              <div className="text-center">
                <Phone className="w-10 h-10 text-[hsl(174,72%,50%)] mx-auto mb-2" />
                <h3 className="text-lg font-display font-bold text-[hsl(180,20%,90%)]">Forgot Password</h3>
                <p className="text-sm text-[hsl(200,15%,55%)] mt-1">Enter your registered mobile number</p>
              </div>
              <input type="tel" value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 7981799840" maxLength={10}
                className="w-full px-4 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none text-[hsl(180,20%,90%)] placeholder:text-[hsl(200,15%,40%)] text-center text-lg tracking-wider" />
              {forgotError && <p className="text-sm text-[hsl(0,84%,60%)] text-center">{forgotError}</p>}
              <button onClick={handleForgotPhone} disabled={forgotPhone.length < 10}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(174,72%,46%)] to-[hsl(187,80%,42%)] text-[hsl(200,50%,6%)] font-bold text-sm disabled:opacity-50">
                Send OTP
              </button>
            </div>
          ) : forgotStep === "enterOtp" ? (
            <div className="space-y-5">
              <button onClick={() => setForgotStep("enterPhone")} className="flex items-center gap-2 text-sm text-[hsl(200,15%,55%)] hover:text-[hsl(174,72%,50%)] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-center">
                <h3 className="text-lg font-display font-bold text-[hsl(180,20%,90%)]">Verify OTP</h3>
                <p className="text-sm text-[hsl(200,15%,55%)] mt-1">OTP sent to {forgotPhone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2")}</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(142,71%,45%,0.1)] border border-[hsl(142,71%,45%,0.2)] text-center">
                <span className="text-xs text-[hsl(142,71%,45%)]">Simulated OTP: </span>
                <span className="font-mono font-bold text-[hsl(142,71%,45%)] text-lg tracking-widest">{generatedOtp}</span>
              </div>
              <input type="text" maxLength={6} value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none text-[hsl(180,20%,90%)] text-center text-2xl tracking-[0.5em] font-mono placeholder:text-sm placeholder:tracking-normal" />
              {forgotError && <p className="text-sm text-[hsl(0,84%,60%)] text-center">{forgotError}</p>}
              <button onClick={handleVerifyOtp} disabled={enteredOtp.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(174,72%,46%)] to-[hsl(187,80%,42%)] text-[hsl(200,50%,6%)] font-bold text-sm disabled:opacity-50">
                Verify OTP
              </button>
            </div>
          ) : forgotStep === "newPassword" ? (
            <div className="space-y-5">
              <div className="text-center">
                <Lock className="w-10 h-10 text-[hsl(174,72%,50%)] mx-auto mb-2" />
                <h3 className="text-lg font-display font-bold text-[hsl(180,20%,90%)]">Set New Password</h3>
                <p className="text-sm text-[hsl(200,15%,55%)] mt-1">Account: {foundRegNo}</p>
              </div>
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password (min 6 chars)"
                className="w-full px-4 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none text-[hsl(180,20%,90%)] placeholder:text-[hsl(200,15%,40%)]" />
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl bg-[hsl(200,40%,14%)] border border-[hsl(200,40%,20%)] focus:border-[hsl(174,72%,46%)] focus:ring-2 focus:ring-[hsl(174,72%,46%,0.2)] outline-none text-[hsl(180,20%,90%)] placeholder:text-[hsl(200,15%,40%)]" />
              {forgotError && <p className="text-sm text-[hsl(0,84%,60%)] text-center">{forgotError}</p>}
              <button onClick={handleResetPassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(174,72%,46%)] to-[hsl(187,80%,42%)] text-[hsl(200,50%,6%)] font-bold text-sm">
                Update Password
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[hsl(142,71%,45%)] mx-auto" />
              <h3 className="text-lg font-display font-bold text-[hsl(180,20%,90%)]">Password Changed!</h3>
              <p className="text-sm text-[hsl(200,15%,55%)]">Your password has been updated. You can now sign in with your new password.</p>
              <button onClick={resetForgotFlow}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(174,72%,46%)] to-[hsl(187,80%,42%)] text-[hsl(200,50%,6%)] font-bold text-sm">
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
