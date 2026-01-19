import { useNavigate } from 'react-router-dom';

export default function Calculate() {
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Ficha do Usuário</h2>
      <p className="mb-8">Aqui virá o seu formulário...</p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 px-6 py-2 rounded"
      >
        Ir para Dashboard
      </button>
    </div>
  );
}