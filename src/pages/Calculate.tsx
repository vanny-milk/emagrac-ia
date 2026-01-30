import { useNavigate } from 'react-router-dom';

export default function Calculate() {
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-[hsl(var(--background))] min-h-screen flex items-center justify-center">
      <div className="card-dark shadow-xl/40 backdrop-blur-md max-w-lg w-full text-white text-center">
        <h2 className="text-2xl font-bold mb-6">Ficha do Usuário</h2>
        <p className="mb-8">Aqui virá o seu formulário...</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-sky-500 text-white px-6 py-2 rounded shadow"
        >
          Ir para Dashboard
        </button>
      </div>
    </div>
  );
}