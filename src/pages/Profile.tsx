import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft, User, Phone, Mail, BookOpen, Building2, Hash,
  Palette, Type, Sun, Moon, Monitor, ChevronRight, Camera,
  Shield, Bell, Globe, Eye, Lock, KeyRound, CheckCircle2,
  EyeOff, Users, MapPin,
} from "lucide-react";

type OtpStep = "idle" | "chooseMethod" | "enterOtp" | "newPassword" | "success";
type SettingsSection = "main" | "privacy";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();
  const { theme, font, fontSize, compactMode, notifications, setTheme, setFont, setFontSize, setCompactMode, setNotifications } = useTheme();
  const [activeSection, setActiveSection] = useState<"profile" | "settings">("profile");
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("main");

  // Privacy settings
  const [showPhone, setShowPhone] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showRoom, setShowRoom] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<"public" | "friends" | "private">("public");

  // OTP Password Change
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [otpMethod, setOtpMethod] = useState<"phone" | "email">("phone");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otpError, setOtpError] = useState("");

  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  const maskedPhone = user.phone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2");
  const maskedEmail = user.email
    ? user.email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : null;

  const startPasswordChange = () => { setOtpStep("chooseMethod"); setOtpError(""); };
  const sendOtp = () => {
    if (otpMethod === "email" && !user.email) { setOtpError("No email registered. Please use phone."); return; }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setOtpStep("enterOtp");
    setOtpError("");
    console.log(`[SIMULATED OTP] Sent to ${otpMethod}: ${otp}`);
  };
  const verifyOtp = () => { if (enteredOtp === generatedOtp) { setOtpStep("newPassword"); setOtpError(""); } else { setOtpError("Invalid OTP. Please try again."); } };
  const submitNewPassword = () => {
    if (newPass.length < 6) { setOtpError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setOtpError("Passwords do not match."); return; }
    changePassword(user.regNo, newPass);
    setOtpStep("success");
    setOtpError("");
    setEnteredOtp(""); setNewPass(""); setConfirmPass("");
  };
  const resetOtpFlow = () => { setOtpStep("idle"); setOtpError(""); setEnteredOtp(""); setNewPass(""); setConfirmPass(""); };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-7 rounded-full transition-all relative ${value ? "bg-primary" : "bg-secondary"}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${value ? "left-6" : "left-1"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">My Profile</h1>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: "profile" as const, label: "Student Profile", icon: <User className="w-4 h-4" /> },
            { id: "settings" as const, label: "Settings", icon: <Palette className="w-4 h-4" /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveSection(tab.id); setSettingsSection("main"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === tab.id ? "gradient-bg text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeSection === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center text-4xl font-display font-bold text-primary-foreground shadow-lg ring-4 ring-primary/20">{initials}</div>
                <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-secondary border-2 border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <h2 className="mt-5 text-2xl font-display font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{user.department} • Year {user.year}</p>
              <span className="mt-3 px-4 py-1 rounded-full text-xs font-semibold gradient-bg text-primary-foreground">{user.role}</span>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-5 text-lg">Personal Details</h3>
              <div className="space-y-4">
                {[
                  { icon: <Hash className="w-5 h-5 text-primary" />, label: "Registration No", value: user.regNo },
                  { icon: <User className="w-5 h-5 text-primary" />, label: "Full Name", value: user.name },
                  { icon: <Phone className="w-5 h-5 text-primary" />, label: "Phone", value: user.phone },
                  { icon: <Mail className="w-5 h-5 text-primary" />, label: "Email", value: user.email || "Not provided" },
                  { icon: <BookOpen className="w-5 h-5 text-primary" />, label: "Department", value: user.department },
                  { icon: <Building2 className="w-5 h-5 text-primary" />, label: "Year", value: `Year ${user.year}` },
                  ...(user.role === "Hosteller" ? [
                    { icon: <Building2 className="w-5 h-5 text-primary" />, label: "Block", value: user.block || "N/A" },
                    { icon: <Building2 className="w-5 h-5 text-primary" />, label: "Room No", value: user.roomNo || "N/A" },
                  ] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-medium text-foreground truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "settings" && settingsSection === "main" && (
          <div className="space-y-6 animate-fade-in">
            {/* Appearance */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Appearance
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "light" as const, label: "Light", icon: <Sun className="w-5 h-5" /> },
                      { id: "dark" as const, label: "Dark", icon: <Moon className="w-5 h-5" /> },
                      { id: "system" as const, label: "System", icon: <Monitor className="w-5 h-5" /> },
                    ]).map((t) => (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          theme === t.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                        }`}>
                        {t.icon}<span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Font Family</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "inter" as const, label: "Inter", cls: "font-sans" },
                      { id: "grotesk" as const, label: "Grotesk", cls: "font-display" },
                      { id: "mono" as const, label: "Mono", cls: "font-mono" },
                    ]).map((f) => (
                      <button key={f.id} onClick={() => setFont(f.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          font === f.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                        }`}>
                        <span className={`text-2xl font-bold ${f.cls}`}>Aa</span>
                        <span className="text-sm font-medium">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Font Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "small" as const, label: "Small", size: "text-xs" },
                      { id: "medium" as const, label: "Medium", size: "text-base" },
                      { id: "large" as const, label: "Large", size: "text-lg" },
                    ]).map((s) => (
                      <button key={s.id} onClick={() => setFontSize(s.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          fontSize === s.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                        }`}>
                        <span className={`font-bold ${s.size}`}>Aa</span>
                        <span className="text-sm font-medium">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Bell className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Push Notifications</div>
                      <div className="text-xs text-muted-foreground">Receive alerts for assignments & events</div>
                    </div>
                  </div>
                  <ToggleSwitch value={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Eye className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Compact Mode</div>
                      <div className="text-xs text-muted-foreground">Reduce spacing for more content</div>
                    </div>
                  </div>
                  <ToggleSwitch value={compactMode} onChange={() => setCompactMode(!compactMode)} />
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Account
              </h3>

              {otpStep === "idle" && (
                <div className="space-y-2">
                  <button onClick={startPasswordChange}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <KeyRound className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Change Password</div>
                        <div className="text-xs text-muted-foreground">Verify via OTP then set new password</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => setSettingsSection("privacy")}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Privacy Settings</div>
                        <div className="text-xs text-muted-foreground">Manage data & visibility</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
                    <div>
                      <div className="font-medium text-foreground text-sm">Language</div>
                      <div className="text-xs text-muted-foreground">English (US)</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}

              {otpStep === "chooseMethod" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground">Choose how to receive your verification OTP:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setOtpMethod("phone")}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${otpMethod === "phone" ? "border-primary bg-primary/10" : "border-border bg-secondary/30"}`}>
                      <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium text-foreground">Phone</div>
                      <div className="text-xs text-muted-foreground mt-1">{maskedPhone}</div>
                    </button>
                    <button onClick={() => setOtpMethod("email")} disabled={!user.email}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${!user.email ? "opacity-40 cursor-not-allowed border-border bg-secondary/30" : otpMethod === "email" ? "border-primary bg-primary/10" : "border-border bg-secondary/30"}`}>
                      <Mail className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <div className="text-sm font-medium text-foreground">Email</div>
                      <div className="text-xs text-muted-foreground mt-1">{maskedEmail || "Not available"}</div>
                    </button>
                  </div>
                  {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                  <div className="flex gap-3">
                    <button onClick={resetOtpFlow} className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium text-sm">Cancel</button>
                    <button onClick={sendOtp} className="flex-1 py-3 rounded-xl gradient-bg text-primary-foreground font-medium text-sm">Send OTP</button>
                  </div>
                </div>
              )}

              {otpStep === "enterOtp" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground">A 6-digit OTP has been sent to your {otpMethod === "phone" ? `phone ${maskedPhone}` : `email ${maskedEmail}`}.</p>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                    <span className="text-xs text-success">Simulated OTP: </span>
                    <span className="font-mono font-bold text-success text-lg tracking-widest">{generatedOtp}</span>
                  </div>
                  <input type="text" maxLength={6} value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground text-center text-2xl tracking-[0.5em] font-mono placeholder:text-sm placeholder:tracking-normal" />
                  {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                  <div className="flex gap-3">
                    <button onClick={resetOtpFlow} className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium text-sm">Cancel</button>
                    <button onClick={verifyOtp} disabled={enteredOtp.length !== 6} className="flex-1 py-3 rounded-xl gradient-bg text-primary-foreground font-medium text-sm disabled:opacity-50">Verify OTP</button>
                  </div>
                </div>
              )}

              {otpStep === "newPassword" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground">OTP verified! Set your new password:</p>
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password (min 6 chars)"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground" />
                  <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground" />
                  {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                  <div className="flex gap-3">
                    <button onClick={resetOtpFlow} className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium text-sm">Cancel</button>
                    <button onClick={submitNewPassword} className="flex-1 py-3 rounded-xl gradient-bg text-primary-foreground font-medium text-sm">Update Password</button>
                  </div>
                </div>
              )}

              {otpStep === "success" && (
                <div className="text-center py-6 animate-fade-in">
                  <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-3" />
                  <h4 className="text-lg font-display font-bold text-foreground mb-1">Password Changed!</h4>
                  <p className="text-sm text-muted-foreground mb-4">Your password has been updated successfully.</p>
                  <button onClick={resetOtpFlow} className="px-6 py-2.5 rounded-xl gradient-bg text-primary-foreground font-medium text-sm">Done</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Privacy Settings Section */}
        {activeSection === "settings" && settingsSection === "privacy" && (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setSettingsSection("main")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Settings
            </button>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Privacy Settings
              </h3>

              {/* Profile Visibility */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-3 block">Profile Visibility</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "public" as const, label: "Public", icon: <Globe className="w-5 h-5" />, desc: "Everyone can see" },
                    { id: "friends" as const, label: "Friends", icon: <Users className="w-5 h-5" />, desc: "Only friends" },
                    { id: "private" as const, label: "Private", icon: <Lock className="w-5 h-5" />, desc: "Only you" },
                  ]).map((v) => (
                    <button key={v.id} onClick={() => setProfileVisibility(v.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        profileVisibility === v.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                      }`}>
                      {v.icon}<span className="text-xs font-medium">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Visibility Toggles */}
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Data Visibility</h4>
                {[
                  { label: "Show Phone Number", desc: "Others can see your phone number", value: showPhone, toggle: () => setShowPhone(!showPhone), icon: <Phone className="w-5 h-5 text-primary" /> },
                  { label: "Show Email Address", desc: "Others can see your email", value: showEmail, toggle: () => setShowEmail(!showEmail), icon: <Mail className="w-5 h-5 text-primary" /> },
                  { label: "Show Room Details", desc: "Others can see your hostel room", value: showRoom, toggle: () => setShowRoom(!showRoom), icon: <MapPin className="w-5 h-5 text-primary" /> },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">{pref.icon}</div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{pref.label}</div>
                        <div className="text-xs text-muted-foreground">{pref.desc}</div>
                      </div>
                    </div>
                    <ToggleSwitch value={pref.value} onChange={pref.toggle} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
