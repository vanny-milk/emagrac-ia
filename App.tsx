import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, DailyLog, Language } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { generateDummyData } from './utils/calculations';

const STORAGE_KEY = 'health_track_app_v1';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { profile: null, logs: [] };
  });

  const [lang, setLang] = useState<Language>('pt');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const handleProfileComplete = (profile: UserProfile) => {
    setAppState(prev => ({
      ...prev,
      profile,
      // Create initial log entry
      logs: [{
        date: new Date().toISOString().split('T')[0],
        weight: profile.currentWeight,
        caloriesIn: 0,
        caloriesBurnedExercise: 0,
        sleepHours: 0,
        waterIntake: 0,
        notes: lang === 'pt' ? 'Início da jornada!' : 'Journey started!'
      }]
    }));
  };

  const handleUpdateLog = (newLog: DailyLog) => {
    setAppState(prev => {
      // Remove existing log for this date if exists, then add new one
      const otherLogs = prev.logs.filter(l => l.date !== newLog.date);
      // Also update current weight in profile if it's today's log
      const isToday = newLog.date === new Date().toISOString().split('T')[0];
      const updatedProfile = isToday && prev.profile 
        ? { ...prev.profile, currentWeight: newLog.weight } 
        : prev.profile;

      return {
        profile: updatedProfile,
        logs: [...otherLogs, newLog]
      };
    });
  };

  const handleDeleteLog = (date: string) => {
    const confirmMsg = lang === 'pt' 
      ? "Tem certeza que deseja remover o registro deste dia?" 
      : "Are you sure you want to remove this log?";
      
    if (window.confirm(confirmMsg)) {
      setAppState(prev => ({
        ...prev,
        logs: prev.logs.filter(l => l.date !== date)
      }));
    }
  };

  const handleImport = (newData: AppState) => {
    if (newData.profile && Array.isArray(newData.logs)) {
      setAppState(newData);
    } else {
      alert("Arquivo inválido / Invalid file.");
    }
  };

  const handleReset = () => {
    setAppState({ profile: null, logs: [] });
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleLoadDemo = () => {
    const confirmMsg = lang === 'pt' 
      ? "Isso irá substituir seus dados atuais por dados de demonstração. Deseja continuar?"
      : "This will replace your current data with demo data. Continue?";

    if (window.confirm(confirmMsg)) {
      const dummyData = generateDummyData();
      setAppState(dummyData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setLang('pt')} 
          className={`text-2xl transition-opacity hover:scale-110 ${lang === 'pt' ? 'opacity-100' : 'opacity-40 grayscale'}`}
          title="Português"
        >
          🇧🇷
        </button>
        <button 
          onClick={() => setLang('en')} 
          className={`text-2xl transition-opacity hover:scale-110 ${lang === 'en' ? 'opacity-100' : 'opacity-40 grayscale'}`}
          title="English"
        >
          🇺🇸
        </button>
      </div>

      {!appState.profile ? (
        <Onboarding 
          onComplete={handleProfileComplete} 
          onImport={handleImport} 
          onDemoLoad={handleLoadDemo}
          lang={lang}
        />
      ) : (
        <Dashboard 
          data={appState} 
          onUpdateLog={handleUpdateLog} 
          onDeleteLog={handleDeleteLog}
          onImport={handleImport}
          onReset={handleReset}
          onDemoLoad={handleLoadDemo}
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;