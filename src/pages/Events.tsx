import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, CalendarDays, Users, Trophy, PartyPopper, ChevronRight,
  CheckCircle2, Star, Clock, MapPin, UserPlus,
} from "lucide-react";
import PaymentGateway from "@/components/PaymentGateway";

type EventCategory = "hostel" | "college";
type FlowState = "browse" | "details" | "register" | "payment" | "confirmed" | "myEvents";

interface EventItem {
  id: number; title: string; category: EventCategory; date: string; time: string;
  venue: string; description: string; terms: string[]; teamSize: number; fee: number; maxTeams: number;
}

interface Registration {
  eventId: number; teamName: string; members: string[]; paymentMethod?: string;
}

const eventsData: EventItem[] = [
  { id: 1, title: "Cricket Tournament", category: "hostel", date: "2026-03-30", time: "6:00 AM", venue: "Main Ground", description: "Inter-hostel cricket tournament. T20 format with knockout rounds.", terms: ["Must belong to same hostel block", "No external players", "Wear sports attire"], teamSize: 11, fee: 200, maxTeams: 16 },
  { id: 2, title: "Chess Championship", category: "hostel", date: "2026-03-31", time: "3:00 PM", venue: "Recreation Room, Block D", description: "Individual chess championship. Swiss format with 5 rounds.", terms: ["Bring your own chess clock if possible", "No electronic devices"], teamSize: 1, fee: 0, maxTeams: 64 },
  { id: 3, title: "Badminton Doubles", category: "hostel", date: "2026-04-01", time: "5:00 PM", venue: "Indoor Stadium", description: "Doubles badminton tournament. Knockout format.", terms: ["Both players from same block", "Sports shoes mandatory"], teamSize: 2, fee: 100, maxTeams: 32 },
  { id: 4, title: "Carrom Night", category: "hostel", date: "2026-04-02", time: "7:00 PM", venue: "Common Room, Block B", description: "Doubles carrom tournament with refreshments.", terms: ["Casual wear allowed", "Report 15 min early"], teamSize: 2, fee: 0, maxTeams: 24 },
  { id: 5, title: "Movie Night", category: "hostel", date: "2026-04-03", time: "8:00 PM", venue: "Auditorium", description: "Outdoor movie screening with popcorn and drinks.", terms: ["Bring your own blanket", "No outside food"], teamSize: 1, fee: 50, maxTeams: 200 },
  { id: 6, title: "Hackathon 2026", category: "college", date: "2026-03-30", time: "9:00 AM", venue: "Tech Park, Lab 5", description: "24-hour coding hackathon. Build innovative solutions. Prizes worth ₹50,000.", terms: ["Must have laptop", "Team leader must register all members", "No pre-built projects"], teamSize: 4, fee: 500, maxTeams: 50 },
  { id: 7, title: "Cultural Fest - Dance", category: "college", date: "2026-03-31", time: "4:00 PM", venue: "Main Auditorium", description: "Group dance competition. Any style. 5-8 minute performance.", terms: ["Props allowed", "Music track to be submitted 24h before", "Decent costumes only"], teamSize: 6, fee: 300, maxTeams: 20 },
  { id: 8, title: "Paper Presentation", category: "college", date: "2026-04-01", time: "10:00 AM", venue: "Seminar Hall A", description: "Present your research paper. Top 3 get published in college journal.", terms: ["Abstract submission mandatory", "10-min presentation + 5-min Q&A", "Formal dress code"], teamSize: 2, fee: 0, maxTeams: 40 },
  { id: 9, title: "Photography Walk", category: "college", date: "2026-04-02", time: "6:30 AM", venue: "Campus Main Gate", description: "Campus photography walk. Best shots win prizes.", terms: ["Any camera/phone allowed", "Submit 5 best photos", "No heavy editing"], teamSize: 1, fee: 0, maxTeams: 100 },
  { id: 10, title: "Startup Pitch", category: "college", date: "2026-04-04", time: "2:00 PM", venue: "Conference Hall", description: "Pitch your startup idea to investors. Top 3 get incubation support.", terms: ["5-minute pitch + 3-min Q&A", "Business plan optional", "Working prototype preferred"], teamSize: 3, fee: 200, maxTeams: 30 },
  { id: 11, title: "Table Tennis", category: "hostel", date: "2026-04-04", time: "4:00 PM", venue: "Sports Complex", description: "Singles table tennis tournament. Best of 3 sets.", terms: ["Own paddle recommended", "Sports shoes required"], teamSize: 1, fee: 0, maxTeams: 48 },
  { id: 12, title: "Coding Contest", category: "college", date: "2026-04-03", time: "11:00 AM", venue: "Computer Lab 3", description: "Individual competitive programming contest. 3hr, 8 problems.", terms: ["No internet during contest", "Any language allowed", "No plagiarism"], teamSize: 1, fee: 0, maxTeams: 100 },
];

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<EventCategory>("college");
  const [flow, setFlow] = useState<FlowState>("browse");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [teamName, setTeamName] = useState("");
  const [memberRegs, setMemberRegs] = useState<string[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regError, setRegError] = useState("");

  if (!user) return null;

  const filteredEvents = eventsData.filter(e => e.category === category);

  const openEvent = (ev: EventItem) => {
    setSelectedEvent(ev);
    setFlow("details");
    setRegError("");
    setTeamName("");
    setMemberRegs(ev.teamSize > 1 ? Array(ev.teamSize - 1).fill("") : []);
  };

  const alreadyRegistered = (eventId: number) => registrations.some(r => r.eventId === eventId);

  const handleRegister = () => {
    if (!selectedEvent) return;
    if (selectedEvent.teamSize > 1) {
      if (!teamName.trim()) { setRegError("Team name is required."); return; }
      const filledMembers = memberRegs.filter(r => r.trim());
      if (filledMembers.length !== selectedEvent.teamSize - 1) {
        setRegError(`You need exactly ${selectedEvent.teamSize - 1} teammates.`);
        return;
      }
      const allMembers = [user.regNo, ...filledMembers];
      if (new Set(allMembers).size !== allMembers.length) {
        setRegError("Duplicate registration numbers found.");
        return;
      }
    }
    if (selectedEvent.fee > 0) {
      setFlow("payment");
    } else {
      completeRegistration();
    }
  };

  const completeRegistration = (method?: string) => {
    if (!selectedEvent) return;
    const reg: Registration = {
      eventId: selectedEvent.id,
      teamName: selectedEvent.teamSize > 1 ? teamName : user.name,
      members: selectedEvent.teamSize > 1 ? [user.regNo, ...memberRegs.filter(r => r.trim())] : [user.regNo],
      paymentMethod: method,
    };
    setRegistrations(prev => [...prev, reg]);
    setFlow("confirmed");
  };

  const getEventById = (id: number) => eventsData.find(e => e.id === id);

  return (
    <div className="min-h-screen bg-background dark">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => {
            if (flow !== "browse" && flow !== "myEvents") { setFlow("browse"); setSelectedEvent(null); }
            else navigate("/dashboard");
          }} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Event Registration</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        {flow === "browse" && (
          <div className="animate-fade-in">
            <div className="flex gap-2 mb-6 flex-wrap">
              {([
                { id: "college" as EventCategory, label: "College Events", icon: <Trophy className="w-4 h-4" /> },
                { id: "hostel" as EventCategory, label: "Hostel Events", icon: <PartyPopper className="w-4 h-4" /> },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setCategory(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${category === tab.id ? "gradient-bg text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button onClick={() => setFlow("myEvents")} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 text-muted-foreground hover:bg-secondary transition-all">
                <Star className="w-4 h-4" /> My Events ({registrations.length})
              </button>
            </div>
            <div className="space-y-3">
              {filteredEvents.map(ev => {
                const isReged = alreadyRegistered(ev.id);
                return (
                  <button key={ev.id} onClick={() => !isReged && openEvent(ev)} className={`w-full glass rounded-xl p-5 text-left hover:bg-secondary/20 transition-all ${isReged ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground">{ev.title}</h3>
                          {isReged && <span className="px-2 py-0.5 rounded-full text-[10px] bg-success/10 text-success font-medium">Registered</span>}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{ev.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.venue}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Team: {ev.teamSize === 1 ? "Solo" : ev.teamSize}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className={`text-sm font-bold ${ev.fee > 0 ? "text-warning" : "text-success"}`}>{ev.fee > 0 ? `₹${ev.fee}` : "FREE"}</div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 ml-auto" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {flow === "details" && selectedEvent && (
          <div className="animate-fade-in space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">{selectedEvent.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" />{selectedEvent.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedEvent.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedEvent.venue}</span>
              </div>
              <p className="text-foreground/80 mb-4">{selectedEvent.description}</p>
              <div className="flex gap-4 mb-4">
                <div className="px-4 py-2 rounded-lg bg-secondary/30 text-center">
                  <div className="text-xs text-muted-foreground">Team Size</div>
                  <div className="font-bold text-foreground">{selectedEvent.teamSize === 1 ? "Solo" : selectedEvent.teamSize}</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-secondary/30 text-center">
                  <div className="text-xs text-muted-foreground">Entry Fee</div>
                  <div className={`font-bold ${selectedEvent.fee > 0 ? "text-warning" : "text-success"}`}>{selectedEvent.fee > 0 ? `₹${selectedEvent.fee}` : "FREE"}</div>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Terms & Conditions</h4>
              <ul className="space-y-1 mb-6">
                {selectedEvent.terms.map((t, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span> {t}</li>
                ))}
              </ul>
              <button onClick={() => setFlow("register")} className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">Register Now</button>
            </div>
          </div>
        )}

        {flow === "register" && selectedEvent && (
          <div className="animate-fade-in space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Register for {selectedEvent.title}
              </h3>
              <div className="p-3 rounded-lg bg-secondary/30 mb-4">
                <div className="text-xs text-muted-foreground">Team Leader (You)</div>
                <div className="font-medium text-foreground">{user.name} — {user.regNo}</div>
              </div>
              {selectedEvent.teamSize > 1 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Team Name *</label>
                    <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Enter your team name" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Team Members ({selectedEvent.teamSize - 1} required)</label>
                  <div className="space-y-2 mb-4">
                    {memberRegs.map((reg, i) => (
                      <input key={i} value={reg} onChange={e => { const copy = [...memberRegs]; copy[i] = e.target.value; setMemberRegs(copy); }} placeholder={`Member ${i + 2} registration number`} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                    ))}
                  </div>
                </>
              )}
              {regError && <p className="text-sm text-destructive mb-3">{regError}</p>}
              <button onClick={handleRegister} className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">
                {selectedEvent.fee > 0 ? "Proceed to Payment" : "Complete Registration"}
              </button>
            </div>
          </div>
        )}

        {flow === "payment" && selectedEvent && (
          <div className="animate-fade-in">
            <div className="glass rounded-xl p-6">
              <PaymentGateway
                amount={selectedEvent.fee}
                title={`Pay for ${selectedEvent.title}`}
                onSuccess={(method) => completeRegistration(method)}
                onBack={() => setFlow("register")}
                isCashAllowed={false}
              />
            </div>
          </div>
        )}

        {flow === "confirmed" && selectedEvent && (
          <div className="animate-fade-in text-center">
            <div className="glass rounded-xl p-8">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">You're Registered!</h2>
              <p className="text-muted-foreground mb-4">{selectedEvent.title}</p>
              {selectedEvent.teamSize > 1 && (
                <div className="p-3 rounded-lg bg-secondary/30 inline-block mb-4">
                  <span className="text-xs text-muted-foreground">Team: </span>
                  <span className="font-bold text-foreground">{teamName}</span>
                </div>
              )}
              <button onClick={() => { setFlow("browse"); setSelectedEvent(null); }} className="px-6 py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">Back to Events</button>
            </div>
          </div>
        )}

        {flow === "myEvents" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">My Registered Events</h2>
              <button onClick={() => setFlow("browse")} className="text-sm text-primary hover:underline">Browse Events</button>
            </div>
            {registrations.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No events registered yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg, i) => {
                  const ev = getEventById(reg.eventId);
                  if (!ev) return null;
                  return (
                    <div key={i} className="glass rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-semibold text-foreground">{ev.title}</h4>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                            <span>{ev.date} • {ev.time}</span>
                            <span>{ev.venue}</span>
                          </div>
                          {ev.teamSize > 1 && (
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Team: </span>
                              <span className="font-medium text-foreground">{reg.teamName}</span>
                              <span className="text-muted-foreground ml-2">({reg.members.length} members)</span>
                            </div>
                          )}
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Registered</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
