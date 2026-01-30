//IMPORTS DESABILITADOS PARA TESTAR O IMPORT GLOBAL
//import React from 'react'
//import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
//import { useNavigate } from 'react-router-dom';
//import '../index.css' //
import '../index.css'
import { useApp } from '@/hooks/useApp';


import { Footer } from '@/components/landing/Footer';
import { TopHeader } from '@/components/landing/TopHeader';
import { FeaturesSection } from '@/components/landing/FeaturesSection';

export default function Home() {
  const { navigate } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-white">
      <TopHeader />

      <main className="flex-grow flex flex-col items-center justify-center">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 w-full flex flex-col items-center">
          <div className="card-dark shadow-xl/40 backdrop-blur-md max-w-2xl w-full text-white text-center px-6 py-10">
            <span className="text-legend mb-6 inline-block">Versão 0.0.5</span>
            <h1 className="text-h1 mb-6">Sua saúde guiada por IA.</h1>
            <p className="text-p mb-10 max-w-2xl mx-auto">
              A maneira mais inteligente de calcular sua taxa metabólica.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/calculate')} className="btn-primary px-10 py-4 text-xl">
                Começar Agora
              </button>
              <button className="btn-secondary px-8 py-4 text-lg">
                Saber mais
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}