import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
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