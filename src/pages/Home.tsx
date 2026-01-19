//IMPORTS DESABILITADOS PARA TESTAR O IMPORT GLOBAL
//import React from 'react'
//import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
//import { useNavigate } from 'react-router-dom';
//import '../index.css' //


//IMPORT GLOBAL
import { useApp } from '../hooks/useApp';


export default function Home() {
  const { navigate } = useApp();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold text-emerald-400 mb-4">Emagrac.ia</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Sua inteligência para controle de peso e saúde.
      </p>
      <button 
        onClick={() => navigate('/calculate')}
        className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-full font-bold transition-all"
      >
        Começar Agora
      </button>
    </div>
  );
}