import '@/index.css';

export default function Teste() {
  return (
    /* 1. h-[100dvh]: Garante 100% da altura da tela (dynamic viewport height).
      2. w-full: Garante largura total.
      3. items-center justify-center: Centralização absoluta (Vertical e Horizontal).
      4. p-4: Padding de segurança para telas pequenas (Mobile First).
    */
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[hsl(var(--background))] p-6">
      
      {/* MAX-W-MD: Define uma largura máxima legível (UX Rule).
        SHADOW-2XL: Adiciona profundidade (UI Elevation).
      */}
      <div className="w-full max-w-md card-dark shadow-2xl transition-all">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">
            Emagrac<span className="text-accent">.ia</span>
          </h1>
          <p className="mt-4 text-balance text-slate-200">
            O motor de renderização e o Tailwind estão operacionais. Agora com centralização absoluta e espaçamento otimizado.
          </p>
        </header>

        <div className="mt-8 flex justify-center">
           {/* Placeholder para o futuro componente Button do Shadcn */}
           <div className="h-12 w-full rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
             Acessar Dashboard
           </div>
        </div>
      </div>
    </div>
  );
}