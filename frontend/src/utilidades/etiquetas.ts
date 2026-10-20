import { EstadoInvestigacion, TipoCriatura } from "../tipos";

export const etiquetasTipo: Record<TipoCriatura, { etiqueta: string }> = {
  mitica: { etiqueta: "Mítica" },
  elemental: { etiqueta: "Elemental" },
  mecanica: { etiqueta: "Mecánica" },
  espectral: { etiqueta: "Espectral" },
};

export const etiquetasEstado: Record<EstadoInvestigacion, { etiqueta: string }> = {
  activa: { etiqueta: "Activa" },
  en_investigacion: { etiqueta: "En investigación" },
  descartada: { etiqueta: "Descartada" },
};
