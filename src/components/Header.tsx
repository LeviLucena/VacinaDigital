import { Syringe } from "lucide-react";

export function Header() {
  return (
    <header className="gov-gradient text-primary-foreground shadow-elevated no-print">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10">
            <Syringe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Digitalização de Caderneta de Vacinação
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Ministério da Saúde
            </p>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-gov-green via-gov-yellow to-gov-green" />
    </header>
  );
}
