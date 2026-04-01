import React, { createContext, useContext, useState, useCallback } from "react";
import { students, Student } from "@/data/students";

interface AuthContextType {
  user: Student | null;
  login: (regNo: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (regNo: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem("slms_user");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((regNo: string, password: string) => {
    const student = students.find((s) => s.regNo === regNo);
    if (!student) return { success: false, error: "Registration number not found" };
    if (student.password !== password) return { success: false, error: "Incorrect password" };
    setUser(student);
    localStorage.setItem("slms_user", JSON.stringify(student));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("slms_user");
  }, []);

  const changePassword = useCallback((regNo: string, newPassword: string) => {
    const student = students.find((s) => s.regNo === regNo);
    if (!student) return false;
    student.password = newPassword;
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
