import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Search, Download, FileText, ChevronRight, X, ExternalLink, ClipboardList,
} from "lucide-react";

interface ReferenceMaterial {
  id: number; title: string; author: string; pages: number; year: number;
}

interface CourseLibrary {
  code: string; name: string; department: string; semester: number; materials: ReferenceMaterial[];
}

interface PYQPaper {
  id: number; title: string; year: number; exam: string;
}

// Generate library data
function generateLibraryData(): CourseLibrary[] {
  const courseDefs: { code: string; name: string; dept: string; sem: number }[] = [
    { code: "CSE1001", name: "Problem Solving & Programming", dept: "CSE", sem: 1 },
    { code: "CSE1002", name: "Digital Logic Design", dept: "CSE", sem: 1 },
    { code: "CSE2001", name: "Data Structures & Algorithms", dept: "CSE", sem: 3 },
    { code: "CSE2002", name: "Operating Systems", dept: "CSE", sem: 3 },
    { code: "CSE2003", name: "Database Management Systems", dept: "CSE", sem: 4 },
    { code: "CSE2004", name: "Computer Networks", dept: "CSE", sem: 4 },
    { code: "CSE2005", name: "Theory of Computation", dept: "CSE", sem: 4 },
    { code: "CSE3001", name: "Compiler Design", dept: "CSE", sem: 5 },
    { code: "CSE3002", name: "Artificial Intelligence", dept: "CSE", sem: 5 },
    { code: "CSE3003", name: "Machine Learning", dept: "CSE", sem: 5 },
    { code: "CSE3004", name: "Software Engineering", dept: "CSE", sem: 6 },
    { code: "CSE3005", name: "Web Technologies", dept: "CSE", sem: 6 },
    { code: "CSE3006", name: "Cloud Computing", dept: "CSE", sem: 6 },
    { code: "CSE3007", name: "Computer Architecture", dept: "CSE", sem: 5 },
    { code: "CSE3008", name: "Cryptography & Network Security", dept: "CSE", sem: 7 },
    { code: "CSE4001", name: "Deep Learning", dept: "CSE", sem: 7 },
    { code: "CSE4002", name: "Natural Language Processing", dept: "CSE", sem: 7 },
    { code: "CSE4003", name: "Computer Vision", dept: "CSE", sem: 7 },
    { code: "CSE4004", name: "Big Data Analytics", dept: "CSE", sem: 8 },
    { code: "CSE4005", name: "Internet of Things", dept: "CSE", sem: 8 },
    { code: "ECE1001", name: "Basic Electrical Engineering", dept: "ECE", sem: 1 },
    { code: "ECE1002", name: "Electronic Devices & Circuits", dept: "ECE", sem: 2 },
    { code: "ECE2001", name: "Signals & Systems", dept: "ECE", sem: 3 },
    { code: "ECE2002", name: "Analog Communication", dept: "ECE", sem: 3 },
    { code: "ECE2003", name: "Digital Signal Processing", dept: "ECE", sem: 4 },
    { code: "ECE2004", name: "Microprocessors & Microcontrollers", dept: "ECE", sem: 4 },
    { code: "ECE3001", name: "VLSI Design", dept: "ECE", sem: 5 },
    { code: "ECE3002", name: "Embedded Systems", dept: "ECE", sem: 5 },
    { code: "ECE3003", name: "Wireless Communication", dept: "ECE", sem: 6 },
    { code: "ECE3004", name: "Antenna & Wave Propagation", dept: "ECE", sem: 6 },
    { code: "EEE1001", name: "Circuit Theory", dept: "EEE", sem: 1 },
    { code: "EEE2001", name: "Power Systems", dept: "EEE", sem: 3 },
    { code: "EEE2002", name: "Control Systems", dept: "EEE", sem: 4 },
    { code: "EEE3001", name: "Power Electronics", dept: "EEE", sem: 5 },
    { code: "EEE3002", name: "Electrical Machines", dept: "EEE", sem: 5 },
    { code: "MECH1001", name: "Engineering Mechanics", dept: "MECH", sem: 1 },
    { code: "MECH1002", name: "Engineering Drawing", dept: "MECH", sem: 1 },
    { code: "MECH2001", name: "Thermodynamics", dept: "MECH", sem: 3 },
    { code: "MECH2002", name: "Fluid Mechanics", dept: "MECH", sem: 3 },
    { code: "MECH2003", name: "Strength of Materials", dept: "MECH", sem: 4 },
    { code: "MECH3001", name: "Heat Transfer", dept: "MECH", sem: 5 },
    { code: "MECH3002", name: "Manufacturing Processes", dept: "MECH", sem: 5 },
    { code: "MECH3003", name: "Machine Design", dept: "MECH", sem: 6 },
    { code: "MECH3004", name: "Robotics", dept: "MECH", sem: 7 },
    { code: "MECH3005", name: "Automobile Engineering", dept: "MECH", sem: 7 },
    { code: "CIVIL1001", name: "Surveying", dept: "CIVIL", sem: 2 },
    { code: "CIVIL2001", name: "Structural Analysis", dept: "CIVIL", sem: 3 },
    { code: "CIVIL2002", name: "Geotechnical Engineering", dept: "CIVIL", sem: 4 },
    { code: "CIVIL3001", name: "Transportation Engineering", dept: "CIVIL", sem: 5 },
    { code: "CIVIL3002", name: "Environmental Engineering", dept: "CIVIL", sem: 5 },
    { code: "IT1001", name: "Introduction to IT", dept: "IT", sem: 1 },
    { code: "IT2001", name: "Object Oriented Programming", dept: "IT", sem: 3 },
    { code: "IT2002", name: "Data Mining", dept: "IT", sem: 4 },
    { code: "IT3001", name: "Information Security", dept: "IT", sem: 5 },
    { code: "IT3002", name: "Mobile App Development", dept: "IT", sem: 6 },
    { code: "MAT1001", name: "Engineering Mathematics I", dept: "MATH", sem: 1 },
    { code: "MAT1002", name: "Engineering Mathematics II", dept: "MATH", sem: 2 },
    { code: "MAT2001", name: "Linear Algebra & Transforms", dept: "MATH", sem: 3 },
    { code: "MAT2002", name: "Probability & Statistics", dept: "MATH", sem: 3 },
    { code: "MAT3001", name: "Numerical Methods", dept: "MATH", sem: 4 },
    { code: "PHY1001", name: "Engineering Physics", dept: "PHYSICS", sem: 1 },
    { code: "CHE1001", name: "Engineering Chemistry", dept: "CHEM", sem: 1 },
    { code: "HUM1001", name: "Professional Ethics", dept: "HUM", sem: 3 },
    { code: "HUM1002", name: "Technical English", dept: "HUM", sem: 1 },
    { code: "HUM2001", name: "Economics for Engineers", dept: "HUM", sem: 5 },
    { code: "AIDS2001", name: "Data Science Foundations", dept: "AIDS", sem: 3 },
    { code: "AIDS2002", name: "Statistical Learning", dept: "AIDS", sem: 4 },
    { code: "AIDS3001", name: "Reinforcement Learning", dept: "AIDS", sem: 6 },
    { code: "AIML2001", name: "Pattern Recognition", dept: "AIML", sem: 4 },
    { code: "AIML3001", name: "Neural Networks", dept: "AIML", sem: 5 },
    { code: "BIO1001", name: "Biology for Engineers", dept: "BioTech", sem: 1 },
    { code: "BIO2001", name: "Biochemistry", dept: "BioTech", sem: 3 },
    { code: "BIO2002", name: "Genetic Engineering", dept: "BioTech", sem: 4 },
    { code: "BIO3001", name: "Bioprocess Engineering", dept: "BioTech", sem: 5 },
    { code: "CSEDS2001", name: "Data Engineering", dept: "CSE-DS", sem: 4 },
  ];

  const bookAdjectives = ["Fundamentals of", "Introduction to", "Advanced", "Modern", "Principles of", "Concepts in", "Applied", "Essential", "Comprehensive", "Practical"];
  const bookSuffixes = ["- A Practical Approach", "for Engineers", "with Applications", "- Theory & Practice", "- Concepts & Techniques", "Handbook", "Made Easy", "- Complete Guide", ": Problems & Solutions", "- Reference Manual"];
  const authors = ["R.K. Jain", "S. Kalavathi", "P.C. Sharma", "A. Tanenbaum", "T. Cormen", "B. Forouzan", "K. Rosen", "R. Gallager", "D. Harel", "M. Sipser", "S. Haykin", "R. Gonzalez", "C. Bishop", "I. Goodfellow", "S. Russell", "P. Norvig", "J. Han", "M. Sahni", "E. Balagurusamy", "Y. Kanetkar", "R.S. Pressman", "G. Booch", "A. Silberschatz", "W. Stallings", "D. Patterson", "J. Hennessy"];

  return courseDefs.map(cd => {
    const numMaterials = 20 + Math.floor(Math.random() * 6);
    const materials: ReferenceMaterial[] = [];
    for (let i = 0; i < numMaterials; i++) {
      const adj = bookAdjectives[i % bookAdjectives.length];
      const suf = bookSuffixes[i % bookSuffixes.length];
      const baseTitle = i < 5 ? `${adj} ${cd.name}` : i < 10 ? `${cd.name} ${suf}` : `${adj} ${cd.name.split(" ").slice(0, 2).join(" ")} ${suf}`;
      materials.push({ id: i + 1, title: baseTitle, author: authors[(i + cd.code.charCodeAt(3)) % authors.length], pages: 150 + Math.floor(Math.random() * 600), year: 2018 + Math.floor(Math.random() * 8) });
    }
    return { code: cd.code, name: cd.name, department: cd.dept, semester: cd.sem, materials };
  });
}

// Generate PYQ data
function generatePYQData(): Record<string, PYQPaper[]> {
  const courseCodes = ["CSE1001", "CSE1002", "CSE2001", "CSE2002", "CSE2003", "CSE2004", "CSE2005", "CSE3001", "CSE3002", "CSE3003",
    "ECE1001", "ECE1002", "ECE2001", "ECE2002", "ECE2003", "EEE1001", "EEE2001", "EEE2002",
    "MECH1001", "MECH1002", "MECH2001", "MECH2002", "MECH2003",
    "MAT1001", "MAT1002", "MAT2001", "MAT2002", "MAT3001", "PHY1001", "CHE1001",
    "HUM1001", "HUM1002", "IT1001", "IT2001", "IT2002",
    "AIDS2001", "AIML2001", "BIO1001", "BIO2001", "CSEDS2001",
    "CIVIL1001", "CIVIL2001", "CIVIL2002"];

  const result: Record<string, PYQPaper[]> = {};
  const exams = ["Midterm 1", "Midterm 2", "Final"];

  courseCodes.forEach(code => {
    const papers: PYQPaper[] = [];
    let id = 1;
    for (let year = 2022; year <= 2025; year++) {
      for (const exam of exams) {
        papers.push({ id: id++, title: `${code} ${exam} ${year}`, year, exam });
      }
    }
    result[code] = papers;
  });
  return result;
}

const libraryData = generateLibraryData();
const pyqData = generatePYQData();
const pyqCourses = Object.keys(pyqData).map(code => {
  const lib = libraryData.find(c => c.code === code);
  return { code, name: lib?.name || code };
});

type LibrarySection = "references" | "pyq";
type PYQView = "courses" | "exams" | "papers";

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<LibrarySection>("references");

  // Reference states
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseLibrary | null>(null);
  const [bookSearch, setBookSearch] = useState("");
  const [viewingBook, setViewingBook] = useState<ReferenceMaterial | null>(null);

  // PYQ states
  const [pyqSearch, setPyqSearch] = useState("");
  const [pyqSelectedCourse, setPyqSelectedCourse] = useState<string | null>(null);
  const [pyqSelectedExam, setPyqSelectedExam] = useState<string | null>(null);
  const [viewingPaper, setViewingPaper] = useState<PYQPaper | null>(null);

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return libraryData;
    const q = courseSearch.toLowerCase();
    return libraryData.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
  }, [courseSearch]);

  const filteredBooks = useMemo(() => {
    if (!selectedCourse) return [];
    if (!bookSearch.trim()) return selectedCourse.materials;
    const q = bookSearch.toLowerCase();
    return selectedCourse.materials.filter(m => m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q));
  }, [selectedCourse, bookSearch]);

  const filteredPyqCourses = useMemo(() => {
    if (!pyqSearch.trim()) return pyqCourses;
    const q = pyqSearch.toLowerCase();
    return pyqCourses.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [pyqSearch]);

  const handleDownload = (title: string) => {
    const blob = new Blob([`Simulated PDF: ${title}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (section === "references") {
      if (viewingBook) setViewingBook(null);
      else if (selectedCourse) { setSelectedCourse(null); setBookSearch(""); }
      else navigate("/dashboard");
    } else {
      if (viewingPaper) setViewingPaper(null);
      else if (pyqSelectedExam) setPyqSelectedExam(null);
      else if (pyqSelectedCourse) { setPyqSelectedCourse(null); setPyqSearch(""); }
      else navigate("/dashboard");
    }
  };

  const pyqPapers = pyqSelectedCourse && pyqSelectedExam
    ? (pyqData[pyqSelectedCourse] || []).filter(p => p.exam === pyqSelectedExam)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={handleBack} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Library</h1>
              {selectedCourse && section === "references" && <p className="text-xs text-muted-foreground">{selectedCourse.code} — {selectedCourse.name}</p>}
              {pyqSelectedCourse && section === "pyq" && <p className="text-xs text-muted-foreground">{pyqSelectedCourse} — PYQ</p>}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSection("references")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${section === "references" ? "gradient-bg text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
            <BookOpen className="w-4 h-4" /> References
          </button>
          <button onClick={() => setSection("pyq")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${section === "pyq" ? "gradient-bg text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
            <ClipboardList className="w-4 h-4" /> Previous Year Questions
          </button>
        </div>

        {/* References Section */}
        {section === "references" && (
          <>
            {!selectedCourse && (
              <div className="animate-fade-in">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input value={courseSearch} onChange={e => setCourseSearch(e.target.value)} placeholder="Search courses by name, code, or department..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                  {courseSearch && <button onClick={() => setCourseSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{filteredCourses.length} courses available</p>
                <div className="space-y-2">
                  {filteredCourses.map(c => (
                    <button key={c.code} onClick={() => setSelectedCourse(c)}
                      className="w-full glass rounded-xl p-4 flex items-center justify-between text-left hover:bg-secondary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                        <div>
                          <div className="font-medium text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.code} • {c.department} • Sem {c.semester} • {c.materials.length} books</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse && !viewingBook && (
              <div className="animate-fade-in">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input value={bookSearch} onChange={e => setBookSearch(e.target.value)} placeholder="Search books by title or author..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                  {bookSearch && <button onClick={() => setBookSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
                {filteredBooks.length === 0 ? (
                  <div className="glass rounded-xl p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">Book not available</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search term.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">{filteredBooks.length} reference materials</p>
                    <div className="space-y-2">
                      {filteredBooks.map(book => (
                        <div key={book.id} className="glass rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"><BookOpen className="w-5 h-5 text-accent" /></div>
                            <div className="min-w-0">
                              <div className="font-medium text-foreground text-sm truncate">{book.title}</div>
                              <div className="text-xs text-muted-foreground">{book.author} • {book.pages} pages • {book.year}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <button onClick={() => setViewingBook(book)} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="View"><ExternalLink className="w-4 h-4" /></button>
                            <button onClick={() => handleDownload(book.title)} className="p-2 rounded-lg bg-success/10 hover:bg-success/20 text-success transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {viewingBook && (
              <div className="animate-fade-in">
                <div className="glass rounded-xl p-6 mb-4">
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{viewingBook.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span>Author: {viewingBook.author}</span><span>{viewingBook.pages} pages</span><span>Published: {viewingBook.year}</span>
                  </div>
                  <button onClick={() => handleDownload(viewingBook.title)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-primary-foreground font-medium text-sm">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
                <div className="glass rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{viewingBook.title}</h3>
                  <p className="text-muted-foreground text-sm mb-1">by {viewingBook.author}</p>
                  <p className="text-muted-foreground text-xs mb-6">{viewingBook.pages} pages • {viewingBook.year} Edition</p>
                  <div className="w-full max-w-md space-y-3">
                    {Array(8).fill(0).map((_, i) => <div key={i} className={`h-3 rounded bg-secondary/50 ${["w-full","w-11/12","w-full","w-9/12","w-full","w-10/12","w-full","w-8/12"][i]}`} />)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-6">This is a simulated preview. Click download for the full PDF.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* PYQ Section */}
        {section === "pyq" && (
          <>
            {!pyqSelectedCourse && (
              <div className="animate-fade-in">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input value={pyqSearch} onChange={e => setPyqSearch(e.target.value)} placeholder="Search subject..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground" />
                  {pyqSearch && <button onClick={() => setPyqSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{filteredPyqCourses.length} subjects</p>
                <div className="space-y-2">
                  {filteredPyqCourses.map(c => (
                    <button key={c.code} onClick={() => setPyqSelectedCourse(c.code)}
                      className="w-full glass rounded-xl p-4 flex items-center justify-between text-left hover:bg-secondary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0"><ClipboardList className="w-5 h-5 text-warning" /></div>
                        <div>
                          <div className="font-medium text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.code}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pyqSelectedCourse && !pyqSelectedExam && (
              <div className="animate-fade-in">
                <h3 className="font-display font-semibold text-foreground mb-4">{pyqSelectedCourse} — Select Exam</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Midterm 1", "Midterm 2", "Final"].map(exam => {
                    const count = (pyqData[pyqSelectedCourse] || []).filter(p => p.exam === exam).length;
                    return (
                      <button key={exam} onClick={() => setPyqSelectedExam(exam)}
                        className="glass rounded-xl p-6 text-center hover:bg-secondary/20 transition-all group">
                        <ClipboardList className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <div className="font-display font-semibold text-foreground">{exam}</div>
                        <div className="text-xs text-muted-foreground mt-1">{count} papers available</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {pyqSelectedExam && !viewingPaper && (
              <div className="animate-fade-in">
                <h3 className="font-display font-semibold text-foreground mb-4">{pyqSelectedCourse} — {pyqSelectedExam}</h3>
                <div className="space-y-2">
                  {pyqPapers.map(paper => (
                    <div key={paper.id} className="glass rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><FileText className="w-5 h-5 text-warning" /></div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{paper.title}</div>
                          <div className="text-xs text-muted-foreground">{paper.year} • {paper.exam}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingPaper(paper)} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"><ExternalLink className="w-4 h-4" /></button>
                        <button onClick={() => handleDownload(paper.title)} className="p-2 rounded-lg bg-success/10 hover:bg-success/20 text-success transition-colors"><Download className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingPaper && (
              <div className="animate-fade-in">
                <div className="glass rounded-xl p-6 mb-4">
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{viewingPaper.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span>Year: {viewingPaper.year}</span><span>Exam: {viewingPaper.exam}</span>
                  </div>
                  <button onClick={() => handleDownload(viewingPaper.title)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-primary-foreground font-medium text-sm">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
                <div className="glass rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{viewingPaper.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">Previous Year Question Paper</p>
                  <div className="w-full max-w-md space-y-3">
                    {Array(10).fill(0).map((_, i) => <div key={i} className={`h-3 rounded bg-secondary/50 ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-10/12" : "w-8/12"}`} />)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-6">Simulated preview — download for full paper.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Library;
