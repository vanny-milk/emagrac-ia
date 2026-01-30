import { UserProfile, Gender, DailyLog, HealthMetrics, AppState, ActivityLevel, Language } from '../types';

export const calculateBMR = (profile: UserProfile): number => {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = {
    weight: profile.currentWeight,
    height: profile.height,
    age: profile.age,
    gender: profile.gender
  };

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  
  if (gender === Gender.Male) {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  return Math.round(bmr);
};

export const calculateTDEE = (bmr: number, activityMultiplier: number): number => {
  return Math.round(bmr * activityMultiplier);
};

export const calculateDaysDiff = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getHealthMetrics = (profile: UserProfile, logs: DailyLog[]): HealthMetrics => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  const totalWeightToLose = profile.currentWeight - profile.targetWeight;
  const totalDays = calculateDaysDiff(profile.startDate, profile.targetDate);
  
  // 7700 kcal is approx 1kg of fat
  const totalCalorieDeficitNeeded = totalWeightToLose * 7700;
  const dailyDeficitRequired = totalDays > 0 ? Math.round(totalCalorieDeficitNeeded / totalDays) : 0;

  // Calculate projected weight for today based on linear progress
  const daysPassed = calculateDaysDiff(profile.startDate, new Date().toISOString().split('T')[0]);
  const progressRatio = Math.min(Math.max(daysPassed / totalDays, 0), 1);
  const projectedWeightToday = Number((profile.currentWeight - (totalWeightToLose * progressRatio)).toFixed(2));

  // Find latest log or use current profile weight
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestWeight = sortedLogs.length > 0 ? sortedLogs[0].weight : profile.currentWeight;

  // "On Track" defined as being within 0.5kg of projected weight or lower
  const isOnTrack = latestWeight <= (projectedWeightToday + 0.5);

  const daysRemaining = Math.max(totalDays - daysPassed, 0);

  return {
    bmr,
    tdee,
    dailyDeficitRequired,
    projectedWeightToday,
    daysRemaining,
    isOnTrack
  };
};

export const formatDate = (dateStr: string, lang: Language = 'pt'): string => {
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  // Use UTC to avoid timezone shifts when visualizing simple dates
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d); 
  return date.toLocaleDateString(locale);
};

export const getWeekDay = (dateStr: string, lang: Language = 'pt'): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  
  if (lang === 'pt') {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  } else {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
};

export const generateDummyData = (): AppState => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30); // Started 30 days ago
  
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + 60); // 60 more days to go (90 days total)

  const profile: UserProfile = {
    name: "Alex Demo",
    age: 30,
    height: 175,
    currentWeight: 86.5,
    gender: Gender.Male,
    activityLevel: ActivityLevel.ModeratelyActive,
    targetWeight: 78,
    startDate: startDate.toISOString().split('T')[0],
    targetDate: targetDate.toISOString().split('T')[0],
    bodyFatPercentage: 25
  };

  const logs: DailyLog[] = [];
  let currentWeight = 90.0; // Starting weight

  for (let i = 0; i <= 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate non-linear weight loss
    // Base loss + random fluctuation
    const dailyChange = -0.12 + (Math.random() * 0.2 - 0.05); 
    currentWeight += dailyChange;
    
    logs.push({
      date: dateStr,
      weight: parseFloat(currentWeight.toFixed(1)),
      caloriesIn: Math.floor(1800 + Math.random() * 800), // Random intake between 1800-2600
      caloriesBurnedExercise: Math.floor(Math.random() * 600), // Random exercise
      sleepHours: parseFloat((5 + Math.random() * 4).toFixed(1)), // Sleep 5-9h
      waterIntake: parseFloat((1.0 + Math.random() * 2.5).toFixed(1)), // Water 1-3.5L
      notes: i === 30 ? "Focado / Focused" : ""
    });
  }

  // Ensure profile matches last log
  profile.currentWeight = logs[logs.length - 1].weight;

  return { profile, logs };
};