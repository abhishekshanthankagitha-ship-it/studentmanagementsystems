import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, Building2, Bed, UtensilsCrossed, Shirt, MessageSquare,
  Bell, Send, CheckCircle2, Clock, AlertTriangle, Plus, Phone, Mail,
  MapPin, Users, Trophy, Dumbbell, PartyPopper, Calendar,
} from "lucide-react";

const messMenu = {
  Monday: { breakfast: "Idli, Sambar, Coffee", lunch: "Rice, Dal, Paneer Butter Masala", dinner: "Chapati, Chole, Rice" },
  Tuesday: { breakfast: "Dosa, Chutney, Milk", lunch: "Rice, Rajma, Aloo Gobi", dinner: "Fried Rice, Manchurian" },
  Wednesday: { breakfast: "Poha, Jalebi, Tea", lunch: "Rice, Sambar, Curd", dinner: "Paratha, Dal Makhani" },
  Thursday: { breakfast: "Puri, Sabzi, Coffee", lunch: "Biryani, Raita, Salad", dinner: "Noodles, Gobi 65" },
  Friday: { breakfast: "Upma, Vada, Tea", lunch: "Rice, Rasam, Fish Curry", dinner: "Chapati, Palak Paneer" },
  Saturday: { breakfast: "Bread, Omelette, Juice", lunch: "Rice, Dal, Chicken Curry", dinner: "Dosa, Chutney" },
  Sunday: { breakfast: "Aloo Paratha, Curd", lunch: "Special Biryani, Ice Cream", dinner: "Light Meal, Soup" },
};

const laundrySchedule = [
  { day: "Monday", time: "6:00 AM – 9:00 AM", status: "available" },
  { day: "Wednesday", time: "6:00 AM – 9:00 AM", status: "available" },
  { day: "Friday", time: "6:00 AM – 9:00 AM", status: "available" },
  { day: "Sunday", time: "8:00 AM – 12:00 PM", status: "available" },
];

const notifications = [
  {
    title: "Annual Sports Meet — Cricket Tournament",
    desc: "Inter-hostel cricket tournament (T20 format). Open for all hostellers.",
    time: "2 hours ago", type: "sports",
    venue: "Cricket Ground (Main Sports Ground)", participation: "Team (11 players)",
    dressCode: "White sports attire with sports shoes mandatory", additionalInfo: "Report at venue by 5:45 AM. Carry ID card."
  },
  {
    title: "Indoor Badminton Championship",
    desc: "Singles and doubles badminton tournament. Register at hostel office.",
    time: "5 hours ago", type: "sports",
    venue: "Indoor Stadium (Sports Complex)", participation: "Solo / Doubles (2 players)",
    dressCode: "Sports wear with non-marking shoes", additionalInfo: "Own rackets recommended. Shuttlecocks provided."
  },
  {
    title: "Hostel Day Cultural Night",
    desc: "Annual hostel day celebration with performances, food stalls, and prizes.",
    time: "1 day ago", type: "event",
    venue: "Main Auditorium", participation: "Solo / Group (any size)",
    dressCode: "Traditional or formal attire", additionalInfo: "Performances: dance, singing, skit, stand-up. Register by April 3rd."
  },
  {
    title: "Inter-Block Football Match",
    desc: "5-a-side football tournament between hostel blocks.",
    time: "1 day ago", type: "sports",
    venue: "Football Ground (behind Hostel Block E)", participation: "Team (5+2 substitutes)",
    dressCode: "Block colored jerseys with shorts and studs", additionalInfo: "Each block can register one team."
  },
  {
    title: "Water Supply Maintenance",
    desc: "Water supply will be interrupted on March 30, 6-8 AM for tank cleaning.",
    time: "2 days ago", type: "maintenance",
    venue: "All Hostel Blocks", participation: "N/A",
    dressCode: "N/A", additionalInfo: "Store water in buckets before 6 AM."
  },
  {
    title: "Table Tennis Tournament",
    desc: "Singles table tennis tournament. Winner represents hostel in inter-college meet.",
    time: "3 days ago", type: "sports",
    venue: "Recreation Room, Block D (Ground Floor)", participation: "Solo",
    dressCode: "Casual sports wear", additionalInfo: "Own paddle recommended. Best of 3 sets format."
  },
  {
    title: "Movie Night — Open Air",
    desc: "Outdoor movie screening with popcorn and refreshments.",
    time: "3 days ago", type: "event",
    venue: "Amphitheatre (near Library)", participation: "Open to all",
    dressCode: "Casual. Bring your own blanket/mat.", additionalInfo: "No outside food. Refreshments available at venue."
  },
];

type HostelTab = "room" | "mess" | "laundry" | "complaints" | "notices";

const Hostel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HostelTab>("room");
  const [complaints, setComplaints] = useState<{id:number;title:string;desc:string;status:"pending"|"in-progress"|"resolved";date:string}[]>([
    { id: 1, title: "AC not working", desc: "Room AC making noise and not cooling", status: "in-progress", date: "2026-03-25" },
    { id: 2, title: "Bathroom leak", desc: "Water leaking from bathroom pipe", status: "resolved", date: "2026-03-20" },
  ]);
  const [newComplaint, setNewComplaint] = useState({ title: "", desc: "" });
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);

  if (!user) return null;

  const tabs: { id: HostelTab; label: string; icon: React.ReactNode }[] = [
    { id: "room", label: "Room", icon: <Bed className="w-4 h-4" /> },
    { id: "mess", label: "Mess", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: "laundry", label: "Laundry", icon: <Shirt className="w-4 h-4" /> },
    { id: "complaints", label: "Complaints", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "notices", label: "Notices", icon: <Bell className="w-4 h-4" /> },
  ];

  const submitComplaint = () => {
    if (!newComplaint.title.trim()) return;
    setComplaints([{ id: Date.now(), title: newComplaint.title, desc: newComplaint.desc, status: "pending" as const, date: new Date().toISOString().split("T")[0] }, ...complaints]);
    setNewComplaint({ title: "", desc: "" });
  };

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case "sports": return <Trophy className="w-5 h-5 text-success" />;
      case "event": return <PartyPopper className="w-5 h-5 text-accent" />;
      default: return <Bell className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Hostel</h1>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "room" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-6">Room Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Room No", value: user.roomNo || "N/A" },
                  { label: "Block", value: user.block || "N/A" },
                  { label: "Floor", value: user.roomNo ? `${user.roomNo.split("-")[1]?.[0] || "G"}` : "N/A" },
                  { label: "Type", value: "Double Sharing" },
                ].map((d) => (
                  <div key={d.label} className="p-4 rounded-lg bg-secondary/30 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{d.label}</div>
                    <div className="text-lg font-display font-bold text-foreground">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-6">Warden & Hostel Office</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-secondary/30">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">RK</div>
                  <div className="space-y-1.5">
                    <h4 className="font-display font-semibold text-foreground">Dr. Rajesh Kumar</h4>
                    <p className="text-xs text-muted-foreground">Chief Warden — Block {user.block || "A"}</p>
                    <div className="flex items-center gap-2 text-sm text-foreground"><Phone className="w-3.5 h-3.5 text-primary" /><span>+91 98765 43210</span></div>
                    <div className="flex items-center gap-2 text-sm text-foreground"><Mail className="w-3.5 h-3.5 text-primary" /><span>warden.{(user.block || "A").toLowerCase()}@university.ac.in</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-secondary/30">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"><Building2 className="w-7 h-7 text-accent" /></div>
                  <div className="space-y-1.5">
                    <h4 className="font-display font-semibold text-foreground">Hostel Office</h4>
                    <p className="text-xs text-muted-foreground">Administrative Block, Ground Floor</p>
                    <div className="flex items-center gap-2 text-sm text-foreground"><Phone className="w-3.5 h-3.5 text-primary" /><span>+91 44 2345 6789</span></div>
                    <div className="flex items-center gap-2 text-sm text-foreground"><Mail className="w-3.5 h-3.5 text-primary" /><span>hosteloffice@university.ac.in</span></div>
                    <p className="text-xs text-muted-foreground mt-1">Office Hours: Mon–Sat, 9 AM – 5 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mess" && (
          <div className="animate-fade-in glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Weekly Mess Menu</h3>
            <div className="space-y-3">
              {Object.entries(messMenu).map(([day, meals]) => (
                <div key={day} className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-semibold text-foreground mb-2">{day}</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-xs text-muted-foreground">Breakfast:</span><br /><span className="text-foreground">{meals.breakfast}</span></div>
                    <div><span className="text-xs text-muted-foreground">Lunch:</span><br /><span className="text-foreground">{meals.lunch}</span></div>
                    <div><span className="text-xs text-muted-foreground">Dinner:</span><br /><span className="text-foreground">{meals.dinner}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "laundry" && (
          <div className="animate-fade-in glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Laundry Schedule</h3>
            <div className="space-y-3">
              {laundrySchedule.map((l) => (
                <div key={l.day} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div><span className="font-medium text-foreground">{l.day}</span><span className="text-sm text-muted-foreground ml-3">{l.time}</span></div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Available</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> New Complaint</h3>
              <div className="space-y-3">
                <input value={newComplaint.title} onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })} placeholder="Complaint title"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                <textarea value={newComplaint.desc} onChange={(e) => setNewComplaint({ ...newComplaint, desc: e.target.value })} placeholder="Description..." rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground resize-none" />
                <button onClick={submitComplaint} className="px-6 py-2.5 rounded-xl gradient-bg text-primary-foreground font-medium text-sm flex items-center gap-2"><Send className="w-4 h-4" /> Submit</button>
              </div>
            </div>
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="glass rounded-xl p-5 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === "resolved" ? "bg-success/10" : c.status === "in-progress" ? "bg-warning/10" : "bg-primary/10"}`}>
                      {c.status === "resolved" ? <CheckCircle2 className="w-5 h-5 text-success" /> : c.status === "in-progress" ? <Clock className="w-5 h-5 text-warning" /> : <AlertTriangle className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{c.title}</h4>
                      <p className="text-sm text-muted-foreground">{c.desc}</p>
                      <span className="text-xs text-muted-foreground mt-1 block">{c.date}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === "resolved" ? "bg-success/10 text-success" : c.status === "in-progress" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="space-y-3 animate-fade-in">
            {notifications.map((n, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setExpandedNotice(expandedNotice === i ? null : i)}
                  className="w-full p-5 text-left hover:bg-secondary/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      {getNoticeIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{n.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{n.desc}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">{n.time}</span>
                    </div>
                  </div>
                </button>

                {expandedNotice === i && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/50 mt-0 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Venue</div>
                          <div className="text-sm font-medium text-foreground">{n.venue}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                        <Users className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Participation</div>
                          <div className="text-sm font-medium text-foreground">{n.participation}</div>
                        </div>
                      </div>
                      {n.dressCode !== "N/A" && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                          <Shirt className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Dress Code</div>
                            <div className="text-sm font-medium text-foreground">{n.dressCode}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                        <Bell className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Additional Info</div>
                          <div className="text-sm font-medium text-foreground">{n.additionalInfo}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hostel;
