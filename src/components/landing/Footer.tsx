export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-6 px-10">
      <p className="text-slate-500 text-sm">© 2026 Emagrac.ia. Todos os direitos reservados.</p>
      <div className="flex gap-6 text-xs text-slate-500 font-medium">
        <a href="#" className="hover:text-white underline underline-offset-4">Termos de Uso</a>
        <a href="#" className="hover:text-white underline underline-offset-4">Política de Privacidade</a>
      </div>
    </footer>
  );
}