import { ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle2 size={36} className="mx-auto text-accent mb-3" />, // Precisão
      title: "Precisão",
      desc: "Cálculos baseados em protocolos médicos validados."
    },
    {
      icon: <ShieldCheck size={36} className="mx-auto text-accent mb-3" />, // Segurança
      title: "Segurança",
      desc: "Seus dados são processados localmente e com total privacidade."
    },
    {
      icon: <BarChart3 size={36} className="mx-auto text-accent mb-3" />, // Insights
      title: "Insights",
      desc: "Visualize sua jornada através de dashboards inteligentes."
    }
  ];
  return (
    <section id="features" className="bg-transparent py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-dark flex flex-col items-center justify-center shadow-xl/40 backdrop-blur-md h-full min-h-[220px] w-full md:w-1/3"
            >
              {f.icon}
              <h3 className="text-h2 text-xl font-bold mb-2 mt-1">{f.title}</h3>
              <p className="text-p text-base text-muted max-w-xs mx-auto">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}