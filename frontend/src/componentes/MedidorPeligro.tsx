type MedidorPeligroProps = {
  nivel: number;
};

function colorSegmento(indice: number): string {
  const hue = 120 - (indice / 9) * 120;
  return `hsl(${hue} 78% 58%)`;
}

export function MedidorPeligro({ nivel }: MedidorPeligroProps) {
  const valor = Math.min(10, Math.max(1, nivel));
  const variante = valor <= 3 ? "bajo" : valor <= 7 ? "medio" : "alto";

  return (
    <div className={`medidor-peligro medidor-peligro--${variante}`} role="img" aria-label={`Nivel de peligro ${valor} de 10`}>
      <div className="medidor-segmentos" aria-hidden="true">
        {Array.from({ length: 10 }, (_, indice) => (
          <span
            key={indice}
            className={indice < valor ? "segmento activo" : "segmento"}
            style={
              indice < valor
                ? { background: colorSegmento(indice), boxShadow: "0 0 8px rgba(255,255,255,0.15)" }
                : undefined
            }
          />
        ))}
      </div>
      <span className="medidor-valor">{valor}/10</span>
    </div>
  );
}
