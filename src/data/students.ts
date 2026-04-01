export type StudentRole = "Hosteller" | "Day Scholar";

export interface Student {
  regNo: string;
  password: string;
  phone: string;
  email: string | null;
  role: StudentRole;
  name: string;
  department: string;
  year: number;
  block?: string;
  roomNo?: string;
}

const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AIDS", "AIML", "CSE-DS", "BioTech"];
const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const students: Student[] = [
  // Pre-defined users
  { regNo: "24121632", password: "@Powerstar45", phone: "7981799840", email: "kingkong95969@gmail.com", role: "Hosteller", name: "Sai Krishna", department: "CSE", year: 2, block: "D", roomNo: "D-312" },
  { regNo: "24121561", password: "@vk100cent", phone: "9347708339", email: null, role: "Day Scholar", name: "Vivaan Patel", department: "ECE", year: 2 },

  // 24121562 - 24121610 (49 unique students)
  { regNo: "24121562", password: "@Tiger562", phone: "9876234501", email: "aditya.kumar@university.edu", role: "Hosteller", name: "Aditya Kumar", department: "CSE", year: 2, block: "A", roomNo: "A-101" },
  { regNo: "24121563", password: "@Lion563", phone: "8765432109", email: null, role: "Day Scholar", name: "Priya Sharma", department: "ECE", year: 1 },
  { regNo: "24121564", password: "@Bear564", phone: "7654321098", email: "vihaan.reddy@university.edu", role: "Hosteller", name: "Vihaan Reddy", department: "EEE", year: 3, block: "B", roomNo: "B-205" },
  { regNo: "24121565", password: "@Wolf565", phone: "9543210987", email: null, role: "Hosteller", name: "Ananya Nair", department: "MECH", year: 2, block: "C", roomNo: "C-118" },
  { regNo: "24121566", password: "@Eagle566", phone: "8432109876", email: "arjun.gupta@university.edu", role: "Day Scholar", name: "Arjun Gupta", department: "CIVIL", year: 4 },
  { regNo: "24121567", password: "@Hawk567", phone: "7321098765", email: null, role: "Hosteller", name: "Diya Joshi", department: "IT", year: 1, block: "D", roomNo: "D-310" },
  { regNo: "24121568", password: "@Fox568", phone: "9210987654", email: "ishaan.iyer@university.edu", role: "Hosteller", name: "Ishaan Iyer", department: "AIDS", year: 2, block: "E", roomNo: "E-222" },
  { regNo: "24121569", password: "@Deer569", phone: "8109876543", email: null, role: "Day Scholar", name: "Myra Mehta", department: "AIML", year: 3 },
  { regNo: "24121570", password: "@Puma570", phone: "7098765432", email: "rohan.shah@university.edu", role: "Hosteller", name: "Rohan Shah", department: "CSE-DS", year: 2, block: "F", roomNo: "F-315" },
  { regNo: "24121571", password: "@Lynx571", phone: "9087654321", email: null, role: "Hosteller", name: "Saanvi Verma", department: "BioTech", year: 1, block: "G", roomNo: "G-110" },
  { regNo: "24121572", password: "@Crow572", phone: "8976543210", email: "karan.rao@university.edu", role: "Day Scholar", name: "Karan Rao", department: "CSE", year: 3 },
  { regNo: "24121573", password: "@Dove573", phone: "7865432109", email: null, role: "Hosteller", name: "Riya Das", department: "ECE", year: 2, block: "H", roomNo: "H-420" },
  { regNo: "24121574", password: "@Swan574", phone: "9754321098", email: "nikhil.pillai@university.edu", role: "Hosteller", name: "Nikhil Pillai", department: "EEE", year: 4, block: "A", roomNo: "A-230" },
  { regNo: "24121575", password: "@Raven575", phone: "8643210987", email: null, role: "Day Scholar", name: "Kavya Chopra", department: "MECH", year: 1 },
  { regNo: "24121576", password: "@Falcon576", phone: "7532109876", email: "rahul.malhotra@university.edu", role: "Hosteller", name: "Rahul Malhotra", department: "CIVIL", year: 2, block: "B", roomNo: "B-340" },
  { regNo: "24121577", password: "@Owl577", phone: "9421098765", email: null, role: "Hosteller", name: "Sneha Bhat", department: "IT", year: 3, block: "C", roomNo: "C-215" },
  { regNo: "24121578", password: "@Colt578", phone: "8310987654", email: "amit.menon@university.edu", role: "Day Scholar", name: "Amit Menon", department: "AIDS", year: 2 },
  { regNo: "24121579", password: "@Viper579", phone: "7209876543", email: null, role: "Hosteller", name: "Tanvi Chatterjee", department: "AIML", year: 1, block: "D", roomNo: "D-115" },
  { regNo: "24121580", password: "@Cobra580", phone: "9198765432", email: "vikram.sharma@university.edu", role: "Hosteller", name: "Vikram Singh", department: "CSE-DS", year: 4, block: "E", roomNo: "E-440" },
  { regNo: "24121581", password: "@Bolt581", phone: "8087654321", email: null, role: "Day Scholar", name: "Meera Patel", department: "BioTech", year: 2 },
  { regNo: "24121582", password: "@Flash582", phone: "7976543210", email: "ajay.kumar@university.edu", role: "Hosteller", name: "Ajay Reddy", department: "CSE", year: 3, block: "F", roomNo: "F-125" },
  { regNo: "24121583", password: "@Storm583", phone: "9865432109", email: null, role: "Hosteller", name: "Gauri Nair", department: "ECE", year: 1, block: "G", roomNo: "G-305" },
  { regNo: "24121584", password: "@Blaze584", phone: "8754321098", email: "suresh.gupta@university.edu", role: "Day Scholar", name: "Suresh Gupta", department: "EEE", year: 2 },
  { regNo: "24121585", password: "@Frost585", phone: "7643210987", email: null, role: "Hosteller", name: "Simran Joshi", department: "MECH", year: 3, block: "H", roomNo: "H-210" },
  { regNo: "24121586", password: "@Spark586", phone: "9532109876", email: "manish.iyer@university.edu", role: "Hosteller", name: "Manish Iyer", department: "CIVIL", year: 2, block: "A", roomNo: "A-335" },
  { regNo: "24121587", password: "@Blitz587", phone: "8421098765", email: null, role: "Day Scholar", name: "Lakshmi Mehta", department: "IT", year: 4 },
  { regNo: "24121588", password: "@Surge588", phone: "7310987654", email: "rajesh.shah@university.edu", role: "Hosteller", name: "Rajesh Shah", department: "AIDS", year: 1, block: "B", roomNo: "B-120" },
  { regNo: "24121589", password: "@Drift589", phone: "9209876543", email: null, role: "Hosteller", name: "Pooja Verma", department: "AIML", year: 2, block: "C", roomNo: "C-440" },
  { regNo: "24121590", password: "@Rapid590", phone: "8198765432", email: "divya.rao@university.edu", role: "Day Scholar", name: "Divya Rao", department: "CSE-DS", year: 3 },
  { regNo: "24121591", password: "@Turbo591", phone: "7087654321", email: null, role: "Hosteller", name: "Aarav Das", department: "BioTech", year: 2, block: "D", roomNo: "D-225" },
  { regNo: "24121592", password: "@Nitro592", phone: "9976543210", email: "neha.pillai@university.edu", role: "Hosteller", name: "Neha Pillai", department: "CSE", year: 1, block: "E", roomNo: "E-130" },
  { regNo: "24121593", password: "@Sonic593", phone: "8865432109", email: null, role: "Day Scholar", name: "Dhruv Chopra", department: "ECE", year: 4 },
  { regNo: "24121594", password: "@Titan594", phone: "7754321098", email: "shreya.malhotra@university.edu", role: "Hosteller", name: "Shreya Malhotra", department: "EEE", year: 2, block: "F", roomNo: "F-240" },
  { regNo: "24121595", password: "@Omega595", phone: "9643210987", email: null, role: "Hosteller", name: "Kabir Bhat", department: "MECH", year: 3, block: "G", roomNo: "G-415" },
  { regNo: "24121596", password: "@Alpha596", phone: "8532109876", email: "anvi.menon@university.edu", role: "Day Scholar", name: "Anvi Menon", department: "CIVIL", year: 1 },
  { regNo: "24121597", password: "@Beta597", phone: "7421098765", email: null, role: "Hosteller", name: "Atharv Chatterjee", department: "IT", year: 2, block: "H", roomNo: "H-320" },
  { regNo: "24121598", password: "@Delta598", phone: "9310987654", email: "navya.sharma@university.edu", role: "Hosteller", name: "Navya Sharma", department: "AIDS", year: 4, block: "A", roomNo: "A-445" },
  { regNo: "24121599", password: "@Gamma599", phone: "8209876543", email: null, role: "Day Scholar", name: "Ritvik Patel", department: "AIML", year: 2 },
  { regNo: "24121600", password: "@Sigma600", phone: "7198765432", email: "kiara.reddy@university.edu", role: "Hosteller", name: "Kiara Reddy", department: "CSE-DS", year: 3, block: "B", roomNo: "B-250" },
  { regNo: "24121601", password: "@Zeta601", phone: "9087654320", email: null, role: "Hosteller", name: "Reyansh Nair", department: "BioTech", year: 1, block: "C", roomNo: "C-110" },
  { regNo: "24121602", password: "@Kappa602", phone: "8976543201", email: "ira.gupta@university.edu", role: "Day Scholar", name: "Ira Gupta", department: "CSE", year: 2 },
  { regNo: "24121603", password: "@Lambda603", phone: "7865432100", email: null, role: "Hosteller", name: "Shivansh Joshi", department: "ECE", year: 3, block: "D", roomNo: "D-430" },
  { regNo: "24121604", password: "@Mu604", phone: "9754321087", email: "prisha.iyer@university.edu", role: "Hosteller", name: "Prisha Iyer", department: "EEE", year: 2, block: "E", roomNo: "E-335" },
  { regNo: "24121605", password: "@Nu605", phone: "8643210976", email: null, role: "Day Scholar", name: "Ayaan Mehta", department: "MECH", year: 4 },
  { regNo: "24121606", password: "@Theta606", phone: "7532109865", email: "aanya.shah@university.edu", role: "Hosteller", name: "Aanya Shah", department: "CIVIL", year: 1, block: "F", roomNo: "F-115" },
  { regNo: "24121607", password: "@Iota607", phone: "9421098754", email: null, role: "Hosteller", name: "Krishna Verma", department: "IT", year: 2, block: "G", roomNo: "G-225" },
  { regNo: "24121608", password: "@Phi608", phone: "8310987643", email: "sara.rao@university.edu", role: "Day Scholar", name: "Sara Rao", department: "AIDS", year: 3 },
  { regNo: "24121609", password: "@Chi609", phone: "7209876532", email: null, role: "Hosteller", name: "Vivaan Das", department: "AIML", year: 2, block: "H", roomNo: "H-140" },
  { regNo: "24121610", password: "@Psi610", phone: "9198765421", email: "aadhya.pillai@university.edu", role: "Hosteller", name: "Aadhya Pillai", department: "CSE-DS", year: 1, block: "A", roomNo: "A-105" },
];
