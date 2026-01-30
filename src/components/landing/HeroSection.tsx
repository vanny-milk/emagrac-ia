import { useApp } from '@/hooks/useApp';

export function HeroSection() {
  const { navigate } = useApp();
  return (
    <section className="pt-32 pb-20 text-center container mx-auto px-6 flex flex-col items-center">
      <span className="text-legend mb-6 inline-block">Inteligência Nutricional</span>
      <h1 className="text-h1 mb-6">Sua saúde guiada por IA.</h1>
      <p className="text-p mb-10 max-w-2xl mx-auto">
        A maneira mais inteligente de calcular sua taxa metabólica basal e planejar sua evolução física com precisão científica.
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={() => navigate('/calculate')} className="btn-primary px-10 py-4 text-xl">
          Começar Agora
        </button>
      </div>
    </section>
  );
}
