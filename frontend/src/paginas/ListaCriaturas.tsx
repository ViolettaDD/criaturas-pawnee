/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas en una <table> de
 * HTML plano, sin ninguna clase de CSS. Maneja los 3 estados: loading,
 * error y empty.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { InsigniaEstado } from "../componentes/InsigniaEstado";
import { InsigniaTipo } from "../componentes/InsigniaTipo";
import { MedidorPeligro } from "../componentes/MedidorPeligro";
import { MensajeEstado } from "../componentes/MensajeEstado";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <main className="pagina section">
      <header className="cabecera-pagina">
        <div>
          <p className="eyebrow">&gt; bestiario</p>
          <h1>El Bestiario</h1>
        </div>

        <div className="cabecera-pagina__acciones buttons">
          <Link className="boton-link button" to="/criaturas/nueva">
            + Nueva criatura
          </Link>
          <Link className="boton-link boton-link--ghost button" to="/avistamientos">
            Ver avistamientos
          </Link>
        </div>
      </header>

      <section className="panel-terminal panel-tono box">
        <label htmlFor="filtro-tipo">&gt; filtrar --tipo</label>
        <div className="control select-terminal">
          <div className="select is-fullwidth">
            <select
              id="filtro-tipo"
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_CRIATURA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {cargando && <MensajeEstado variant="cargando" message="cargando expedientes..." />}
      {!cargando && error && <MensajeEstado variant="error" errorMessage={error} />}
      {!cargando && !error && criaturas.length === 0 && <MensajeEstado variant="vacio" message="Aquí no hay nada... por ahora 👀" />}

      {!cargando && !error && criaturas.length > 0 && (
        <ul className="lista-criaturas columns is-multiline is-variable is-4">
          {criaturas.map((criatura) => (
            <li key={criatura._id} className="column is-6-tablet is-4-desktop">
              <article className="tarjeta-criatura card">
                <div className="card-content">
                  <div className="tarjeta-criatura__header">
                    <h2>{criatura.nombre}</h2>
                    <InsigniaTipo tipo={criatura.tipo} />
                  </div>

                  <div className="tarjeta-criatura__meta">
                    <MedidorPeligro nivel={criatura.nivelPeligro} />
                    <InsigniaEstado estado={criatura.estado} />
                  </div>

                  <div className="tarjeta-criatura__acciones buttons">
                    <Link className="button" to={`/criaturas/${criatura._id}`}>Ver</Link>
                    <Link className="button" to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
