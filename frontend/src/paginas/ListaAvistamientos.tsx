/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { MensajeEstado } from "../componentes/MensajeEstado";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <main className="pagina section">
      <header className="cabecera-pagina">
        <div>
          <p className="eyebrow">&gt; bitácora</p>
          <h1>Bitácora de reportes</h1>
        </div>

        <div className="cabecera-pagina__acciones buttons">
          <Link className="boton-link boton-link--ghost button" to="/">
            Volver a criaturas
          </Link>
          <Link className="boton-link button" to="/avistamientos/nuevo">
            Registrar avistamiento nuevo
          </Link>
        </div>
      </header>

      {cargando && <MensajeEstado variant="cargando" message="cargando reportes..." />}
      {!cargando && error && <MensajeEstado variant="error" errorMessage={error} />}
      {!cargando && !error && avistamientos.length === 0 && <MensajeEstado variant="vacio" message="Todavía no hay avistamientos registrados." />}

      {!cargando && !error && avistamientos.length > 0 && (
        <ul className="lista-avistamientos">
          {avistamientos.map((avistamiento) => (
            <li key={avistamiento._id} className="avistamiento-item box">
              <div className="avistamiento-item__fecha">{avistamiento.fecha.slice(0, 10)}</div>

              <div className="avistamiento-item__meta">
                <strong>
                  <Link to={`/criaturas/${avistamiento.criatura._id}`}>{avistamiento.criatura.nombre}</Link>
                </strong>
                <span>👤 {avistamiento.testigo}</span>
                <span>📍 {avistamiento.ubicacion}</span>
                {avistamiento.descripcion ? <p>{avistamiento.descripcion}</p> : null}
              </div>

              <div className="avistamiento-item__action">
                <button type="button" className="button" onClick={() => manejarEliminar(avistamiento._id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
