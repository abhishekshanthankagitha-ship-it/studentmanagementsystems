import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap, Building2, UtensilsCrossed, LogOut,
  BookOpen, BarChart3, Calendar, FileText, Calculator,
  PieChart, ClipboardList, Bed, Shirt, MessageSquare, Bell,
  ShoppingCart, MapPin, Car, Wrench, Laptop, Tablet, Smartphone,
  CalendarDays, Trophy, PartyPopper, Users, Library, X, AlertTriangle,
  Clock, ListChecks, CheckCircle2, Circle,
} from "lucide-react";

interface ModuleCircleProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  delay: string;
  onClick: () => void;
  items: { icon: React.ReactNode; label: string }[];
}

const ModuleCircle: React.FC<ModuleCircleProps> = ({ title, icon, description, color, delay, onClick, items }) => (
  <div className="group cursor-pointer" style={{ animation: `fadeIn 0.5s ease-out ${delay} forwards`, opacity: 0 }} onClick={onClick}>
    <div className="flex flex-col items-center">
      <div className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${color}`}
        style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.15)' }}>
        <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-primary/20 group-hover:animate-spin-slow" style={{ animation: 'none' }} />
        <div className="flex flex-col items-center gap-2 text-primary-foreground">
          {icon}
          <span className="text-sm md:text-base font-display font-bold">{title}</span>
        </div>
        {items.slice(0, 4).map((item, i) => {
          const angle = (i * 90 - 45) * (Math.PI / 180);
          const radius = 75;
          return (
            <div key={i} className="absolute w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{ transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`, transitionDelay: `${i * 80}ms` }} title={item.label}>
              {item.icon}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground text-center max-w-[160px] group-hover:text-foreground transition-colors">{description}</p>
    </div>
  </div>
);

const pendingAssignments = [
  { title: "DSA Assignment 3", course: "CSE2001", due: "2026-04-02" },
  { title: "OS Case Study", course: "CSE2002", due: "2026-04-05" },
  { title: "LA Problem Set", course: "MAT2001", due: "2026-04-10" },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load today's todos for popup
  const [dismissedTodos, setDismissedTodos] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTodos = (() => {
    try {
      const saved = localStorage.getItem("slms_todos");
      if (!saved) return [];
      return JSON.parse(saved).filter((t: any) => t.date === todayStr && !t.completed);
    } catch { return []; }
  })();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const visibleReminders = pendingAssignments.filter(a => !dismissedReminders.has(a.title));
  const dismissReminder = (title: string) => setDismissedReminders(prev => new Set(prev).add(title));

  const dayName = currentTime.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = currentTime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const modules: (ModuleCircleProps & { visible: boolean })[] = [
    {
      title: "Academics", icon: <GraduationCap className="w-8 h-8" />, description: "Grades, attendance, timetable & more",
      color: "gradient-bg", delay: "0.1s", onClick: () => navigate("/academics"), visible: true,
      items: [
        { icon: <BookOpen className="w-3.5 h-3.5 text-foreground" />, label: "Courses" },
        { icon: <BarChart3 className="w-3.5 h-3.5 text-foreground" />, label: "Grades" },
        { icon: <Calendar className="w-3.5 h-3.5 text-foreground" />, label: "Timetable" },
        { icon: <FileText className="w-3.5 h-3.5 text-foreground" />, label: "Assignments" },
      ],
    },
    {
      title: "Hostel", icon: <Building2 className="w-8 h-8" />, description: "Room details, mess & complaints",
      color: "bg-accent", delay: "0.15s", onClick: () => navigate("/hostel"), visible: user.role === "Hosteller",
      items: [
        { icon: <Bed className="w-3.5 h-3.5 text-foreground" />, label: "Room" },
        { icon: <Shirt className="w-3.5 h-3.5 text-foreground" />, label: "Laundry" },
        { icon: <MessageSquare className="w-3.5 h-3.5 text-foreground" />, label: "Complaints" },
        { icon: <Bell className="w-3.5 h-3.5 text-foreground" />, label: "Notices" },
      ],
    },
    {
      title: "Food & Roam", icon: <UtensilsCrossed className="w-8 h-8" />, description: "Order food & explore campus",
      color: "bg-success", delay: "0.2s", onClick: () => navigate("/food-roam"), visible: true,
      items: [
        { icon: <ShoppingCart className="w-3.5 h-3.5 text-foreground" />, label: "Order" },
        { icon: <MapPin className="w-3.5 h-3.5 text-foreground" />, label: "Map" },
        { icon: <Car className="w-3.5 h-3.5 text-foreground" />, label: "Rides" },
        { icon: <UtensilsCrossed className="w-3.5 h-3.5 text-foreground" />, label: "Menu" },
      ],
    },
    {
      title: "E-Services", icon: <Wrench className="w-8 h-8" />, description: "Device repair & service",
      color: "bg-warning", delay: "0.25s", onClick: () => navigate("/e-services"), visible: true,
      items: [
        { icon: <Laptop className="w-3.5 h-3.5 text-foreground" />, label: "Laptop" },
        { icon: <Tablet className="w-3.5 h-3.5 text-foreground" />, label: "Tablet" },
        { icon: <Smartphone className="w-3.5 h-3.5 text-foreground" />, label: "Phone" },
        { icon: <Wrench className="w-3.5 h-3.5 text-foreground" />, label: "Repair" },
      ],
    },
    {
      title: "Events", icon: <CalendarDays className="w-8 h-8" />, description: "Register for hostel & college events",
      color: "gradient-bg", delay: "0.3s", onClick: () => navigate("/events"), visible: true,
      items: [
        { icon: <Trophy className="w-3.5 h-3.5 text-foreground" />, label: "Sports" },
        { icon: <PartyPopper className="w-3.5 h-3.5 text-foreground" />, label: "Cultural" },
        { icon: <Users className="w-3.5 h-3.5 text-foreground" />, label: "Teams" },
        { icon: <CalendarDays className="w-3.5 h-3.5 text-foreground" />, label: "Schedule" },
      ],
    },
    {
      title: "Library", icon: <Library className="w-8 h-8" />, description: "Reference materials & PYQs",
      color: "bg-accent", delay: "0.35s", onClick: () => navigate("/library"), visible: true,
      items: [
        { icon: <BookOpen className="w-3.5 h-3.5 text-foreground" />, label: "Books" },
        { icon: <FileText className="w-3.5 h-3.5 text-foreground" />, label: "PDFs" },
        { icon: <BarChart3 className="w-3.5 h-3.5 text-foreground" />, label: "PYQs" },
        { icon: <Calendar className="w-3.5 h-3.5 text-foreground" />, label: "New" },
      ],
    },
    {
      title: "To-Do List", icon: <ListChecks className="w-8 h-8" />, description: "Plan your day with tasks",
      color: "bg-warning", delay: "0.4s", onClick: () => navigate("/todo"), visible: true,
      items: [
        { icon: <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />, label: "Tasks" },
        { icon: <Calendar className="w-3.5 h-3.5 text-foreground" />, label: "Calendar" },
        { icon: <ClipboardList className="w-3.5 h-3.5 text-foreground" />, label: "Plan" },
        { icon: <Circle className="w-3.5 h-3.5 text-foreground" />, label: "Track" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <header className="relative z-10 glass border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground">Student Life</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <Clock className="w-4 h-4 text-primary" />
              <div className="text-xs">
                <div className="font-medium text-foreground">{timeStr}</div>
                <div className="text-muted-foreground">{dayName}, {dateStr}</div>
              </div>
            </div>
            <button onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer" title="View Profile">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="hidden sm:block text-sm">
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-muted-foreground ml-2 text-xs">{user.regNo}</span>
              </div>
              <span className="hidden sm:inline ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold gradient-bg text-primary-foreground">{user.role}</span>
            </button>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="p-2 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-destructive transition-all" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 container py-8">
        {/* Mobile Clock */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-xl bg-secondary/30 border border-border/50 w-fit mx-auto">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground text-sm">{timeStr}</span>
          <span className="text-muted-foreground text-xs">• {dayName}, {dateStr}</span>
        </div>

        {/* Today's To-Do Popup */}
        {todayTodos.length > 0 && !dismissedTodos && (
          <div className="mb-6 glass rounded-xl p-4 border border-primary/30" style={{ animation: "fadeIn 0.4s ease-out" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary" />
                <span className="font-display font-semibold text-foreground text-sm">Today's To-Do</span>
                <span className="text-xs text-muted-foreground">({todayTodos.length} pending)</span>
              </div>
              <button onClick={() => setDismissedTodos(true)} className="p-1 rounded-lg hover:bg-secondary/50"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-1.5">
              {todayTodos.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <Circle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/todo")} className="mt-3 text-xs text-primary hover:text-primary/80 font-medium">View all →</button>
          </div>
        )}

        {/* Assignment Reminders */}
        {visibleReminders.length > 0 && (
          <div className="mb-8 space-y-2" style={{ animation: "fadeIn 0.4s ease-out" }}>
            {visibleReminders.map(a => (
              <div key={a.title} className="glass rounded-xl p-4 flex items-center justify-between border border-warning/30">
                <button onClick={() => navigate("/academics")} className="flex items-center gap-3 flex-1 text-left">
                  <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-sm">{a.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">{a.course} • Due: {a.due}</span>
                  </div>
                </button>
                <button onClick={(e) => { e.stopPropagation(); dismissReminder(a.title); }}
                  className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mb-12" style={{ animation: "fadeIn 0.5s ease-out" }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
          </h2>
          <p className="text-muted-foreground">{user.department} • Year {user.year} • {user.role}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {modules.filter((m) => m.visible).map((m) => (
            <ModuleCircle key={m.title} {...m} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          style={{ animation: "fadeIn 0.6s ease-out 0.5s forwards", opacity: 0 }}>
          {[
            { label: "CGPA", value: "8.54", icon: <BarChart3 className="w-4 h-4" /> },
            { label: "Attendance", value: "82%", icon: <PieChart className="w-4 h-4" /> },
            { label: "Credits", value: "64", icon: <Calculator className="w-4 h-4" /> },
            { label: "Assignments", value: "3 Due", icon: <ClipboardList className="w-4 h-4" /> },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {stat.icon}
                <span className="text-xs font-medium">{stat.label}</span>
              </div>
              <span className="text-2xl font-display font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
