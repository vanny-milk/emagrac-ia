export default function Dashboard() {
  return (
    <div className="p-8 bg-[hsl(var(--background))] min-h-screen flex items-center justify-center">
      <div className="card-dark shadow-xl/40 backdrop-blur-md max-w-lg w-full text-white text-center">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">Seu Progresso</h2>
        <p>Aqui mostraremos a TMB e os gráficos.</p>
      </div>
    </div>
  );
}