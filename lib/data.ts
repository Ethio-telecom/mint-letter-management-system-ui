// Mock data for the UI. Replace with API calls when the backend is wired up.
// Every tenant (see lib/tenant.tsx) gets its own seed: letters, users, counterpart organizations
// and dashboard figures. Read it with `getTenantData(tenantId)` or the `useTenantData()` hook.

import type { TenantId } from "@/lib/tenant";

export type OrgStatus = "Active" | "Suspended";

export type Organization = {
  id: string;
  name: string;
  nameAm: string;
  code: string;
  users: number;
  letters: number;
  storage: string;
  status: OrgStatus;
  createdAt: string;
};

/** Every organization on the platform. Each tenant sees the others as its counterparts. */
export const directory: Organization[] = [
  { id: "org-01", name: "Ministry of Innovation and Technology", nameAm: "ኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር", code: "mint", users: 420, letters: 3161, storage: "1.84 GB", status: "Active", createdAt: "Oct 02, 2025" },
  { id: "org-02", name: "Ministry of Peace", nameAm: "የሰላም ሚኒስቴር", code: "mop", users: 90, letters: 4343, storage: "1.23 GB", status: "Active", createdAt: "Oct 14, 2025" },
  { id: "org-15", name: "Ministry of Education", nameAm: "የትምህርት ሚኒስቴር", code: "moe", users: 610, letters: 5120, storage: "2.66 GB", status: "Active", createdAt: "Oct 08, 2025" },
  { id: "org-03", name: "Education and Training Authority", nameAm: "የትምህርት እና ሥልጠና ባለስልጣን", code: "neta", users: 182, letters: 3262, storage: "1.38 GB", status: "Active", createdAt: "Oct 21, 2025" },
  { id: "org-04", name: "Ethiopian Construction and Works Corporation", nameAm: "የኢትዮጵያ ኮንስትራክሽን ሥራዎች ኮርፖሬሽን", code: "ecwc", users: 64, letters: 1938, storage: "3.21 GB", status: "Active", createdAt: "Nov 03, 2025" },
  { id: "org-05", name: "Ministry of Logistics", nameAm: "ሎጂስቲክስ ሚኒስቴር", code: "motl", users: 99, letters: 1020, storage: "520.2 MB", status: "Active", createdAt: "Nov 18, 2025" },
  { id: "org-06", name: "Federal Supreme Court of Ethiopia", nameAm: "የኢትዮጵያ ፌዴራል ጠቅላይ ፍርድ ቤት", code: "fsc", users: 60, letters: 980, storage: "178.5 MB", status: "Active", createdAt: "Dec 01, 2025" },
  { id: "org-07", name: "Ministry of Urban and Infrastructure", nameAm: "የከተማ እና መሰረተ ልማት ሚኒስቴር", code: "mui", users: 442, letters: 876, storage: "264.8 MB", status: "Active", createdAt: "Dec 09, 2025" },
  { id: "org-08", name: "Civil Service Commission", nameAm: "ሲቪል ሰርቪስ ኮሚሽን", code: "csc", users: 258, letters: 794, storage: "278.7 MB", status: "Active", createdAt: "Jan 12, 2026" },
  { id: "org-09", name: "Ethiopian Intellectual Property Authority", nameAm: "የኢትዮጵያ አእምሯዊ ንብረት ባለስልጣን", code: "eipa", users: 26, letters: 267, storage: "12.8 MB", status: "Active", createdAt: "Feb 04, 2026" },
  { id: "org-10", name: "Ethiopian Enterprise Development", nameAm: "የኢትዮጵያ ኢንተርፕራይዝ ልማት", code: "eed", users: 64, letters: 205, storage: "7.77 MB", status: "Suspended", createdAt: "Mar 17, 2026" },
  { id: "org-11", name: "Federal Public Procurement Service", nameAm: "የፌዴራል የመንግሥት ግዥ አገልግሎት", code: "ppa", users: 73, letters: 412, storage: "96.4 MB", status: "Active", createdAt: "Apr 22, 2026" },
  { id: "org-12", name: "Bio and Emerging Technology Institute", nameAm: "የባዮ እና ኢመርጂንግ ቴክኖሎጂ ኢንስቲትዩት", code: "betin", users: 38, letters: 149, storage: "41.2 MB", status: "Active", createdAt: "Jun 08, 2026" },
  { id: "org-13", name: "Ethiopian Investment Holdings", nameAm: "የኢትዮጵያ ኢንቨስትመንት ሆልዲንግስ", code: "eih", users: 51, letters: 318, storage: "88.0 MB", status: "Active", createdAt: "Jul 15, 2026" },
  { id: "org-14", name: "Ethiopian Ministry of Industry", nameAm: "ኢንዱስትሪ ሚኒስቴር", code: "moi", users: 117, letters: 655, storage: "143.9 MB", status: "Suspended", createdAt: "Aug 29, 2026" },
];

export type UserRole = "System Admin" | "Org Admin" | "Records Officer" | "Approver" | "Staff";
export type UserStatus = "Active" | "Invited" | "Disabled";

export type User = {
  id: string;
  name: string;
  email: string;
  organization: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
};

const userSeed: [string, string, string, UserRole, UserStatus, string][] = [
  ["Abebe Mekonnen", "mint", "ICT Directorate", "System Admin", "Active", "2 minutes ago"],
  ["Hanna Tesfaye", "mint", "Records Office", "Records Officer", "Active", "14 minutes ago"],
  ["Dawit Alemu", "mint", "Minister's Office", "Approver", "Active", "1 hour ago"],
  ["Selamawit Girma", "mop", "Administration", "Org Admin", "Active", "3 hours ago"],
  ["Yonas Bekele", "neta", "Quality Assurance", "Staff", "Active", "Yesterday"],
  ["Meron Haile", "csc", "Human Resources", "Org Admin", "Active", "Yesterday"],
  ["Tadesse Worku", "ecwc", "Procurement", "Staff", "Invited", "Never"],
  ["Rahel Assefa", "motl", "Planning", "Approver", "Active", "2 days ago"],
  ["Samuel Getachew", "mui", "Legal Affairs", "Records Officer", "Active", "2 days ago"],
  ["Bethlehem Desta", "eipa", "Patent Office", "Staff", "Disabled", "3 weeks ago"],
  ["Kaleb Tilahun", "fsc", "Registrar", "Org Admin", "Active", "4 days ago"],
  ["Liya Negash", "mint", "Digital Economy", "Staff", "Active", "5 days ago"],
  ["Henok Tsegaye", "ppa", "Finance", "Approver", "Invited", "Never"],
  ["Tigist Mulugeta", "betin", "Research", "Staff", "Active", "1 week ago"],
  ["Nahom Fikru", "eih", "Strategy", "Org Admin", "Active", "1 week ago"],
  ["Saron Kebede", "moi", "Communications", "Records Officer", "Disabled", "2 months ago"],
  ["Elias Wondimu", "mint", "Innovation Research", "Approver", "Active", "6 hours ago"],
  ["Mahlet Yohannes", "neta", "Accreditation", "Records Officer", "Active", "3 days ago"],
];

const mintUsers: User[] = userSeed.map(([name, code, department, role, status, lastActive], i) => {
  const org = directory.find((o) => o.code === code)!;
  return {
    id: `usr-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@${code}.gov.et`,
    organization: org.name,
    department,
    role,
    status,
    lastActive,
  };
});

export type LetterType = "Incoming" | "Outgoing" | "Internal" | "Memo";
export type LetterStatus = "Draft" | "Pending" | "In Review" | "Published" | "Returned" | "Archived";
export type LetterPriority = "Low" | "Medium" | "High" | "Urgent";

export type Letter = {
  id: string;
  reference: string;
  subject: string;
  sender: string;
  recipient: string;
  type: LetterType;
  priority: LetterPriority;
  status: LetterStatus;
  date: string;
  body: string;
};

const letterSeed: [string, string, string, LetterType, LetterPriority, LetterStatus, string][] = [
  ["Request for comments on the Letter Management System rollout", "Civil Service Commission", "Ministry of Innovation and Technology", "Incoming", "High", "Pending", "Nov 14, 2026"],
  ["በዲጂታል የሰነድ አስተዳደር ሥርዓት አተገባበር ላይ የሥልጠና ጥያቄ", "አምራች ኢንዱስትሪ ልማት ኢንስቲትዩት", "ኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር", "Incoming", "Low", "Pending", "Nov 13, 2026"],
  ["Quarterly ICT infrastructure budget approval", "Finance Directorate", "Minister's Office", "Internal", "Urgent", "In Review", "Nov 12, 2026"],
  ["Invitation to the National Digital Economy Forum", "Ministry of Innovation and Technology", "Ministry of Peace", "Outgoing", "Medium", "Published", "Nov 11, 2026"],
  ["Staff training schedule for records officers", "Human Resources", "All Directorates", "Memo", "Low", "Published", "Nov 10, 2026"],
  ["Data centre hosting agreement renewal", "Ministry of Innovation and Technology", "Ethio Telecom", "Outgoing", "High", "Pending", "Nov 09, 2026"],
  ["ስልጠና እንዲሰጠን ይመለከታል", "የፌዴራል ሲቪል ሰርቪስ ኮሚሽን", "ኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር", "Incoming", "Low", "Returned", "Nov 06, 2026"],
  ["Procurement of document scanners for regional offices", "Procurement Directorate", "Finance Directorate", "Internal", "Medium", "In Review", "Nov 05, 2026"],
  ["Response to patent database integration inquiry", "Ministry of Innovation and Technology", "Ethiopian Intellectual Property Authority", "Outgoing", "Medium", "Draft", "Nov 04, 2026"],
  ["Office relocation notice for the 4th floor", "General Services", "All Staff", "Memo", "Low", "Published", "Nov 03, 2026"],
  ["Cybersecurity audit findings and remediation plan", "Information Network Security Administration", "Ministry of Innovation and Technology", "Incoming", "Urgent", "In Review", "Oct 30, 2026"],
  ["Nomination of focal persons for e-government services", "Ministry of Innovation and Technology", "Ministry of Urban and Infrastructure", "Outgoing", "Medium", "Published", "Oct 28, 2026"],
  ["Annual leave carry-over policy update", "Human Resources", "All Directorates", "Memo", "Low", "Archived", "Oct 27, 2026"],
  ["Request for bandwidth upgrade", "Education and Training Authority", "Ministry of Innovation and Technology", "Incoming", "High", "Pending", "Oct 23, 2026"],
  ["Startup proclamation implementation progress report", "Innovation Research Directorate", "Minister's Office", "Internal", "High", "Published", "Oct 21, 2026"],
  ["Memorandum of understanding on logistics data sharing", "Ministry of Logistics", "Ministry of Innovation and Technology", "Incoming", "Medium", "Returned", "Oct 19, 2026"],
  ["Vehicle allocation for field supervision", "General Services", "ICT Directorate", "Internal", "Low", "Draft", "Oct 16, 2026"],
  ["Support letter for the Bio-tech research grant", "Ministry of Innovation and Technology", "Bio and Emerging Technology Institute", "Outgoing", "Medium", "Published", "Oct 14, 2026"],
  ["Holiday working hours announcement", "Minister's Office", "All Staff", "Memo", "Low", "Archived", "Oct 12, 2026"],
  ["Court summons acknowledgement", "Federal Supreme Court of Ethiopia", "Legal Affairs", "Incoming", "Urgent", "Pending", "Oct 09, 2026"],
  ["Digital ID integration technical requirements", "Ministry of Innovation and Technology", "Ethiopian Investment Holdings", "Outgoing", "High", "In Review", "Oct 07, 2026"],
  ["Performance evaluation submission deadline", "Planning Directorate", "All Directorates", "Memo", "Medium", "Published", "Oct 05, 2026"],
  ["Tender evaluation committee appointment", "Procurement Directorate", "Minister's Office", "Internal", "Medium", "Published", "Oct 02, 2026"],
  ["Request for experts on construction e-permit system", "Ethiopian Construction and Works Corporation", "Ministry of Innovation and Technology", "Incoming", "Medium", "Archived", "Sep 29, 2026"],
];

type LetterSeed = typeof letterSeed;

function buildLetters(seed: LetterSeed, idPrefix: string, refPrefix: string): Letter[] {
  return seed.map(([subject, sender, recipient, type, priority, status, date], i) => ({
    id: `${idPrefix}${String(i + 1).padStart(3, "0")}`,
    reference: `${refPrefix}-${String(seed.length + 30 - i).padStart(4, "0")}`,
    subject,
    sender,
    recipient,
    type,
    priority,
    status,
    date,
    body:
      "This letter is registered in the Letter Management System. The full scanned document and its attachments are available to authorised recipients, and every routing step is recorded in the audit trail.",
  }));
}

const mintStats = {
  organizations: { value: "49", change: null, previous: "49" },
  users: { value: "3,053", change: "+5.42%", previous: "2,896" },
  letters: { value: "15,242", change: "+13.91%", previous: "13,381" },
  storage: { value: "7.29 GB", change: "+11.07%", previous: "6.56 GB" },
};

const mintVolume = [
  { month: "Dec", incoming: 412, outgoing: 298 },
  { month: "Jan", incoming: 486, outgoing: 341 },
  { month: "Feb", incoming: 531, outgoing: 402 },
  { month: "Mar", incoming: 598, outgoing: 437 },
  { month: "Apr", incoming: 574, outgoing: 466 },
  { month: "May", incoming: 655, outgoing: 489 },
  { month: "Jun", incoming: 702, outgoing: 533 },
  { month: "Jul", incoming: 689, outgoing: 571 },
  { month: "Aug", incoming: 764, outgoing: 602 },
  { month: "Sep", incoming: 811, outgoing: 648 },
  { month: "Oct", incoming: 873, outgoing: 690 },
  { month: "Nov", incoming: 904, outgoing: 742 },
];

const mintTypes: { type: LetterType; count: number }[] = [
  { type: "Incoming", count: 6480 },
  { type: "Outgoing", count: 4930 },
  { type: "Internal", count: 2510 },
  { type: "Memo", count: 1322 },
];

const mintStatuses = [
  { status: "Published", count: 8412 },
  { status: "Pending", count: 2907 },
  { status: "In Review", count: 1684 },
  { status: "Returned", count: 742 },
  { status: "Draft", count: 513 },
  { status: "Archived", count: 984 },
];

// ---------------------------------------------------------------------------------------------
// Ministry of Education
// ---------------------------------------------------------------------------------------------

const moeLetterSeed: LetterSeed = [
  ["Request for national exam centre connectivity", "Ministry of Education", "Ministry of Innovation and Technology", "Outgoing", "Urgent", "Pending", "Nov 15, 2026"],
  ["የ2019 ዓ.ም የትምህርት ካሌንደር ማሳወቂያ", "የትምህርት ሚኒስቴር", "ለሁሉም ክልል ትምህርት ቢሮዎች", "Outgoing", "High", "Published", "Nov 13, 2026"],
  ["Textbook printing and distribution budget", "Finance Directorate", "Minister's Office", "Internal", "Urgent", "In Review", "Nov 12, 2026"],
  ["Accreditation report for private higher institutions", "Education and Training Authority", "Ministry of Education", "Incoming", "High", "Pending", "Nov 11, 2026"],
  ["Teachers' professional development week", "Teacher Development Directorate", "All Directorates", "Memo", "Medium", "Published", "Nov 10, 2026"],
  ["School feeding programme partnership renewal", "Ministry of Education", "Ministry of Peace", "Outgoing", "Medium", "Published", "Nov 07, 2026"],
  ["የመምህራን ምደባ ጥያቄ", "የከተማ እና መሰረተ ልማት ሚኒስቴር", "የትምህርት ሚኒስቴር", "Incoming", "Low", "Returned", "Nov 06, 2026"],
  ["Procurement of laboratory kits for secondary schools", "Procurement Directorate", "Finance Directorate", "Internal", "Medium", "In Review", "Nov 04, 2026"],
  ["Digital learning platform rollout plan", "ICT Directorate", "Minister's Office", "Internal", "High", "Draft", "Nov 03, 2026"],
  ["Exam season office hours", "Minister's Office", "All Staff", "Memo", "Low", "Published", "Nov 01, 2026"],
  ["Student data protection guideline review", "Ministry of Innovation and Technology", "Ministry of Education", "Incoming", "Medium", "In Review", "Oct 29, 2026"],
  ["School construction standards consultation", "Ministry of Education", "Ethiopian Construction and Works Corporation", "Outgoing", "Medium", "Published", "Oct 27, 2026"],
  ["Curriculum review committee nominations", "Curriculum Directorate", "All Directorates", "Memo", "Medium", "Archived", "Oct 24, 2026"],
  ["Scholarship quota for civil servants", "Civil Service Commission", "Ministry of Education", "Incoming", "Low", "Pending", "Oct 22, 2026"],
  ["University entrance results release", "Ministry of Education", "Federal Public Procurement Service", "Outgoing", "High", "Draft", "Oct 20, 2026"],
  ["Peace education module in civic curriculum", "Ministry of Peace", "Ministry of Education", "Incoming", "Medium", "Published", "Oct 17, 2026"],
  ["Annual school census data collection", "Planning Directorate", "Regional Education Bureaus", "Internal", "High", "Published", "Oct 14, 2026"],
  ["Year-end inventory count", "General Services", "All Staff", "Memo", "Low", "Archived", "Oct 10, 2026"],
];

const moeUsers: [string, string, UserRole, UserStatus, string][] = [
  ["Mulu Getahun", "ICT Directorate", "System Admin", "Active", "5 minutes ago"],
  ["Birtukan Ayele", "Records Office", "Records Officer", "Active", "20 minutes ago"],
  ["Fikadu Lemma", "Minister's Office", "Approver", "Active", "1 hour ago"],
  ["Hiwot Tadesse", "Curriculum Directorate", "Staff", "Active", "2 hours ago"],
  ["Gemechu Bekele", "Teacher Development Directorate", "Org Admin", "Active", "Yesterday"],
  ["Abeba Worku", "Planning Directorate", "Approver", "Active", "Yesterday"],
  ["Mesfin Abate", "Procurement Directorate", "Staff", "Invited", "Never"],
  ["Tsion Asfaw", "Finance Directorate", "Records Officer", "Active", "3 days ago"],
  ["Getnet Alemayehu", "Higher Education", "Staff", "Disabled", "1 month ago"],
  ["Eden Mesele", "General Services", "Staff", "Active", "4 days ago"],
  ["Yared Shiferaw", "Legal Affairs", "Approver", "Active", "1 week ago"],
  ["Rediet Kassa", "Communications", "Staff", "Active", "6 hours ago"],
];

// ---------------------------------------------------------------------------------------------
// Ministry of Peace
// ---------------------------------------------------------------------------------------------

const mopLetterSeed: LetterSeed = [
  ["Regional peace council meeting minutes", "Peace Building Directorate", "Minister's Office", "Internal", "High", "In Review", "Nov 14, 2026"],
  ["የብሔራዊ ምክክር መድረክ ተሳትፎ ጥሪ", "የሰላም ሚኒስቴር", "ለሁሉም ፌዴራል ተቋማት", "Outgoing", "High", "Published", "Nov 13, 2026"],
  ["Request for IDP registration system support", "Ministry of Peace", "Ministry of Innovation and Technology", "Outgoing", "Urgent", "Pending", "Nov 12, 2026"],
  ["Conflict early-warning quarterly report", "Early Warning Directorate", "Minister's Office", "Internal", "Urgent", "Pending", "Nov 11, 2026"],
  ["Volunteer coordinators orientation", "Human Resources", "All Directorates", "Memo", "Low", "Published", "Nov 10, 2026"],
  ["Peace education module in civic curriculum", "Ministry of Peace", "Ministry of Education", "Outgoing", "Medium", "Published", "Nov 07, 2026"],
  ["Interfaith dialogue forum logistics", "Ministry of Logistics", "Ministry of Peace", "Incoming", "Medium", "Returned", "Nov 05, 2026"],
  ["Federal–regional relations workshop budget", "Finance Directorate", "Minister's Office", "Internal", "Medium", "Draft", "Nov 04, 2026"],
  ["Community reconciliation programme update", "Ministry of Peace", "Ministry of Urban and Infrastructure", "Outgoing", "Medium", "In Review", "Oct 31, 2026"],
  ["Field mission travel guidelines", "General Services", "All Staff", "Memo", "Low", "Published", "Oct 29, 2026"],
  ["Legal opinion on the conflict resolution proclamation", "Federal Supreme Court of Ethiopia", "Ministry of Peace", "Incoming", "High", "Pending", "Oct 27, 2026"],
  ["School feeding programme partnership renewal", "Ministry of Education", "Ministry of Peace", "Incoming", "Medium", "Published", "Oct 24, 2026"],
  ["Youth peace ambassadors selection", "Youth Directorate", "All Directorates", "Memo", "Medium", "Archived", "Oct 21, 2026"],
  ["Secondment of mediators from the civil service", "Civil Service Commission", "Ministry of Peace", "Incoming", "Low", "Archived", "Oct 18, 2026"],
];

const mopUsers: [string, string, UserRole, UserStatus, string][] = [
  ["Ermias Tefera", "ICT Directorate", "System Admin", "Active", "8 minutes ago"],
  ["Kidist Hailu", "Records Office", "Records Officer", "Active", "30 minutes ago"],
  ["Solomon Gebre", "Minister's Office", "Approver", "Active", "2 hours ago"],
  ["Aster Wolde", "Peace Building Directorate", "Org Admin", "Active", "Yesterday"],
  ["Biniam Tekle", "Early Warning Directorate", "Staff", "Active", "Yesterday"],
  ["Frehiwot Dagne", "Youth Directorate", "Staff", "Invited", "Never"],
  ["Abel Mengistu", "Finance Directorate", "Approver", "Active", "3 days ago"],
  ["Senait Berhe", "Human Resources", "Records Officer", "Disabled", "2 months ago"],
  ["Daniel Ayalew", "Legal Affairs", "Staff", "Active", "5 days ago"],
];

// ---------------------------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------------------------

export type DashboardStat = { value: string; change: string | null; previous: string };

export type TenantData = {
  /** Counterpart organizations this tenant corresponds with (excludes the tenant itself). */
  organizations: Organization[];
  users: User[];
  letters: Letter[];
  dashboardStats: Record<"organizations" | "users" | "letters" | "storage", DashboardStat>;
  letterVolume: { month: string; incoming: number; outgoing: number }[];
  typeBreakdown: { type: LetterType; count: number }[];
  statusDistribution: { status: string; count: number }[];
};

const tenantOrg: Record<TenantId, { code: string; name: string }> = {
  mint: { code: "mint", name: "Ministry of Innovation and Technology" },
  moe: { code: "moe", name: "Ministry of Education" },
  mop: { code: "mop", name: "Ministry of Peace" },
};

/** Deterministic 0.5–1.5 multiplier so each tenant's per-organization counts differ. */
const jitter = (seed: string) => 0.5 + ([...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 997);

const scaleBy = <T extends Record<string, unknown>>(rows: T[], factor: number, keys: (keyof T)[], salt: string) =>
  rows.map((row, i) => {
    const next = { ...row };
    keys.forEach((key) => {
      next[key] = Math.round((row[key] as number) * factor * (0.9 + jitter(`${salt}${i}${String(key)}`) * 0.2)) as T[keyof T];
    });
    return next;
  });

function staff(tenant: TenantId, rows: [string, string, UserRole, UserStatus, string][]): User[] {
  const { code, name: organization } = tenantOrg[tenant];
  return rows.map(([name, department, role, status, lastActive], i) => ({
    id: `${tenant}-usr-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@${code}.gov.et`,
    organization,
    department,
    role,
    status,
    lastActive,
  }));
}

function counterparts(tenant: TenantId): Organization[] {
  const self = tenantOrg[tenant].code;
  return directory
    .filter((o) => o.code !== self)
    .map((o) => (tenant === "mint" ? o : { ...o, letters: Math.round(o.letters * jitter(tenant + o.code) * (tenant === "moe" ? 0.8 : 0.35)) }));
}

const fmt = (n: number) => n.toLocaleString("en-US");

function build(tenant: TenantId): TenantData {
  if (tenant === "mint") {
    return {
      organizations: counterparts("mint"),
      users: mintUsers,
      letters: buildLetters(letterSeed, "ltr-", "MINT"),
      dashboardStats: mintStats,
      letterVolume: mintVolume,
      typeBreakdown: mintTypes,
      statusDistribution: mintStatuses,
    };
  }
  const isMoe = tenant === "moe";
  const factor = isMoe ? 1.45 : 0.42;
  const typeBreakdown = scaleBy(mintTypes, factor, ["count"], tenant);
  const total = typeBreakdown.reduce((sum, t) => sum + t.count, 0);
  const organizations = counterparts(tenant);
  return {
    organizations,
    users: staff(tenant, isMoe ? moeUsers : mopUsers),
    letters: isMoe ? buildLetters(moeLetterSeed, "moe-ltr-", "MOE") : buildLetters(mopLetterSeed, "mop-ltr-", "MOP"),
    dashboardStats: isMoe
      ? {
          organizations: { value: String(organizations.length), change: null, previous: String(organizations.length) },
          users: { value: "4,418", change: "+3.10%", previous: "4,285" },
          letters: { value: fmt(total), change: "+9.84%", previous: fmt(Math.round(total / 1.0984)) },
          storage: { value: "10.42 GB", change: "+8.25%", previous: "9.63 GB" },
        }
      : {
          organizations: { value: String(organizations.length), change: null, previous: String(organizations.length) },
          users: { value: "1,126", change: "+1.62%", previous: "1,108" },
          letters: { value: fmt(total), change: "+21.40%", previous: fmt(Math.round(total / 1.214)) },
          storage: { value: "2.14 GB", change: "+17.90%", previous: "1.82 GB" },
        },
    letterVolume: scaleBy(mintVolume, factor, ["incoming", "outgoing"], tenant),
    typeBreakdown,
    statusDistribution: scaleBy(mintStatuses, factor, ["count"], tenant),
  };
}

const cache = new Map<TenantId, TenantData>();

export function getTenantData(tenant: TenantId): TenantData {
  if (!cache.has(tenant)) cache.set(tenant, build(tenant));
  return cache.get(tenant)!;
}

/** Every tenant's letters — used to prerender the detail pages. */
export const allLetters: Letter[] = (["mint", "moe", "mop"] as TenantId[]).flatMap((t) => getTenantData(t).letters);

/** Name lookup across the whole platform, including the current tenant itself. */
export const findOrganization = (name: string) => directory.find((o) => o.name === name);
