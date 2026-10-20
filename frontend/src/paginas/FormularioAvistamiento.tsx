/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { MensajeEstado } from "../componentes/MensajeEstado";
import { AvistamientoFormulario, Criatura } from "../tipos";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <MensajeEstado variant="cargando" message="cargando formulario..." />;

  return (
    <main className="pagina section">
      <section className="formulario-hoja box">
        <header className="formulario-hoja__header">
          <p className="eyebrow">&gt; reporte de campo</p>
          <h1>Reporte de campo</h1>
        </header>

        {error && <div className="mensaje-alerta" role="alert">{error}</div>}

        <form className="formulario" onSubmit={manejarEnvio}>
          <div className="campo field">
            <label className="label" htmlFor="criatura">Criatura</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="criatura"
                  className="input-terminal"
                  value={form.criatura}
                  onChange={(e) => setForm({ ...form, criatura: e.target.value })}
                >
                  {criaturas.map((criatura) => (
                    <option key={criatura._id} value={criatura._id}>
                      {criatura.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="campo field">
            <label className="label" htmlFor="testigo">Testigo</label>
            <div className="control">
              <input
                id="testigo"
                className="input input-terminal"
                type="text"
                value={form.testigo}
                onChange={(e) => setForm({ ...form, testigo: e.target.value })}
              />
            </div>
          </div>

          <div className="campo field">
            <label className="label" htmlFor="ubicacion">Ubicación</label>
            <div className="control">
              <input
                id="ubicacion"
                className="input input-terminal"
                type="text"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              />
            </div>
          </div>

          <div className="campo field">
            <label className="label" htmlFor="fecha">Fecha</label>
            <div className="control">
              <input
                id="fecha"
                className="input input-terminal"
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
          </div>

          <div className="campo field">
            <label className="label" htmlFor="descripcion">Descripción (opcional)</label>
            <div className="control">
              <input
                id="descripcion"
                className="input input-terminal"
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
          </div>

          <div className="formulario__acciones buttons">
            <button type="submit" className="button" disabled={guardando}>
              {guardando ? "Guardando..." : "Registrar avistamiento"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
