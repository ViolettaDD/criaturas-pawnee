import { TipoCriatura } from "../tipos";
import { etiquetasTipo } from "../utilidades/etiquetas";

type InsigniaTipoProps = {
  tipo: TipoCriatura;
};

export function InsigniaTipo({ tipo }: InsigniaTipoProps) {
  const { etiqueta } = etiquetasTipo[tipo];

  return (
    <span className={`insignia insignia--tipo insignia--${tipo}`} aria-label={`Tipo ${etiqueta}`}>
      {etiqueta}
    </span>
  );
}
