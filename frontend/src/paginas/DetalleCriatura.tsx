/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { InsigniaEstado } from "../componentes/InsigniaEstado";
import { InsigniaTipo } from "../componentes/InsigniaTipo";
import { MedidorPeligro } from "../componentes/MedidorPeligro";
import { MensajeEstado } from "../componentes/MensajeEstado";
import { Sello } from "../componentes/Sello";
import { Criatura } from "../tipos";

interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) return <MensajeEstado variant="cargando" message="cargando expediente..." />;
  if (error) return <MensajeEstado variant="error" errorMessage={error} />;
  if (!criatura) return <MensajeEstado variant="vacio" message="No se encontró la criatura." />;

  return (
    <main className="pagina section">
      <section className="expediente box">
        <div className="expediente-header">
          <div>
            <p className="eyebrow">&gt; expediente</p>
            <h1>{criatura.nombre}</h1>
            <p className="codigo-expediente">EXPEDIENTE Nº {criatura._id.slice(-6).toUpperCase()}</p>
          </div>
          <Sello texto={criatura.estado.toUpperCase().replace("_", " ")} clase="sello--estado" />
        </div>

        <div className="ficha-grid columns is-multiline">
          <div className="column is-4-desktop is-12-mobile">
          <div className="ficha-item">
            <span className="ficha-item__label">Tipo</span>
            <InsigniaTipo tipo={criatura.tipo} />
          </div>
          </div>

          <div className="column is-4-desktop is-12-mobile">
          <div className="ficha-item">
            <span className="ficha-item__label">Peligro</span>
            <MedidorPeligro nivel={criatura.nivelPeligro} />
          </div>
          </div>

          <div className="column is-4-desktop is-12-mobile">
          <div className="ficha-item">
            <span className="ficha-item__label">Estado</span>
            <InsigniaEstado estado={criatura.estado} />
          </div>
          </div>
        </div>

        <div className="habilidades-panel">
          <h3>Habilidades</h3>

          {criatura.habilidades.length > 0 ? (
            <ul className="lista-habilidades">
              {criatura.habilidades.map((habilidad) => (
                <li key={habilidad}>{habilidad}</li>
              ))}
            </ul>
          ) : (
            <p>(ninguna registrada)</p>
          )}
        </div>

        <div className="acciones-compactas buttons mt-1">
          <Link className="boton-link button" to={`/criaturas/${criatura._id}/editar`}>
            Editar
          </Link>
          <button type="button" className="boton-link boton-link--peligro button" onClick={manejarEliminar}>
            Eliminar
          </button>
        </div>

        <section className="bitacora-panel mt-2">
          <h2>Bitácora de campo</h2>

          <p>
            <Link className="boton-link boton-link--ghost button" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>
              Registrar un avistamiento de esta criatura
            </Link>
          </p>

          {avistamientos.length === 0 ? (
            <MensajeEstado variant="vacio" message="Todavía no hay avistamientos registrados para esta criatura." />
          ) : (
            <ul className="bitacora-lista">
              {avistamientos.map((avistamiento) => (
                <li className="bitacora-item" key={avistamiento._id}>
                  <div className="bitacora-item__fecha">{avistamiento.fecha.slice(0, 10)}</div>
                  <div className="bitacora-item__dato">
                    <strong>{avistamiento.testigo}</strong>
                    <span>📍 {avistamiento.ubicacion}</span>
                    {avistamiento.descripcion ? <p>{avistamiento.descripcion}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
