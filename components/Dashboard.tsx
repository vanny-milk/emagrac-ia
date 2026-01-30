import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, DailyLog, HealthMetrics, AppState, Language } from '../types';
import { getHealthMetrics, formatDate, calculateDaysDiff, getWeekDay } from '../utils/calculations';
import { getHealthAdvice } from '../services/geminiService';
import { translations } from '../utils/i18n';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  Flame, Scale, BedDouble, Utensils, BrainCircuit, Save, Upload, Trash2, 
  PlusCircle, CheckCircle, Activity, Droplets, PlayCircle, Sparkles, 
  Table as TableIcon, TrendingDown, RefreshCcw, CalendarPlus, X,
  ArrowUpDown, Filter, Search, Calendar
} from 'lucide-react';

interface Props {
  data: AppState;
  onUpdateLog: (log: DailyLog) => void;
  onDeleteLog: (date: string) => void;
  onImport: (data: AppState) => void;
  onReset: () => void;
  onDemoLoad: () => void;
  lang: Language;
}

type TimeRange = '7d' | '30d' | 'all';
type ProjectionMode = 'linear' | 'geometric';
type SortDirection = 'asc' | 'desc';

// Componente para contador de peso em tempo real
const LiveWeightTicker: React.FC<{ initialWeight: number; dailyDeficit: number }> = ({ initialWeight, dailyDeficit }) => {
  const [displayedWeight, setDisplayedWeight] = useState(initialWeight);
  
  useEffect(() => {
    const weightLossPerDay = dailyDeficit / 7700;
    const weightLossPerSecond = weightLossPerDay / 86400;
    const weightLossPerTick = weightLossPerSecond / 2;

    setDisplayedWeight(initialWeight);

    const interval = setInterval(() => {
      setDisplayedWeight(prev => Math.max(0, prev - weightLossPerTick));
    }, 500); 

    return () => clearInterval(interval);
  }, [initialWeight, dailyDeficit]);

  return (
    <div className="font-mono text-4xl font-bold text-emerald-600 tracking-wider tabular-nums">
      {displayedWeight.toFixed(7)} <span className="text-base text-gray-500 font-sans">kg</span>
    </div>
  );
};

// Componente de Linha da Planilha (Edição)
const SpreadsheetRow: React.FC<{ 
  row: { date: string, exists: boolean, data: DailyLog }; 
  onSave: (log: DailyLog) => void; 
  onDelete: (date: string) => void; 
  lang: Language;
}> = ({ row, onSave, onDelete, lang }) => {
  
  const [values, setValues] = useState({
    weight: String(row.data.weight ?? ''),
    caloriesIn: String(row.data.caloriesIn ?? ''),
    caloriesBurnedExercise: String(row.data.caloriesBurnedExercise ?? ''),
    waterIntake: String(row.data.waterIntake ?? '')
  });

  // Track previous values to avoid unnecessary saves
  const prevValues = useRef(values);

  useEffect(() => {
    const newValues = {
      weight: String(row.data.weight ?? ''),
      caloriesIn: String(row.data.caloriesIn ?? ''),
      caloriesBurnedExercise: String(row.data.caloriesBurnedExercise ?? ''),
      waterIntake: String(row.data.waterIntake ?? '')
    };
    setValues(newValues);
    prevValues.current = newValues;
  }, [row.data]);

  const handleChange = (field: keyof typeof values, val: string) => {
    setValues(prev => ({ ...prev, [field]: val }));
  };

  const handleBlur = () => {
    // Only save if values changed
    if (
      values.weight === prevValues.current.weight &&
      values.caloriesIn === prevValues.current.caloriesIn &&
      values.caloriesBurnedExercise === prevValues.current.caloriesBurnedExercise &&
      values.waterIntake === prevValues.current.waterIntake
    ) {
      return;
    }

    const newLog: DailyLog = {
      ...row.data,
      weight: values.weight === '' ? 0 : parseFloat(values.weight),
      caloriesIn: values.caloriesIn === '' ? 0 : parseInt(values.caloriesIn),
      caloriesBurnedExercise: values.caloriesBurnedExercise === '' ? 0 : parseInt(values.caloriesBurnedExercise),
      waterIntake: values.waterIntake === '' ? 0 : parseFloat(values.waterIntake),
    };
    onSave(newLog);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const inputClass = "w-full px-2 py-2 text-sm border-b-2 border-transparent hover:border-gray-200 focus:border-emerald-500 bg-transparent outline-none transition-colors text-gray-700 text-center focus:bg-white";

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100 bg-white">
          <div className="flex flex-col">
            <span>{formatDate(row.date, lang)}</span>
            <span className="text-xs text-gray-400 font-normal uppercase">{getWeekDay(row.date, lang)}</span>
          </div>
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <input 
          type="number" step="0.1" 
          className={inputClass}
          value={values.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="0.0"
        />
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
          <input 
          type="number" 
          className={inputClass}
          value={values.caloriesIn}
          onChange={(e) => handleChange('caloriesIn', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="0"
        />
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
          <input 
          type="number" 
          className={inputClass}
          value={values.caloriesBurnedExercise}
          onChange={(e) => handleChange('caloriesBurnedExercise', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="0"
        />
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
          <input 
          type="number" step="0.1"
          className={inputClass}
          value={values.waterIntake}
          onChange={(e) => handleChange('waterIntake', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="0.0"
        />
      </td>
       <td className="px-4 py-2 whitespace-nowrap text-center">
         {row.exists && (
           <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onDelete(row.date)}
            className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title={translations[lang].dashboard.deleteWarning}
           >
             <Trash2 className="h-4 w-4" />
           </button>
         )}
      </td>
    </tr>
  );
};

// Nova Linha de Entrada (Planilha)
const NewEntryRow: React.FC<{ onAdd: (log: DailyLog) => void }> = ({ onAdd }) => {
  const [newLog, setNewLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    caloriesIn: 0,
    caloriesBurnedExercise: 0,
    sleepHours: 0,
    waterIntake: 0
  });

  const handleChange = (field: keyof DailyLog, value: string) => {
    setNewLog(prev => ({
      ...prev,
      [field]: field === 'date' ? value : (parseFloat(value) || 0)
    }));
  };

  const handleAdd = () => {
    if (!newLog.date) return;
    onAdd(newLog);
    // Reset values logic but keep date to prevent frustration
    setNewLog(prev => ({ 
      ...prev, 
      weight: 0, caloriesIn: 0, caloriesBurnedExercise: 0, waterIntake: 0 
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const inputClass = "w-full px-2 py-2 text-sm border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-emerald-50/50 text-gray-700 text-center placeholder-emerald-300";

  return (
    <tr className="bg-emerald-50 border-b-2 border-emerald-100">
      <td className="px-4 py-2 whitespace-nowrap">
        <input 
          type="date"
          value={newLog.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-2 py-2 text-sm border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </td>
      <td className="px-2 py-1"><input type="number" step="0.1" placeholder="Peso" value={newLog.weight || ''} onChange={e => handleChange('weight', e.target.value)} onKeyDown={handleKeyDown} className={inputClass} /></td>
      <td className="px-2 py-1"><input type="number" placeholder="Calorias" value={newLog.caloriesIn || ''} onChange={e => handleChange('caloriesIn', e.target.value)} onKeyDown={handleKeyDown} className={inputClass} /></td>
      <td className="px-2 py-1"><input type="number" placeholder="Exercício" value={newLog.caloriesBurnedExercise || ''} onChange={e => handleChange('caloriesBurnedExercise', e.target.value)} onKeyDown={handleKeyDown} className={inputClass} /></td>
      <td className="px-2 py-1"><input type="number" step="0.1" placeholder="Água" value={newLog.waterIntake || ''} onChange={e => handleChange('waterIntake', e.target.value)} onKeyDown={handleKeyDown} className={inputClass} /></td>
      <td className="px-4 py-2 text-center">
        <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-sm transition-transform active:scale-95" title="Adicionar Registro">
          <PlusCircle className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};


const Dashboard: React.FC<Props> = ({ data, onUpdateLog, onDeleteLog, onImport, onReset, onDemoLoad, lang }) => {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const t = translations[lang].dashboard;
  const tApp = translations[lang];
  
  // State for the currently selected date in the Log View
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [todayLog, setTodayLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    caloriesIn: 0,
    caloriesBurnedExercise: 0,
    sleepHours: 0,
    waterIntake: 0,
    notes: ''
  });
  
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'log' | 'spreadsheet' | 'settings'>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [projectionMode, setProjectionMode] = useState<ProjectionMode>('linear');

  // Spreadsheet State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState<{[key: string]: string}>({});

  // Effect to load data when selectedDate changes OR when data updates
  useEffect(() => {
    if (data.profile) {
      const calculatedMetrics = getHealthMetrics(data.profile, data.logs);
      setMetrics(calculatedMetrics);
      
      const existingLog = data.logs.find(l => l.date === selectedDate);
      if (existingLog) {
        setTodayLog({ ...existingLog, waterIntake: existingLog.waterIntake || 0 });
      } else {
        // If no log exists for this date, prep a new one.
        // Try to find the last recorded weight to pre-fill for convenience
        const sortedLogs = [...data.logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const lastWeight = sortedLogs.length > 0 
           ? sortedLogs[0].weight 
           : data.profile.currentWeight;
           
        setTodayLog({
            date: selectedDate,
            weight: lastWeight,
            caloriesIn: 0,
            caloriesBurnedExercise: 0,
            sleepHours: 0,
            waterIntake: 0,
            notes: ''
        });
      }
    }
  }, [data, selectedDate]);

  // Clear advice when language changes
  useEffect(() => {
    setAdvice('');
  }, [lang]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLog(todayLog);
    alert(t.savedSuccess);
  };

  const handleGenerateAdvice = async () => {
    if (!data.profile || !metrics) return;
    setLoadingAdvice(true);
    const result = await getHealthAdvice(data.profile, data.logs, metrics, lang);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `emagrecia-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsedData = JSON.parse(event.target.result as string);
            onImport(parsedData);
            alert("Dados importados com sucesso!");
          }
        } catch (err) {
          alert("Erro ao ler arquivo JSON");
        }
      };
    }
  };

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    if (!data.profile || !metrics) return [];

    const today = new Date();
    const startDate = new Date(data.profile.startDate);
    const targetDate = new Date(data.profile.targetDate);
    
    let chartStartDate = new Date(startDate);
    let chartEndDate = new Date(targetDate);

    if (timeRange === '7d') {
      const past7 = new Date();
      past7.setDate(today.getDate() - 6);
      const future3 = new Date();
      future3.setDate(today.getDate() + 3);
      chartStartDate = past7 > startDate ? past7 : startDate;
      chartEndDate = future3 < targetDate ? future3 : targetDate;
    } else if (timeRange === '30d') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 29);
      const future7 = new Date();
      future7.setDate(today.getDate() + 7);
      chartStartDate = past30 > startDate ? past30 : startDate;
      chartEndDate = future7 < targetDate ? future7 : targetDate;
    } else {
      chartStartDate = startDate;
      chartEndDate = targetDate; 
    }

    const totalDurationDays = calculateDaysDiff(data.profile.startDate, data.profile.targetDate) || 1;
    const totalWeightToLose = data.profile.currentWeight - data.profile.targetWeight;

    const dataPoints = [];
    let currentDate = new Date(chartStartDate);
    
    if (chartEndDate < chartStartDate) chartEndDate = chartStartDate;

    while (currentDate <= chartEndDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const weekDay = getWeekDay(dateStr, lang);
      
      const log = data.logs.find(l => l.date === dateStr);
      const daysPassedTotal = calculateDaysDiff(data.profile.startDate, dateStr);
      const ratio = Math.min(Math.max(daysPassedTotal / totalDurationDays, 0), 1);
      
      let expectedWeight;
      if (projectionMode === 'linear') {
         expectedWeight = Number((data.profile.currentWeight - (totalWeightToLose * ratio)).toFixed(2));
      } else {
         const expectedLoss = totalWeightToLose * Math.pow(ratio, 2);
         expectedWeight = Number((data.profile.currentWeight - expectedLoss).toFixed(2));
      }

      const tdee = metrics.tdee;
      const caloriesBurned = log ? (tdee + log.caloriesBurnedExercise) : null;
      const calorieGoal = tdee - metrics.dailyDeficitRequired;

      dataPoints.push({
        date: `${formatDate(dateStr, lang).slice(0, 5)} ${weekDay}`, 
        fullDate: dateStr,
        isWeekend: dateStr ? (new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6) : false,
        weight: log ? log.weight : null,
        expectedWeight,
        caloriesIn: log ? log.caloriesIn : null,
        caloriesBurned: caloriesBurned,
        calorieGoal: calorieGoal,
        water: log ? (log.waterIntake || 0) : null,
        sleep: log ? log.sleepHours : null
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dataPoints;

  }, [data, metrics, timeRange, projectionMode, lang]);

  // --- Spreadsheet Logic (Filter & Sort) ---
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const spreadsheetRows = useMemo(() => {
    if (!data.profile) return [];
    
    const allDates = new Set<string>();
    
    // Generate base range dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const startStr = data.profile.startDate;

    let currDate = new Date(startStr + "T00:00:00");
    const endDate = new Date(todayStr + "T00:00:00");

    if (!isNaN(currDate.getTime()) && !isNaN(endDate.getTime())) {
        if (currDate <= endDate) {
            while (currDate <= endDate) {
                allDates.add(currDate.toISOString().split('T')[0]);
                currDate.setDate(currDate.getDate() + 1);
            }
        } else {
            allDates.add(startStr);
            allDates.add(todayStr);
        }
    }

    data.logs.forEach(l => allDates.add(l.date));

    // Convert to Array of Objects
    let rows = Array.from(allDates).map(dateStr => {
      const log = data.logs.find(l => l.date === dateStr);
      return {
        date: dateStr,
        exists: !!log,
        data: log || {
          date: dateStr,
          weight: 0,
          caloriesIn: 0,
          caloriesBurnedExercise: 0,
          waterIntake: 0,
          sleepHours: 0,
          notes: ''
        }
      };
    });

    // 1. FILTERING
    rows = rows.filter(row => {
       return Object.entries(filters).every(([key, value]) => {
          const filterVal = value as string;
          if (!filterVal) return true;
          if (key === 'date') return row.date.includes(filterVal);
          
          const data = row.data as Record<string, any>;
          const cellValue = data[key];
          const rowValue = String(cellValue !== undefined && cellValue !== null ? cellValue : '');
          
          return rowValue.toLowerCase().includes(filterVal.toLowerCase());
       });
    });

    // 2. SORTING
    rows.sort((a, b) => {
      let valA: any = a.data[sortConfig.key as keyof DailyLog];
      let valB: any = b.data[sortConfig.key as keyof DailyLog];

      // Handle missing data in sorting
      if (valA === undefined) valA = 0;
      if (valB === undefined) valB = 0;

      // Special handle for Date key
      if (sortConfig.key === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [data.logs, data.profile, sortConfig, filters]);


  const WeekendReferenceLines = () => (
    <>
      {chartData.filter(d => d.isWeekend).map((entry, index) => (
        <ReferenceLine 
          key={`weekend-${index}`} 
          x={entry.date} 
          stroke="#e5e7eb" 
          strokeDasharray="3 3" 
          label={{ value: '', position: 'insideTop', fill: '#9ca3af', fontSize: 10 }} 
        />
      ))}
    </>
  );

  if (!data.profile || !metrics) return <div>{t.loading}</div>;

  const netCalories = todayLog.caloriesIn - (metrics.tdee + todayLog.caloriesBurnedExercise);
  const isDeficitMet = netCalories < -metrics.dailyDeficitRequired;
  const lastKnownWeight = [...data.logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight || data.profile.currentWeight;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-500" /> {tApp.appTitle}
          </h1>
          <div className="text-sm text-gray-500 hidden sm:block">
             {t.target}: {data.profile.targetWeight}kg {t.in} {calculateDaysRemaining(data.profile.targetDate)} {t.days}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg max-w-lg mx-auto mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: t.overview, icon: Activity },
            { id: 'log', label: t.log, icon: PlusCircle },
            { id: 'spreadsheet', label: t.spreadsheet, icon: TableIcon },
            { id: 'settings', label: t.settings, icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md capitalize transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-emerald-700 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Live Weight Ticker */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
               <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                 <TrendingDown className="h-4 w-4" /> {t.liveTicker}
               </p>
               <LiveWeightTicker initialWeight={lastKnownWeight} dailyDeficit={metrics.dailyDeficitRequired} />
               <p className="text-xs text-gray-400 mt-2">{t.liveTickerSub}</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-between items-center flex-wrap gap-4">
               {/* Projection Toggle */}
               <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setProjectionMode('linear')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${projectionMode === 'linear' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  >
                    {t.linearGoal}
                  </button>
                  <button 
                    onClick={() => setProjectionMode('geometric')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${projectionMode === 'geometric' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  >
                    {t.curvedGoal}
                  </button>
               </div>

               <div className="flex gap-2">
                {[
                  { label: `7 ${t.days}`, value: '7d' },
                  { label: `30 ${t.days}`, value: '30d' },
                  { label: t.all, value: 'all' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value as TimeRange)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      timeRange === range.value 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.currentWeight}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{todayLog.weight || data.profile.currentWeight} kg</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${metrics.isOnTrack ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Scale className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {metrics.isOnTrack ? t.onTrack : t.offTrack}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.dailyGoal}</p>
                    <h3 className="text-2xl font-bold text-gray-900">-{metrics.dailyDeficitRequired} kcal</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <Flame className="h-5 w-5" />
                  </div>
                </div>
                 <p className="mt-2 text-xs text-gray-500">
                  {t.maxIntake}: {metrics.tdee - metrics.dailyDeficitRequired} kcal
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.balanceToday}</p>
                    <h3 className={`text-2xl font-bold ${netCalories < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {netCalories > 0 ? '+' : ''}{netCalories} kcal
                    </h3>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Utensils className="h-5 w-5" />
                  </div>
                </div>
                 <p className="mt-2 text-xs text-gray-500">
                  {t.intake}: {todayLog.caloriesIn} | {t.extraBurn}: {todayLog.caloriesBurnedExercise}
                </p>
              </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.waterToday}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{todayLog.waterIntake} L</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
                    <Droplets className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">{t.waterGoal}: ~2.5 L</p>
              </div>
            </div>

            {/* AI Advisor */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6" /> {t.aiAdvisor}
                </h2>
                <button 
                  onClick={handleGenerateAdvice}
                  disabled={loadingAdvice}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {loadingAdvice ? t.aiBtnLoading : t.aiBtn}
                </button>
              </div>
              {advice ? (
                <div className="prose prose-invert prose-sm max-w-none bg-black/10 p-4 rounded-lg">
                  <div className="whitespace-pre-line">{advice}</div>
                </div>
              ) : (
                <p className="text-indigo-100 text-sm">
                  {t.aiPlaceholder}
                </p>
              )}
            </div>

            {/* CHART 1: Weight Progress */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-600" /> {t.chartWeight}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      interval="preserveStartEnd"
                    />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <ReferenceLine y={data.profile.targetWeight} label={t.finalGoal} stroke="green" strokeDasharray="3 3" />
                    <WeekendReferenceLines />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      name={t.realWeight}
                      stroke="#10b981" 
                      strokeWidth={3} 
                      connectNulls={true}
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="basis" 
                      dataKey="expectedWeight" 
                      name={t.projected}
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: Calories Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" /> {t.chartCalories}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <WeekendReferenceLines />
                    <Bar dataKey="caloriesIn" name={t.intake} fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="caloriesBurned" name={t.totalBurn} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line type="monotone" dataKey="calorieGoal" name={t.limitGoal} stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CHART 3: Water Intake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cyan-500" /> {t.chartWater}
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} cursor={{fill: '#f3f4f6'}} />
                      <WeekendReferenceLines />
                      <Bar dataKey="water" name={t.colWater} fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CHART 4: Sleep */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-indigo-500" /> {t.chartSleep}
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 12]} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      <WeekendReferenceLines />
                      <Area type="monotone" dataKey="sleep" name={t.hours} stroke="#6366f1" fill="#818cf8" fillOpacity={0.2} connectNulls />
                      <ReferenceLine y={7} stroke="#6366f1" strokeDasharray="3 3" label={{ value: '7h', fill: '#6366f1', fontSize: 10 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'log' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
             <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
              <div>
                 <h2 className="text-xl font-bold text-gray-900">{t.dailyLogTitle}</h2>
                 <p className="text-gray-500 text-sm">{t.dailyLogSub}</p>
              </div>
              
              {/* DATE SELECTOR */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-300 shadow-sm hover:border-emerald-500 transition-colors cursor-pointer relative group">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <input 
                  type="date"
                  className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-32"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
             </div>
             
             <form onSubmit={handleLogSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.weightLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={todayLog.weight}
                        onChange={(e) => setTodayLog({...todayLog, weight: parseFloat(e.target.value)})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">kg</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.waterLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={todayLog.waterIntake}
                        onChange={(e) => setTodayLog({...todayLog, waterIntake: parseFloat(e.target.value)})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">L</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.caloriesLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={todayLog.caloriesIn}
                        onChange={(e) => setTodayLog({...todayLog, caloriesIn: parseInt(e.target.value)})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">kcal</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.exerciseLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={todayLog.caloriesBurnedExercise}
                        onChange={(e) => setTodayLog({...todayLog, caloriesBurnedExercise: parseInt(e.target.value)})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">kcal</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.sleepLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.5"
                        value={todayLog.sleepHours}
                        onChange={(e) => setTodayLog({...todayLog, sleepHours: parseFloat(e.target.value)})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">h</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.notesLabel}</label>
                  <textarea 
                    value={todayLog.notes || ''}
                    onChange={(e) => setTodayLog({...todayLog, notes: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder={t.notesPlaceholder}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">{t.daySummary} {formatDate(selectedDate, lang)}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.estimatedBalance}:</span>
                    <span className={`font-bold ${isDeficitMet ? 'text-green-600' : 'text-red-600'}`}>
                      {isDeficitMet ? t.deficitMet : t.deficitFailed}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <Save className="h-5 w-5" /> {t.save}
                </button>
             </form>
          </div>
        )}

        {/* SPREADSHEET TAB */}
        {activeTab === 'spreadsheet' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{t.spreadsheetTitle}</h2>
                <p className="text-xs text-gray-500">{t.spreadsheetSub}</p>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'date', label: t.colDate, width: 'w-32' },
                      { key: 'weight', label: t.colWeight, width: 'w-24' },
                      { key: 'caloriesIn', label: t.colCalIn, width: 'w-24' },
                      { key: 'caloriesBurnedExercise', label: t.colExercise, width: 'w-24' },
                      { key: 'waterIntake', label: t.colWater, width: 'w-24' },
                      { key: 'actions', label: t.colActions, width: 'w-16' }
                    ].map((col) => (
                      <th key={col.key} scope="col" className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${col.key === 'date' ? 'sticky left-0 bg-gray-50 z-20' : ''}`}>
                         {col.key !== 'actions' ? (
                           <div className="flex flex-col gap-2">
                             <div 
                               className="flex items-center justify-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors"
                               onClick={() => handleSort(col.key)}
                             >
                               {col.label}
                               <ArrowUpDown className={`h-3 w-3 ${sortConfig.key === col.key ? 'text-emerald-600' : 'text-gray-300'}`} />
                             </div>
                             <div className="relative">
                               <input 
                                 type="text" 
                                 placeholder={t.filter}
                                 className="w-full text-xs p-1 border border-gray-300 rounded focus:border-emerald-500 outline-none font-normal"
                                 value={filters[col.key] || ''}
                                 onChange={(e) => handleFilterChange(col.key, e.target.value)}
                               />
                               {filters[col.key] && (
                                 <button 
                                  onClick={() => handleFilterChange(col.key, '')}
                                  className="absolute right-1 top-1 text-gray-400 hover:text-red-500"
                                 >
                                   <X className="h-3 w-3" />
                                 </button>
                               )}
                             </div>
                           </div>
                         ) : (
                           <span>{col.label}</span>
                         )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Fixed Add Row */}
                  <NewEntryRow onAdd={onUpdateLog} />
                  
                  {/* Data Rows */}
                  {spreadsheetRows.map((row) => (
                    <SpreadsheetRow 
                      key={row.date} 
                      row={row} 
                      onSave={onUpdateLog} 
                      onDelete={onDeleteLog}
                      lang={lang}
                    />
                  ))}
                  
                  {spreadsheetRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                        {t.noRecords}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.management}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5" /> {t.export}
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full"
                  >
                    <PlusCircle className="h-5 w-5" /> Importar Backup
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                 <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                   <PlayCircle className="h-4 w-4" /> {t.demoMode}
                 </h3>
                 <p className="text-sm text-blue-700 mb-3">
                   {t.demoText}
                 </p>
                 <button 
                   onClick={onDemoLoad}
                   className="text-sm text-blue-800 underline hover:text-blue-900 font-medium"
                 >
                   {t.loadDemo}
                 </button>
               </div>

              <h2 className="text-xl font-bold text-red-600 mb-2">{t.dangerZone}</h2>
              <p className="text-gray-500 text-sm mb-4">{t.deleteWarning}</p>
              <button
                onClick={() => {
                  if (window.confirm(t.confirmReset)) {
                    onReset();
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 w-full"
              >
                <Trash2 className="h-5 w-5" /> {t.reset}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function calculateDaysRemaining(targetDate: string): number {
  const diff = new Date(targetDate).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
}

export default Dashboard;