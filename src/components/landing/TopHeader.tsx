import { useApp } from '@/hooks/useApp';

const menu = [
  { label: 'Início', path: '/' },
  { label: 'Funcionalidades', path: '#features' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Calcular', path: '/calculate' },
];

export function TopHeader() {
  const { navigate } = useApp();
  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md z-50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950">E</div>
        <span className="text-xl font-bold tracking-tighter">Emagrac.ia</span>
      </div>
      <div className="flex gap-2 md:gap-4 items-center">
        {menu.map((item) => (
          item.path.startsWith('#') ? (
            <a
              key={item.label}
              href={item.path}
              className="text-white/80 hover:text-accent font-medium px-2 py-1 transition-colors duration-150"
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="bg-transparent text-white/80 hover:text-accent font-medium px-2 py-1 transition-colors duration-150"
              style={{ border: 'none', background: 'none' }}
            >
              {item.label}
            </button>
          )
        ))}
        <button onClick={() => navigate('/calculate')} className="btn-primary py-2 px-6 text-sm ml-2">
          Entrar
        </button>
      </div>
    </nav>
  );
}