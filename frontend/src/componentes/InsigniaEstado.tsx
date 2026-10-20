import { EstadoInvestigacion } from "../tipos";
import { etiquetasEstado } from "../utilidades/etiquetas";

type InsigniaEstadoProps = {
  estado: EstadoInvestigacion;
};

export function InsigniaEstado({ estado }: InsigniaEstadoProps) {
  const { etiqueta } = etiquetasEstado[estado];

  return (
    <span className={`insignia insignia--estado insignia--${estado}`} aria-label={`Estado ${etiqueta}`}>
      {etiqueta}
    </span>
  );
}
