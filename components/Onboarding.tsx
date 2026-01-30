import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, AppState, Language } from '../types';
import { translations } from '../utils/i18n';
import { Target, Activity, Calendar, User as UserIcon, Upload, PlayCircle, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onImport: (data: AppState) => void;
  onDemoLoad: () => void;
  lang: Language;
}

const Onboarding: React.FC<Props> = ({ onComplete, onImport, onDemoLoad, lang }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.Male,
    activityLevel: ActivityLevel.Sedentary,
    startDate: new Date().toISOString().split('T')[0]
  });

  const t = translations[lang].onboarding;
  const tApp = translations[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.height && formData.currentWeight && formData.targetWeight && formData.targetDate) {
      onComplete(formData as UserProfile);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsedData = JSON.parse(event.target.result as string);
            onImport(parsedData);
          }
        } catch (err) {
          alert("Erro ao ler arquivo JSON");
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-emerald-500" />
            {tApp.appTitle}
          </h1>
          <p className="text-gray-500">{tApp.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.name}</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.age}</label>
                <input
                  type="number"
                  name="age"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.gender}</label>
                <select
                  name="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value={Gender.Male}>{t.male}</option>
                  <option value={Gender.Female}>{t.female}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.height}</label>
                <input
                  type="number"
                  name="height"
                  required
                  placeholder="Ex: 175"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.bodyFat}</label>
                <input
                  type="number"
                  name="bodyFatPercentage"
                  placeholder="Ex: 20"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                {t.goals}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700">{t.currentWeight}</label>
                  <input
                    type="number"
                    step="0.1"
                    name="currentWeight"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    onChange={handleNumberChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.targetWeight}</label>
                  <input
                    type="number"
                    step="0.1"
                    name="targetWeight"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    onChange={handleNumberChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{t.activityLevel}</label>
                <select
                  name="activityLevel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  onChange={(e) => setFormData({...formData, activityLevel: Number(e.target.value)})}
                  value={formData.activityLevel}
                >
                  <option value={ActivityLevel.Sedentary}>{t.sedentary}</option>
                  <option value={ActivityLevel.LightlyActive}>{t.light}</option>
                  <option value={ActivityLevel.ModeratelyActive}>{t.moderate}</option>
                  <option value={ActivityLevel.VeryActive}>{t.active}</option>
                  <option value={ActivityLevel.ExtraActive}>{t.extraActive}</option>
                </select>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">{t.targetDate}</label>
                 <input
                    type="date"
                    name="targetDate"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    onChange={handleChange}
                  />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            {t.createPlan}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
           <div className="text-center">
             <p className="text-xs text-gray-500 mb-2">{t.alreadyUser}</p>
             <label className="cursor-pointer w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
               <Upload className="h-4 w-4" />
               {t.import}
               <input 
                 type="file" 
                 accept=".json"
                 className="hidden" 
                 onChange={handleImportFile}
               />
             </label>
           </div>

           <div className="text-center">
              <button 
                type="button"
                onClick={onDemoLoad}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                {t.demo}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;