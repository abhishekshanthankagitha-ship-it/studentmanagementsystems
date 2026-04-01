import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, BookOpen, BarChart3, Calendar, FileText, Calculator,
  PieChart, ClipboardList, ChevronRight, Upload, Clock, CheckCircle2,
  TrendingUp, Award, AlertTriangle, User, Phone, Mail, MapPin,
  Download, X, ChevronDown, ChevronUp, Target, Plus, Trash2,
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Tab = "overview" | "marks" | "grades" | "attendance" | "timetable" | "assignments" | "cgpa";

// Grade data with subjects
const gradeSubjects: Record<string, string[]> = {
  S: ["Engineering Mathematics I", "Programming in C", "Digital Logic Design", "Environmental Science"],
  A: ["Engineering Mathematics II", "Object Oriented Programming", "Signals & Systems", "Probability & Statistics", "Engineering Physics", "Engineering Chemistry", "Data Structures Lab", "Computer Organization"],
  B: ["Discrete Mathematics", "Microprocessors", "Technical Writing", "Software Engineering", "Economics for Engineers", "Management Principles"],
  C: ["Constitution of India", "Communication Skills", "Workshop Practice"],
  D: ["Physical Education"],
};

const gradeData = Object.entries(gradeSubjects).map(([grade, subjects]) => ({
  grade,
  count: subjects.length,
  subjects,
  color: grade === "S" ? "hsl(174, 72%, 46%)" : grade === "A" ? "hsl(187, 80%, 42%)" : grade === "B" ? "hsl(262, 83%, 58%)" : grade === "C" ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)",
}));

const courses = [
  { code: "CSE2001", name: "Data Structures", credits: 4, attendance: 88, totalClasses: 50, attended: 44 },
  { code: "CSE2002", name: "Operating Systems", credits: 3, attendance: 92, totalClasses: 48, attended: 44 },
  { code: "MAT2001", name: "Linear Algebra", credits: 4, attendance: 78, totalClasses: 45, attended: 35 },
  { code: "CSE2003", name: "Database Systems", credits: 4, attendance: 85, totalClasses: 47, attended: 40 },
  { code: "CSE2004", name: "Computer Networks", credits: 3, attendance: 72, totalClasses: 50, attended: 36 },
  { code: "HUM1001", name: "Professional Ethics", credits: 2, attendance: 90, totalClasses: 40, attended: 36 },
];

const faculty = [
  { name: "Dr. Rajesh Kumar", course: "CSE2001", designation: "Associate Professor", phone: "9876543210", email: "rajesh.kumar@university.edu", cabin: "Tech Park, Room 204", initials: "RK" },
  { name: "Prof. Anita Sharma", course: "CSE2002", designation: "Assistant Professor", phone: "9876543211", email: "anita.sharma@university.edu", cabin: "Tech Park, Room 301", initials: "AS" },
  { name: "Dr. Suresh Iyer", course: "MAT2001", designation: "Professor", phone: "9876543212", email: "suresh.iyer@university.edu", cabin: "Science Block, Room 105", initials: "SI" },
  { name: "Prof. Meera Das", course: "CSE2003", designation: "Associate Professor", phone: "9876543213", email: "meera.das@university.edu", cabin: "Tech Park, Room 210", initials: "MD" },
  { name: "Dr. Vikram Patel", course: "CSE2004", designation: "Assistant Professor", phone: "9876543214", email: "vikram.patel@university.edu", cabin: "Tech Park, Room 312", initials: "VP" },
  { name: "Prof. Lakshmi Nair", course: "HUM1001", designation: "Assistant Professor", phone: "9876543215", email: "lakshmi.nair@university.edu", cabin: "Humanities Block, Room 102", initials: "LN" },
];

const timetable = [
  { day: "Monday", slots: ["Data Structures", "—", "Operating Systems", "Lab: DBMS", "—"] },
  { day: "Tuesday", slots: ["Linear Algebra", "Computer Networks", "—", "Data Structures", "Prof. Ethics"] },
  { day: "Wednesday", slots: ["DBMS", "—", "Data Structures", "Operating Systems", "—"] },
  { day: "Thursday", slots: ["Computer Networks", "Linear Algebra", "—", "Lab: OS", "Lab: OS"] },
  { day: "Friday", slots: ["Prof. Ethics", "DBMS", "Operating Systems", "—", "Linear Algebra"] },
  { day: "Saturday", slots: ["Holiday", "Holiday", "Holiday", "Holiday", "Holiday"] },
  { day: "Sunday", slots: ["Holiday", "Holiday", "Holiday", "Holiday", "Holiday"] },
];

interface Assignment {
  title: string;
  course: string;
  due: string;
  status: "pending" | "submitted" | "graded";
  score?: string;
  description: string;
  submissionType: "hardcopy" | "softcopy" | "both";
  attachments?: string[];
}

const assignments: Assignment[] = [
  { title: "DSA Assignment 3", course: "CSE2001", due: "2026-04-02", status: "pending", description: "Implement AVL Tree with insertion, deletion, and traversal operations. Submit source code and analysis report.", submissionType: "softcopy", attachments: ["DSA_Assignment3_QP.pdf"] },
  { title: "OS Case Study", course: "CSE2002", due: "2026-04-05", status: "pending", description: "Analyze the process scheduling algorithms used in Linux kernel. Write a detailed comparison of CFS vs Round Robin.", submissionType: "both", attachments: ["OS_CaseStudy_Guidelines.pdf"] },
  { title: "DBMS ER Diagram", course: "CSE2003", due: "2026-03-30", status: "submitted", description: "Design an ER diagram for a university management system with at least 10 entities.", submissionType: "hardcopy" },
  { title: "CN Lab Report", course: "CSE2004", due: "2026-03-28", status: "graded", score: "18/20", description: "Document all experiments performed in Computer Networks lab including socket programming.", submissionType: "softcopy", attachments: ["CN_Lab_Template.pdf"] },
  { title: "LA Problem Set", course: "MAT2001", due: "2026-04-10", status: "pending", description: "Solve problems 1-25 from Chapter 5: Eigenvalues and Eigenvectors. Show all working steps.", submissionType: "hardcopy", attachments: ["LA_ProblemSet5.pdf", "LA_Formula_Sheet.pdf"] },
];

// Past semester marks
const pastMarks = [
  { code: "MAT1001", name: "Engineering Mathematics I", semester: 1, midterm1: 42, midterm2: 38, final: 78, total: 158, grade: "S", maxTotal: 200 },
  { code: "PHY1001", name: "Engineering Physics", semester: 1, midterm1: 35, midterm2: 40, final: 65, total: 140, grade: "A", maxTotal: 200 },
  { code: "CSE1001", name: "Programming in C", semester: 1, midterm1: 45, midterm2: 43, final: 82, total: 170, grade: "S", maxTotal: 200 },
  { code: "ENG1001", name: "Communication Skills", semester: 1, midterm1: 28, midterm2: 30, final: 55, total: 113, grade: "C", maxTotal: 200 },
  { code: "MAT1002", name: "Engineering Mathematics II", semester: 2, midterm1: 38, midterm2: 35, final: 70, total: 143, grade: "A", maxTotal: 200 },
  { code: "CSE1002", name: "Object Oriented Programming", semester: 2, midterm1: 40, midterm2: 37, final: 72, total: 149, grade: "A", maxTotal: 200 },
  { code: "ECE1001", name: "Digital Logic Design", semester: 2, midterm1: 44, midterm2: 42, final: 80, total: 166, grade: "S", maxTotal: 200 },
  { code: "CHE1001", name: "Engineering Chemistry", semester: 2, midterm1: 36, midterm2: 38, final: 68, total: 142, grade: "A", maxTotal: 200 },
];

// Current semester marks (exams done so far)
const currentMarks = [
  { code: "CSE2001", name: "Data Structures", midterm1: 40, midterm1Max: 50, midterm2: null, final: null },
  { code: "CSE2002", name: "Operating Systems", midterm1: 35, midterm1Max: 50, midterm2: null, final: null },
  { code: "MAT2001", name: "Linear Algebra", midterm1: 32, midterm1Max: 50, midterm2: null, final: null },
  { code: "CSE2003", name: "Database Systems", midterm1: 38, midterm1Max: 50, midterm2: null, final: null },
  { code: "CSE2004", name: "Computer Networks", midterm1: 28, midterm1Max: 50, midterm2: null, final: null },
  { code: "HUM1001", name: "Professional Ethics", midterm1: 42, midterm1Max: 50, midterm2: null, final: null },
];

const examSchedule = [
  {
    exam: "Midterm 1", date: "2026-04-15 – 2026-04-20", status: "upcoming",
    subjects: [
      { name: "Data Structures", date: "2026-04-15", time: "10:00 AM", venue: "Exam Hall A", room: "EH-A-204", seat: "R5-S12" },
      { name: "Operating Systems", date: "2026-04-16", time: "10:00 AM", venue: "Exam Hall B", room: "EH-B-101", seat: "R3-S8" },
      { name: "Linear Algebra", date: "2026-04-17", time: "2:00 PM", venue: "Exam Hall A", room: "EH-A-305", seat: "R7-S15" },
      { name: "Database Systems", date: "2026-04-18", time: "10:00 AM", venue: "Exam Hall C", room: "EH-C-102", seat: "R2-S20" },
      { name: "Computer Networks", date: "2026-04-19", time: "2:00 PM", venue: "Exam Hall B", room: "EH-B-203", seat: "R4-S10" },
      { name: "Professional Ethics", date: "2026-04-20", time: "10:00 AM", venue: "Exam Hall A", room: "EH-A-101", seat: "R1-S5" },
    ],
  },
  {
    exam: "Midterm 2", date: "2026-05-20 – 2026-05-25", status: "upcoming",
    subjects: [],
  },
  {
    exam: "Final", date: "2026-06-15 – 2026-06-25", status: "upcoming",
    subjects: [],
  },
];

function classesNeededFor75(attended: number, total: number): number {
  const needed = Math.ceil((0.75 * total - attended) / 0.25);
  return needed > 0 ? needed : 0;
}

function getCountdown(dueDate: string): { days: number; hours: number; minutes: number; seconds: number; overdue: boolean } {
  const now = new Date();
  const due = new Date(dueDate + "T23:59:59");
  const diff = due.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, overdue: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    overdue: false,
  };
}

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const Academics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [cgpaInputs, setCgpaInputs] = useState<Record<string, string>>({});
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [expandedMark, setExpandedMark] = useState<string | null>(null);

  // CGPA Tool states
  const [cgpaMode, setCgpaMode] = useState<"gpa" | "cgpa" | "predictor">("gpa");
  const [addedCourses, setAddedCourses] = useState<{ name: string; credits: string; grade: string }[]>([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("");
  const [newCourseGrade, setNewCourseGrade] = useState("S");
  const [currentCgpa, setCurrentCgpa] = useState("8.54");
  const [currentCredits, setCurrentCredits] = useState("64");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [semCredits, setSemCredits] = useState("");
  const [predictGpa, setPredictGpa] = useState("");
  const [predictCredits, setPredictCredits] = useState("");

  // Countdown timer for selected assignment
  useEffect(() => {
    if (!selectedAssignment || selectedAssignment.status !== "pending") return;
    const timer = setInterval(() => {
      setCountdown(getCountdown(selectedAssignment.due));
    }, 1000);
    setCountdown(getCountdown(selectedAssignment.due));
    return () => clearInterval(timer);
  }, [selectedAssignment]);

  if (!user) return null;

  const overallAttendance = Math.round(courses.reduce((a, c) => a + c.attendance, 0) / courses.length);
  const attendanceData = [
    { name: "Present", value: overallAttendance, color: "hsl(174, 72%, 46%)" },
    { name: "Absent", value: 100 - overallAttendance, color: "hsl(0, 84%, 60%)" },
  ];

  const gradePoints: Record<string, number> = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

  const calcGPA = () => {
    if (addedCourses.length === 0) return "0.00";
    let tc = 0, tp = 0;
    addedCourses.forEach(c => {
      const cr = parseFloat(c.credits) || 0;
      tc += cr;
      tp += (gradePoints[c.grade] || 0) * cr;
    });
    return tc > 0 ? (tp / tc).toFixed(2) : "0.00";
  };

  const calcCGPA = () => {
    const cc = parseFloat(currentCgpa) || 0;
    const ccr = parseFloat(currentCredits) || 0;
    const sgpa = parseFloat(calcGPA());
    const scr = addedCourses.reduce((a, c) => a + (parseFloat(c.credits) || 0), 0);
    if (ccr + scr === 0) return "0.00";
    return ((cc * ccr + sgpa * scr) / (ccr + scr)).toFixed(2);
  };

  const estimateRequiredGPA = () => {
    const tc = parseFloat(targetCgpa) || 0;
    const cc = parseFloat(currentCgpa) || 0;
    const ccr = parseFloat(currentCredits) || 0;
    const sc = parseFloat(semCredits) || 0;
    if (sc === 0) return "N/A";
    const required = (tc * (ccr + sc) - cc * ccr) / sc;
    if (required > 10) return "> 10 (Not possible)";
    if (required < 0) return "0.00 (Already achieved)";
    return required.toFixed(2);
  };

  const predictNewCGPA = () => {
    const cc = parseFloat(currentCgpa) || 0;
    const ccr = parseFloat(currentCredits) || 0;
    const gpa = parseFloat(predictGpa) || 0;
    const pc = parseFloat(predictCredits) || 0;
    if (ccr + pc === 0) return "0.00";
    return ((cc * ccr + gpa * pc) / (ccr + pc)).toFixed(2);
  };

  const addCourse = () => {
    if (!newCourseName || !newCourseCredits) return;
    setAddedCourses(prev => [...prev, { name: newCourseName, credits: newCourseCredits, grade: newCourseGrade }]);
    setNewCourseName("");
    setNewCourseCredits("");
    setNewCourseGrade("S");
  };

  const handleDownload = (filename: string) => {
    const blob = new Blob([`Simulated PDF content for: ${filename}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "marks", label: "Marks", icon: <Target className="w-4 h-4" /> },
    { id: "grades", label: "Grades", icon: <Award className="w-4 h-4" /> },
    { id: "attendance", label: "Attendance", icon: <PieChart className="w-4 h-4" /> },
    { id: "timetable", label: "Timetable", icon: <Calendar className="w-4 h-4" /> },
    { id: "assignments", label: "Assignments", icon: <FileText className="w-4 h-4" /> },
    { id: "cgpa", label: "CGPA Tool", icon: <Calculator className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Academics</h1>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "gradient-bg text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "CGPA", value: "8.54", icon: <TrendingUp className="w-5 h-5" />, color: "text-success" },
                { label: "Attendance", value: `${overallAttendance}%`, icon: <PieChart className="w-5 h-5" />, color: overallAttendance < 75 ? "text-destructive" : "text-primary" },
                { label: "Credits", value: "64/160", icon: <Award className="w-5 h-5" />, color: "text-accent" },
                { label: "Courses", value: String(courses.length), icon: <BookOpen className="w-5 h-5" />, color: "text-warning" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-5">
                  <div className={`${s.color} mb-2`}>{s.icon}</div>
                  <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Exam Schedule */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" /> Exam Schedule
              </h3>
              <div className="space-y-3">
                {examSchedule.map((e) => {
                  const days = daysUntil(e.date.split(" – ")[0]);
                  const showDetails = days <= 10 && days > 0 && e.subjects.length > 0;
                  const isExpanded = expandedExam === e.exam;
                  return (
                    <div key={e.exam}>
                      <button
                        onClick={() => showDetails && setExpandedExam(isExpanded ? null : e.exam)}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{e.exam}</span>
                          <span className="text-sm text-muted-foreground">{e.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {showDetails && <span className="text-xs text-primary">{days}d away</span>}
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">{e.status}</span>
                          {showDetails && (isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
                        </div>
                      </button>
                      {isExpanded && showDetails && (
                        <div className="mt-2 space-y-2 pl-4 animate-fade-in">
                          {e.subjects.map(s => (
                            <div key={s.name} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-foreground text-sm">{s.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{s.date} • {s.time}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground">{s.venue}</div>
                                  <div className="text-xs text-primary font-medium">Room: {s.room} • Seat: {s.seat}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Courses */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Current Courses
              </h3>
              <div className="space-y-2">
                {courses.map((c) => (
                  <div key={c.code} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                      <span className="font-medium text-foreground ml-2">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{c.credits} credits</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${c.attendance < 75 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                        {c.attendance}% att.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty List */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Course Faculty
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {faculty.map((f) => {
                  const course = courses.find(c => c.code === f.course);
                  return (
                    <div key={f.course} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-lg font-display font-bold text-primary-foreground flex-shrink-0">
                          {f.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{f.name}</h4>
                          <p className="text-xs text-primary font-medium">{f.designation}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{course?.name} ({f.course})</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {f.phone}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {f.email}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> {f.cabin}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Marks */}
        {activeTab === "marks" && (
          <div className="space-y-6 animate-fade-in">
            {/* Current Semester */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Current Semester Marks
              </h3>
              <div className="space-y-2">
                {currentMarks.map(m => (
                  <div key={m.code} className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">{m.code}</span>
                        <span className="font-medium text-foreground ml-2">{m.name}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{m.midterm1}/{m.midterm1Max}</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className={`px-2 py-1 rounded ${m.midterm1 !== null ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'}`}>
                        MT1: {m.midterm1 ?? "—"}/{m.midterm1Max}
                      </span>
                      <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">MT2: —</span>
                      <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">Final: —</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Semesters */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Past Semester Marks</h3>
              <div className="space-y-2">
                {pastMarks.map(m => {
                  const isExpanded = expandedMark === m.code;
                  return (
                    <div key={m.code}>
                      <button
                        onClick={() => setExpandedMark(isExpanded ? null : m.code)}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="text-left">
                          <span className="font-mono text-xs text-muted-foreground">{m.code}</span>
                          <span className="font-medium text-foreground ml-2">{m.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">Sem {m.semester}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: gradeData.find(g => g.grade === m.grade)?.color + "20", color: gradeData.find(g => g.grade === m.grade)?.color }}>
                            {m.grade}
                          </div>
                          <span className="font-bold text-foreground">{m.total}/{m.maxTotal}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="mt-1 p-4 rounded-lg bg-secondary/20 border border-border/50 animate-fade-in">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <div className="text-xs text-muted-foreground">Midterm 1</div>
                              <div className="font-bold text-foreground">{m.midterm1}/50</div>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <div className="text-xs text-muted-foreground">Midterm 2</div>
                              <div className="font-bold text-foreground">{m.midterm2}/50</div>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <div className="text-xs text-muted-foreground">Final</div>
                              <div className="font-bold text-foreground">{m.final}/100</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Grades */}
        {activeTab === "grades" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Grade Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={gradeData} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={80} label={({ grade, count }) => `${grade}: ${count}`}>
                        {gradeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Click a grade to see subjects</h3>
                <div className="space-y-3">
                  {gradeData.map((g) => (
                    <div key={g.grade}>
                      <button
                        onClick={() => setExpandedGrade(expandedGrade === g.grade ? null : g.grade)}
                        className="w-full flex items-center justify-between hover:bg-secondary/30 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: g.color + "20", color: g.color }}>
                            {g.grade}
                          </div>
                          <span className="text-foreground font-medium">Grade {g.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{g.count} courses</span>
                          {expandedGrade === g.grade ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {expandedGrade === g.grade && (
                        <div className="ml-11 mt-1 space-y-1 animate-fade-in">
                          {g.subjects.map(s => (
                            <div key={s} className="text-sm text-muted-foreground flex items-center gap-2 py-1">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.color }} />
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Credits Earned</span>
                    <span className="font-bold text-foreground">64</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance */}
        {activeTab === "attendance" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Overall Attendance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={attendanceData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                        {attendanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="text-center -mt-[160px] relative z-10">
                    <span className="text-3xl font-display font-bold text-foreground">{overallAttendance}%</span>
                  </div>
                  <div className="h-[120px]" />
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Course-wise Attendance</h3>
                <div className="space-y-4">
                  {courses.map((c) => {
                    const needed = classesNeededFor75(c.attended, c.totalClasses);
                    return (
                      <div key={c.code}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground">{c.name}</span>
                          <span className={c.attendance < 75 ? "text-destructive font-semibold" : "text-muted-foreground"}>{c.attendance}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${c.attendance >= 75 ? "bg-success" : "bg-destructive"}`} style={{ width: `${c.attendance}%` }} />
                        </div>
                        {c.attendance < 75 && needed > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertTriangle className="w-3 h-3" />
                            Attend {needed} more classes to reach 75%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timetable */}
        {activeTab === "timetable" && (
          <div className="animate-fade-in">
            <div className="glass rounded-xl p-6 overflow-x-auto">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Weekly Timetable
              </h3>
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Day</th>
                    {["9:00-10:00", "10:00-11:00", "11:30-12:30", "2:00-3:00", "3:00-4:00"].map((t) => (
                      <th key={t} className="text-center text-xs text-muted-foreground font-medium p-3">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((row) => (
                    <tr key={row.day} className="border-t border-border">
                      <td className="p-3 font-medium text-sm text-foreground">{row.day}</td>
                      {row.slots.map((slot, i) => (
                        <td key={i} className="p-2 text-center">
                          {slot === "Holiday" ? (
                            <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-md">🎉 Holiday</span>
                          ) : slot === "—" ? (
                            <span className="text-muted-foreground/40">—</span>
                          ) : (
                            <span className="text-xs font-medium text-foreground bg-primary/10 px-2 py-1.5 rounded-md block">{slot}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignments */}
        {activeTab === "assignments" && (
          <div className="space-y-4 animate-fade-in">
            {selectedAssignment ? (
              <div className="glass rounded-xl p-6 animate-fade-in">
                <button onClick={() => setSelectedAssignment(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Assignments
                </button>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-foreground">{selectedAssignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAssignment.course} • Due: {selectedAssignment.due}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedAssignment.status === "graded" ? "bg-success/10 text-success" :
                    selectedAssignment.status === "submitted" ? "bg-primary/10 text-primary" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {selectedAssignment.status}
                  </span>
                </div>

                {/* Countdown for pending */}
                {selectedAssignment.status === "pending" && countdown && (
                  <div className={`p-4 rounded-xl mb-4 ${countdown.overdue ? "bg-destructive/10 border border-destructive/30" : "bg-warning/10 border border-warning/30"}`}>
                    <div className="text-xs text-muted-foreground mb-2">{countdown.overdue ? "⚠️ Overdue!" : "⏰ Time Remaining"}</div>
                    {!countdown.overdue && (
                      <div className="flex gap-3">
                        {[
                          { v: countdown.days, l: "Days" },
                          { v: countdown.hours, l: "Hrs" },
                          { v: countdown.minutes, l: "Min" },
                          { v: countdown.seconds, l: "Sec" },
                        ].map(t => (
                          <div key={t.l} className="text-center p-2 rounded-lg bg-background/50 min-w-[50px]">
                            <div className="text-xl font-display font-bold text-foreground">{t.v}</div>
                            <div className="text-[10px] text-muted-foreground">{t.l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedAssignment.status === "graded" && (
                  <div className="p-4 rounded-xl bg-success/10 border border-success/30 mb-4">
                    <span className="text-sm text-muted-foreground">Score: </span>
                    <span className="text-lg font-bold text-success">{selectedAssignment.score}</span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-secondary/30 mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Submission:</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      selectedAssignment.submissionType === "hardcopy" ? "bg-amber-500/10 text-amber-400" :
                      selectedAssignment.submissionType === "softcopy" ? "bg-primary/10 text-primary" :
                      "bg-accent/10 text-accent-foreground"
                    }`}>
                      {selectedAssignment.submissionType === "both" ? "Hardcopy + Softcopy" : selectedAssignment.submissionType === "hardcopy" ? "Hardcopy Only" : "Softcopy Only"}
                    </span>
                  </div>
                </div>

                {/* Attachments */}
                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Attachments</h4>
                    <div className="space-y-2">
                      {selectedAssignment.attachments.map(f => (
                        <button key={f} onClick={() => handleDownload(f)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm text-foreground flex-1 text-left">{f}</span>
                          <Download className="w-4 h-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* File submission for softcopy */}
                {(selectedAssignment.submissionType === "softcopy" || selectedAssignment.submissionType === "both") && selectedAssignment.status === "pending" && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Submit Your Work</h4>
                    <p className="text-xs text-muted-foreground mb-3">Accepted: PDF, DOCX, MP4, MP3, PNG, JPG, ODT</p>
                    <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm cursor-pointer hover:bg-primary/20 transition-colors">
                      <Upload className="w-4 h-4" /> Choose File
                      <input type="file" className="hidden" accept=".pdf,.docx,.mp4,.mp3,.png,.jpg,.jpeg,.odt" onChange={() => alert("File submitted successfully! (Simulated)")} />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              assignments.map((a) => (
                <button
                  key={a.title}
                  onClick={() => setSelectedAssignment(a)}
                  className="w-full glass rounded-xl p-5 flex items-center justify-between text-left hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      a.status === "graded" ? "bg-success/10" : a.status === "submitted" ? "bg-primary/10" : "bg-warning/10"
                    }`}>
                      {a.status === "graded" ? <CheckCircle2 className="w-5 h-5 text-success" /> :
                       a.status === "submitted" ? <Upload className="w-5 h-5 text-primary" /> :
                       <Clock className="w-5 h-5 text-warning" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{a.title}</h4>
                      <p className="text-xs text-muted-foreground">{a.course} • Due: {a.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.status === "graded" && <span className="text-sm font-semibold text-success">{a.score}</span>}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.status === "graded" ? "bg-success/10 text-success" :
                      a.status === "submitted" ? "bg-primary/10 text-primary" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {a.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* CGPA Tool */}
        {activeTab === "cgpa" && (
          <div className="space-y-6 animate-fade-in">
            {/* Mode selector */}
            <div className="flex gap-2">
              {[
                { id: "gpa" as const, label: "Calculate GPA" },
                { id: "cgpa" as const, label: "CGPA Summary" },
                { id: "predictor" as const, label: "CGPA Predictor" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setCgpaMode(m.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    cgpaMode === m.id ? "gradient-bg text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {cgpaMode === "gpa" && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">GPA Calculator</h3>
                <p className="text-sm text-muted-foreground mb-6">Add courses with credits and expected grades</p>

                <div className="flex gap-2 mb-4">
                  <input value={newCourseName} onChange={e => setNewCourseName(e.target.value)} placeholder="Course name" className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                  <input value={newCourseCredits} onChange={e => setNewCourseCredits(e.target.value)} placeholder="Credits" type="number" className="w-20 px-3 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                  <select value={newCourseGrade} onChange={e => setNewCourseGrade(e.target.value)} className="px-3 py-3 rounded-xl bg-secondary/50 border border-border text-foreground outline-none focus:border-primary">
                    {["S", "A", "B", "C", "D", "E", "F"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <button onClick={addCourse} className="p-3 rounded-xl gradient-bg text-primary-foreground"><Plus className="w-5 h-5" /></button>
                </div>

                {addedCourses.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {addedCourses.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div>
                          <span className="font-medium text-foreground">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({c.credits} cr)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">{c.grade}</span>
                          <button onClick={() => setAddedCourses(prev => prev.filter((_, idx) => idx !== i))} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">No courses added yet</div>
                )}

                <div className="p-5 rounded-xl gradient-bg text-center">
                  <span className="text-sm text-primary-foreground/80">Calculated GPA</span>
                  <div className="text-4xl font-display font-bold text-primary-foreground mt-1">{calcGPA()}</div>
                </div>

                <button onClick={() => setAddedCourses([])} className="w-full mt-3 py-2.5 rounded-xl bg-secondary/50 text-muted-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary">
                  <X className="w-4 h-4" /> Clear All
                </button>
              </div>
            )}

            {cgpaMode === "cgpa" && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Your CGPA Summary</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Current CGPA</label>
                    <input value={currentCgpa} onChange={e => setCurrentCgpa(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Current Credits</label>
                    <input value={currentCredits} onChange={e => setCurrentCredits(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="p-5 rounded-xl gradient-bg text-center mb-6">
                  <span className="text-sm text-primary-foreground/80">New CGPA (with added courses)</span>
                  <div className="text-4xl font-display font-bold text-primary-foreground mt-1">{calcCGPA()}</div>
                </div>

                <h4 className="font-semibold text-foreground mb-3">CGPA Estimator</h4>
                <p className="text-sm text-muted-foreground mb-3">What GPA do you need to reach your target?</p>
                <div className="space-y-3">
                  <input value={targetCgpa} onChange={e => setTargetCgpa(e.target.value)} placeholder="Target CGPA" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                  <input value={semCredits} onChange={e => setSemCredits(e.target.value)} placeholder="Credits this semester" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
                <div className="mt-4 p-4 rounded-xl bg-secondary/30 text-center">
                  <span className="text-sm text-muted-foreground">Required GPA this semester</span>
                  <div className="text-2xl font-display font-bold text-foreground mt-1">{estimateRequiredGPA()}</div>
                </div>
              </div>
            )}

            {cgpaMode === "predictor" && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">CGPA Predictor</h3>
                <p className="text-sm text-muted-foreground mb-6">Calculate your new CGPA after this semester</p>
                <div className="space-y-3 mb-4">
                  <input value={predictGpa} onChange={e => setPredictGpa(e.target.value)} placeholder="Expected GPA this semester" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                  <input value={predictCredits} onChange={e => setPredictCredits(e.target.value)} placeholder="Credits this semester" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
                <div className="p-5 rounded-xl gradient-bg text-center">
                  <span className="text-sm text-primary-foreground/80">Predicted New CGPA</span>
                  <div className="text-4xl font-display font-bold text-primary-foreground mt-1">{predictNewCGPA()}</div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">Based on current CGPA: {currentCgpa} with {currentCredits} credits</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;
