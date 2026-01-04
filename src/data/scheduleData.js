// 12-Week NEET Revision Schedule Data
// Starting January 5, 2026 (Monday)

export const NEET_DATE = new Date('2026-05-04');
export const START_DATE = new Date('2026-01-05');

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
    startDate: '2026-01-05',
    endDate: '2026-01-11',
    phase: 'Foundation',
    days: [
      { day: 'Mon', date: getDate(1, 0), activity: R },
      { day: 'Tue', date: getDate(1, 1), activity: R },
      { day: 'Wed', date: getDate(1, 2), activity: T11 },
      { day: 'Thu', date: getDate(1, 3), activity: A },
      { day: 'Fri', date: getDate(1, 4), activity: B },
      { day: 'Sat', date: getDate(1, 5), activity: R },
      { day: 'Sun', date: getDate(1, 6), activity: REST },
    ],
  },
  {
    week: 2,
    startDate: '2026-01-12',
    endDate: '2026-01-18',
    phase: 'Foundation',
    days: [
      { day: 'Mon', date: getDate(2, 0), activity: R },
      { day: 'Tue', date: getDate(2, 1), activity: R },
      { day: 'Wed', date: getDate(2, 2), activity: T12 },
      { day: 'Thu', date: getDate(2, 3), activity: A },
      { day: 'Fri', date: getDate(2, 4), activity: B },
      { day: 'Sat', date: getDate(2, 5), activity: R },
      { day: 'Sun', date: getDate(2, 6), activity: REST },
    ],
  },
  {
    week: 3,
    startDate: '2026-01-19',
    endDate: '2026-01-25',
    phase: 'Foundation',
    days: [
      { day: 'Mon', date: getDate(3, 0), activity: R },
      { day: 'Tue', date: getDate(3, 1), activity: R },
      { day: 'Wed', date: getDate(3, 2), activity: TF },
      { day: 'Thu', date: getDate(3, 3), activity: A },
      { day: 'Fri', date: getDate(3, 4), activity: B },
      { day: 'Sat', date: getDate(3, 5), activity: R },
      { day: 'Sun', date: getDate(3, 6), activity: REST },
    ],
  },
  {
    week: 4,
    startDate: '2026-01-26',
    endDate: '2026-02-01',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(4, 0), activity: M },
      { day: 'Tue', date: getDate(4, 1), activity: A },
      { day: 'Wed', date: getDate(4, 2), activity: B },
      { day: 'Thu', date: getDate(4, 3), activity: REST },
      { day: 'Fri', date: getDate(4, 4), activity: M },
      { day: 'Sat', date: getDate(4, 5), activity: A },
      { day: 'Sun', date: getDate(4, 6), activity: B },
    ],
  },
  {
    week: 5,
    startDate: '2026-02-02',
    endDate: '2026-02-08',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(5, 0), activity: R },
      { day: 'Tue', date: getDate(5, 1), activity: M },
      { day: 'Wed', date: getDate(5, 2), activity: A },
      { day: 'Thu', date: getDate(5, 3), activity: B },
      { day: 'Fri', date: getDate(5, 4), activity: M },
      { day: 'Sat', date: getDate(5, 5), activity: A },
      { day: 'Sun', date: getDate(5, 6), activity: REST },
    ],
  },
  {
    week: 6,
    startDate: '2026-02-09',
    endDate: '2026-02-15',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(6, 0), activity: B },
      { day: 'Tue', date: getDate(6, 1), activity: M },
      { day: 'Wed', date: getDate(6, 2), activity: A },
      { day: 'Thu', date: getDate(6, 3), activity: REST },
      { day: 'Fri', date: getDate(6, 4), activity: M },
      { day: 'Sat', date: getDate(6, 5), activity: A },
      { day: 'Sun', date: getDate(6, 6), activity: B },
    ],
  },
  {
    week: 7,
    startDate: '2026-02-16',
    endDate: '2026-02-22',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(7, 0), activity: R },
      { day: 'Tue', date: getDate(7, 1), activity: M },
      { day: 'Wed', date: getDate(7, 2), activity: A },
      { day: 'Thu', date: getDate(7, 3), activity: B },
      { day: 'Fri', date: getDate(7, 4), activity: M },
      { day: 'Sat', date: getDate(7, 5), activity: A },
      { day: 'Sun', date: getDate(7, 6), activity: REST },
    ],
  },
  {
    week: 8,
    startDate: '2026-02-23',
    endDate: '2026-03-01',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(8, 0), activity: B },
      { day: 'Tue', date: getDate(8, 1), activity: M },
      { day: 'Wed', date: getDate(8, 2), activity: A },
      { day: 'Thu', date: getDate(8, 3), activity: REST },
      { day: 'Fri', date: getDate(8, 4), activity: M },
      { day: 'Sat', date: getDate(8, 5), activity: A },
      { day: 'Sun', date: getDate(8, 6), activity: B },
    ],
  },
  {
    week: 9,
    startDate: '2026-03-02',
    endDate: '2026-03-08',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(9, 0), activity: R },
      { day: 'Tue', date: getDate(9, 1), activity: M },
      { day: 'Wed', date: getDate(9, 2), activity: A },
      { day: 'Thu', date: getDate(9, 3), activity: B },
      { day: 'Fri', date: getDate(9, 4), activity: M },
      { day: 'Sat', date: getDate(9, 5), activity: A },
      { day: 'Sun', date: getDate(9, 6), activity: REST },
    ],
  },
  {
    week: 10,
    startDate: '2026-03-09',
    endDate: '2026-03-15',
    phase: 'Intensive',
    days: [
      { day: 'Mon', date: getDate(10, 0), activity: B },
      { day: 'Tue', date: getDate(10, 1), activity: M },
      { day: 'Wed', date: getDate(10, 2), activity: A },
      { day: 'Thu', date: getDate(10, 3), activity: REST },
      { day: 'Fri', date: getDate(10, 4), activity: M },
      { day: 'Sat', date: getDate(10, 5), activity: A },
      { day: 'Sun', date: getDate(10, 6), activity: B },
    ],
  },
  {
    week: 11,
    startDate: '2026-03-16',
    endDate: '2026-03-22',
    phase: 'INTENSE',
    isIntense: true,
    days: [
      { day: 'Mon', date: getDate(11, 0), activity: M },
      { day: 'Tue', date: getDate(11, 1), activity: A },
      { day: 'Wed', date: getDate(11, 2), activity: M },
      { day: 'Thu', date: getDate(11, 3), activity: A },
      { day: 'Fri', date: getDate(11, 4), activity: M },
      { day: 'Sat', date: getDate(11, 5), activity: A },
      { day: 'Sun', date: getDate(11, 6), activity: REST },
    ],
  },
  {
    week: 12,
    startDate: '2026-03-23',
    endDate: '2026-03-30',
    phase: 'FINAL',
    isFinal: true,
    days: [
      { day: 'Mon', date: getDate(12, 0), activity: M },
      { day: 'Tue', date: getDate(12, 1), activity: A },
      { day: 'Wed', date: getDate(12, 2), activity: M },
      { day: 'Thu', date: getDate(12, 3), activity: A },
      { day: 'Fri', date: getDate(12, 4), activity: M },
      { day: 'Sat', date: getDate(12, 5), activity: A },
      { day: 'Sun', date: getDate(12, 6), activity: LR },
      { day: 'Mon', date: getDate(12, 7), activity: FT },
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
