export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE'
}

export enum ActivityLevel {
  Sedentary = 1.2,
  LightlyActive = 1.375,
  ModeratelyActive = 1.55,
  VeryActive = 1.725,
  ExtraActive = 1.9
}

export type Language = 'pt' | 'en';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  currentWeight: number; // in kg
  gender: Gender;
  bodyFatPercentage?: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
  startDate: string; // ISO Date
  targetDate: string; // ISO Date
}

export interface DailyLog {
  date: string; // ISO Date YYYY-MM-DD
  weight: number;
  caloriesIn: number;
  caloriesBurnedExercise: number;
  sleepHours: number;
  waterIntake: number; // in Liters
  notes?: string;
}

export interface AppState {
  profile: UserProfile | null;
  logs: DailyLog[];
}

export interface HealthMetrics {
  bmr: number;
  tdee: number;
  dailyDeficitRequired: number;
  projectedWeightToday: number;
  daysRemaining: number;
  isOnTrack: boolean;
}