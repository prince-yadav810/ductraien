// 12-Week NEET Revision Schedule Data
// Starting January 5, 2026 (Monday)

export const NEET_DATE = new Date('2026-06-15');
export const START_DATE = new Date('2026-05-15');

// Activity types with XP values
export const ACTIVITY_TYPES = {
  REVISION: { label: 'Revision', short: 'Revision', xp: 10, color: '#007aff', icon: 'BookOpen' },
  TEST_11: { label: 'Test (11th)', short: 'Test (11th)', xp: 50, color: '#ff9500', icon: 'FileText' },
  TEST_12: { label: 'Test (12th)', short: 'Test (12th)', xp: 50, color: '#ff9500', icon: 'FileText' },
  TEST_FULL: { label: 'Full Test', short: 'Full Test', xp: 50, color: '#ff9500', icon: 'FileText' },
  MOCK: { label: 'Mock Test', short: 'Mock Test', xp: 50, color: '#ff9500', icon: 'Target' },
  ANALYSIS: { label: 'Analysis', short: 'Analysis', xp: 30, color: '#af52de', icon: 'BarChart2' },
  BACKLOG: { label: 'Backlog', short: 'Backlog', xp: 20, color: '#ff3b30', icon: 'AlertCircle' },
  REST: { label: 'Rest Day', short: 'Rest', xp: 5, color: '#34c759', icon: 'Coffee' },
  LIGHT_REVISE: { label: 'Light Revise', short: 'Light Revise', xp: 10, color: '#5ac8fa', icon: 'Feather' },
  FINAL_TOUCH: { label: 'Final Touch', short: 'Final Touch', xp: 15, color: '#5856d6', icon: 'Star' },
  PHY_B1: { label: 'Physics – Block 1', short: 'Phy B1', xp: 10, color: '#007aff', icon: 'Zap' },
  PHY_B2: { label: 'Physics – Block 2', short: 'Phy B2', xp: 10, color: '#007aff', icon: 'Zap' },
  PHY_B3: { label: 'Physics – Block 3', short: 'Phy B3', xp: 10, color: '#007aff', icon: 'Zap' },
  PHY_B4: { label: 'Physics – Block 4', short: 'Phy B4', xp: 10, color: '#007aff', icon: 'Zap' },
  PHY_PYQ: { label: 'Physics – PYQs', short: 'Phy PYQ', xp: 10, color: '#007aff', icon: 'Zap' },
  PHY_FINAL: { label: 'Physics – Final Revision', short: 'Phy Final', xp: 10, color: '#007aff', icon: 'Zap' },
  CHEM: { label: 'Chemistry Revision', short: 'Chem', xp: 10, color: '#ff9500', icon: 'BookOpen' },
  BOTANY: { label: 'Botany Revision', short: 'Botany', xp: 10, color: '#34c759', icon: 'Leaf' },
  ZOOLOGY: { label: 'Zoology Revision', short: 'Zoology', xp: 10, color: '#af52de', icon: 'Eye' },
};

// Helper to get date for a specific week and day
const getDate = (weekNum, dayNum) => {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + (weekNum - 1) * 7 + dayNum);
  return date.toISOString().split('T')[0];
};

// Activity shorthand
const R = 'REVISION';
const T11 = 'TEST_11';
const T12 = 'TEST_12';
const TF = 'TEST_FULL';
const M = 'MOCK';
const A = 'ANALYSIS';
const B = 'BACKLOG';
const REST = 'REST';
const LR = 'LIGHT_REVISE';
const FT = 'FINAL_TOUCH';

export const SCHEDULE_DATA = [
  {
    week: 1,
    startDate: '2026-05-15',
    endDate: '2026-05-21',
    phase: 'Revision Phase 1',
    days: [
      { day: 'Fri', date: getDate(1, 0), activity: 'REVISION', fixedSubject: 'PHY_B1', altSubject: 'CHEM', hasMock: true, label: 'Physics Block 1 + Chemistry + Mock Test' },
      { day: 'Sat', date: getDate(1, 1), activity: 'REVISION', fixedSubject: 'PHY_B1', altSubject: 'ZOOLOGY', hasMock: true, label: 'Physics Block 1 + Zoology + Mock Test' },
      { day: 'Sun', date: getDate(1, 2), activity: 'REVISION', fixedSubject: 'PHY_B1', altSubject: 'BOTANY', hasMock: true, label: 'Physics Block 1 + Botany + Mock Test' },
      { day: 'Mon', date: getDate(1, 3), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'PHY_B2', hasMock: true, label: 'Zoology + Physics Block 2 + Mock Test' },
      { day: 'Tue', date: getDate(1, 4), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'CHEM', hasMock: true, label: 'Zoology + Chemistry + Mock Test' },
      { day: 'Wed', date: getDate(1, 5), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'BOTANY', hasMock: true, label: 'Zoology + Botany + Mock Test' },
      { day: 'Thu', date: getDate(1, 6), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'PHY_B2', hasMock: true, label: 'Botany + Physics Block 2 + Mock Test' },
    ],
  },
  {
    week: 2,
    startDate: '2026-05-22',
    endDate: '2026-05-28',
    phase: 'Revision Phase 2',
    days: [
      { day: 'Fri', date: getDate(2, 0), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'CHEM', hasMock: true, label: 'Botany + Chemistry + Mock Test' },
      { day: 'Sat', date: getDate(2, 1), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'ZOOLOGY', hasMock: true, label: 'Botany + Zoology + Mock Test' },
      { day: 'Sun', date: getDate(2, 2), activity: 'REVISION', fixedSubject: 'PHY_B2', altSubject: 'CHEM', hasMock: true, label: 'Physics Block 2 + Chemistry + Mock Test' },
      { day: 'Mon', date: getDate(2, 3), activity: 'REVISION', fixedSubject: 'PHY_B3', altSubject: 'ZOOLOGY', hasMock: true, label: 'Physics Block 3 + Zoology + Mock Test' },
      { day: 'Tue', date: getDate(2, 4), activity: 'REVISION', fixedSubject: 'PHY_B3', altSubject: 'BOTANY', hasMock: true, label: 'Physics Block 3 + Botany + Mock Test' },
      { day: 'Wed', date: getDate(2, 5), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'PHY_B3', hasMock: true, label: 'Zoology + Physics Block 3 + Mock Test' },
      { day: 'Thu', date: getDate(2, 6), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'CHEM', hasMock: true, label: 'Zoology + Chemistry + Mock Test' },
    ],
  },
  {
    week: 3,
    startDate: '2026-05-29',
    endDate: '2026-06-04',
    phase: 'Revision Phase 3',
    days: [
      { day: 'Fri', date: getDate(3, 0), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'BOTANY', hasMock: true, label: 'Zoology + Botany + Mock Test' },
      { day: 'Sat', date: getDate(3, 1), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'PHY_B3', hasMock: true, label: 'Botany + Physics Block 3 + Mock Test' },
      { day: 'Sun', date: getDate(3, 2), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'CHEM', hasMock: true, label: 'Botany + Chemistry + Mock Test' },
      { day: 'Mon', date: getDate(3, 3), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'ZOOLOGY', hasMock: true, label: 'Botany + Zoology + Mock Test' },
      { day: 'Tue', date: getDate(3, 4), activity: 'REVISION', fixedSubject: 'PHY_B4', altSubject: 'CHEM', hasMock: true, label: 'Physics Block 4 + Chemistry + Mock Test' },
      { day: 'Wed', date: getDate(3, 5), activity: 'REVISION', fixedSubject: 'PHY_B4', altSubject: 'ZOOLOGY', hasMock: true, label: 'Physics Block 4 + Zoology + Mock Test' },
      { day: 'Thu', date: getDate(3, 6), activity: 'REVISION', fixedSubject: 'PHY_B4', altSubject: 'BOTANY', hasMock: true, label: 'Physics Block 4 + Botany + Mock Test' },
    ],
  },
  {
    week: 4,
    startDate: '2026-06-05',
    endDate: '2026-06-11',
    phase: 'Revision Phase 4',
    days: [
      { day: 'Fri', date: getDate(4, 0), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'PHY_B4', hasMock: true, label: 'Zoology + Physics Block 4 + Mock Test' },
      { day: 'Sat', date: getDate(4, 1), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'CHEM', hasMock: true, label: 'Zoology + Chemistry + Mock Test' },
      { day: 'Sun', date: getDate(4, 2), activity: 'REVISION', fixedSubject: 'ZOOLOGY', altSubject: 'BOTANY', hasMock: true, label: 'Zoology + Botany + Mock Test' },
      { day: 'Mon', date: getDate(4, 3), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'PHY_PYQ', hasMock: true, label: 'Botany + Physics PYQs + Mock Test' },
      { day: 'Tue', date: getDate(4, 4), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'CHEM', hasMock: true, label: 'Botany + Chemistry + Mock Test' },
      { day: 'Wed', date: getDate(4, 5), activity: 'REVISION', fixedSubject: 'BOTANY', altSubject: 'ZOOLOGY', hasMock: true, label: 'Botany + Zoology + Mock Test' },
      { day: 'Thu', date: getDate(4, 6), activity: 'REVISION', fixedSubject: 'PHY_PYQ', altSubject: 'CHEM', hasMock: true, label: 'Physics PYQs + Chemistry + Mock Test' },
    ],
  },
  {
    week: 5,
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    phase: 'Final Sprint',
    isFinal: true,
    days: [
      { day: 'Fri', date: getDate(5, 0), activity: 'REVISION', fixedSubject: 'PHY_PYQ', altSubject: 'ZOOLOGY', hasMock: true, label: 'Physics PYQs + Zoology + Mock Test' },
      { day: 'Sat', date: getDate(5, 1), activity: 'REVISION', fixedSubject: 'PHY_FINAL', altSubject: 'BOTANY', hasMock: true, label: 'Physics Final + Botany + Mock Test' },
      { day: 'Sun', date: getDate(5, 2), activity: 'REVISION', fixedSubject: 'PHY_FINAL', altSubject: 'ZOOLOGY', hasMock: true, label: 'Physics Final + Zoology + Mock Test' },
    ],
  },
];

// XP Levels and Ranks
export const RANKS = [
  { name: 'Aspirant', minXP: 0, icon: '🌱', color: '#86868b' },
  { name: 'Intern', minXP: 200, icon: '🩺', color: '#5ac8fa' },
  { name: 'Resident', minXP: 500, icon: '💉', color: '#34c759' },
  { name: 'Specialist', minXP: 1000, icon: '🔬', color: '#ff9500' },
  { name: 'Surgeon', minXP: 2000, icon: '🏆', color: '#ff2d55' },
];

// Achievements/Badges
export const ACHIEVEMENTS = [
  { id: 'first_day', name: 'First Step', description: 'Complete your first day', icon: '🎯', condition: (stats) => stats.totalCompleted >= 1 },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Complete a full week', icon: '📅', condition: (stats) => stats.streakMax >= 7 },
  { id: 'streak_7', name: '7-Day Streak', description: 'Maintain a 7-day streak', icon: '🔥', condition: (stats) => stats.streakCurrent >= 7 },
  { id: 'streak_14', name: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: '💪', condition: (stats) => stats.streakCurrent >= 14 },
  { id: 'score_600', name: '600+ Club', description: 'Score 600+ in a mock', icon: '⭐', condition: (stats) => stats.maxScore >= 600 },
  { id: 'score_700', name: '700+ Score', description: 'Score 700+ in a mock', icon: '🌟', condition: (stats) => stats.maxScore >= 700 },
  { id: 'half_way', name: 'Halfway There', description: 'Complete 50% of schedule', icon: '🎉', condition: (stats) => stats.progressPercent >= 50 },
  { id: 'finisher', name: 'The Finisher', description: 'Complete entire schedule', icon: '🏅', condition: (stats) => stats.progressPercent >= 100 },
  { id: 'mock_master', name: 'Mock Master', description: 'Complete 10 mock tests', icon: '📝', condition: (stats) => stats.mocksCompleted >= 10 },
  { id: 'analyst', name: 'The Analyst', description: 'Complete 10 analysis sessions', icon: '🔍', condition: (stats) => stats.analysisCompleted >= 10 },
];

// Motivational Quotes
export const QUOTES = [
  { text: "The doctor of the future will give no medicine, but will interest patients in the care of the human frame.", author: "Thomas Edison" },
  { text: "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters.", author: "Paracelsus" },
  { text: "Your work is going to fill a large part of your life. The only way to be truly satisfied is to do great work.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "A year from now you will wish you had started today.", author: "Karen Lamb" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
];

// Get a quote based on the day of the year
export const getDailyQuote = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
};
