type MensajeEstadoProps = {
  variant: "cargando" | "error" | "vacio";
  message?: string;
  errorMessage?: string;
};

export function MensajeEstado({ variant, message, errorMessage }: MensajeEstadoProps) {
  if (variant === "cargando") {
    return (
      <div className="estado-panel estado-panel--cargando" role="status" aria-live="polite">
        <span className="prompt">&gt; {message ?? "cargando expedientes..."}</span>
        <span className="cursor" aria-hidden="true" />
      </div>
    );
  }

  if (variant === "error") {
    return (
      <div className="estado-panel estado-panel--error" role="alert">
        <strong>¡Error de conexión!</strong>
        <span>{errorMessage ?? message}</span>
      </div>
    );
  }

  return (
    <div className="estado-panel estado-panel--vacio" role="status" aria-live="polite">
      <span>{message ?? "Aquí no hay nada... por ahora 👀"}</span>
    </div>
  );
}
