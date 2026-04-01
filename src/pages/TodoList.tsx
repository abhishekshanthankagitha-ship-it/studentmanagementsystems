import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, ListChecks, Plus, Trash2, CheckCircle2, Circle,
  Calendar, ChevronLeft, ChevronRight, X,
} from "lucide-react";

interface TodoItem {
  id: number;
  text: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem("slms_todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [viewWeekStart, setViewWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const saveTodos = (updated: TodoItem[]) => {
    setTodos(updated);
    localStorage.setItem("slms_todos", JSON.stringify(updated));
  };

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(viewWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [viewWeekStart]);

  if (!user) return null;

  const addTodo = () => {
    if (!newTask.trim()) return;
    saveTodos([...todos, { id: Date.now(), text: newTask.trim(), date: selectedDate, completed: false }]);
    setNewTask("");
  };

  const toggleTodo = (id: number) => saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo = (id: number) => saveTodos(todos.filter(t => t.id !== id));

  const shiftWeek = (dir: number) => {
    const d = new Date(viewWeekStart);
    d.setDate(d.getDate() + dir * 7);
    setViewWeekStart(d);
  };

  const dateTodos = todos.filter(t => t.date === selectedDate);
  const today = new Date().toISOString().split("T")[0];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-background dark">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-warning-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">To-Do List</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl">
        {/* Week Calendar Bar */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => shiftWeek(-1)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-display font-semibold text-foreground">
              {monthNames[viewWeekStart.getMonth()]} {viewWeekStart.getFullYear()}
            </span>
            <button onClick={() => shiftWeek(1)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const ds = d.toISOString().split("T")[0];
              const isSelected = ds === selectedDate;
              const isToday = ds === today;
              const hasTodos = todos.some(t => t.date === ds);
              return (
                <button
                  key={ds}
                  onClick={() => setSelectedDate(ds)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all relative ${
                    isSelected ? "gradient-bg text-primary-foreground" :
                    isToday ? "bg-primary/10 text-primary" :
                    "hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <span className="text-[10px] font-medium">{dayNames[d.getDay()]}</span>
                  <span className="text-lg font-display font-bold">{d.getDate()}</span>
                  {hasTodos && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Task */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button onClick={addTodo} className="px-4 py-3 rounded-xl gradient-bg text-primary-foreground font-medium">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Adding to: {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {dateTodos.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <ListChecks className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No tasks for this day</p>
              <p className="text-sm text-muted-foreground mt-1">Add a task above to get started</p>
            </div>
          ) : (
            dateTodos.map(todo => (
              <div key={todo.id} className={`glass rounded-xl p-4 flex items-center gap-3 transition-all ${todo.completed ? "opacity-60" : ""}`}>
                <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                  {todo.completed ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />}
                </button>
                <span className={`flex-1 text-foreground ${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
