import React, { useEffect, useState } from 'react';
import {
  getAlumnos, getMaterias, getTodasLasNotas, createNota, updateNota,
  createAlumno, updateAlumno, deleteAlumno,
  createMateria, updateMateria, deleteMateria
} from './services/api';
import { Alumno, Materia, Nota } from './types';
import GradeCell from './components/GradeCell';
import Swal from 'sweetalert2';
import './styles/App.css';

const App: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  // Actualizamos los tipos de pestañas
  const [tabActual, setTabActual] = useState<'matriz' | 'alumnos' | 'materias' | 'detalles'>('matriz');

  const [idBusquedaAlumno, setIdBusquedaAlumno] = useState('');
  const [idBusquedaMateria, setIdBusquedaMateria] = useState('');

  // Estado para la información que se mostrará en la pestaña de detalles
  const [entidadDetalle, setEntidadDetalle] = useState<{ tipo: 'alumno' | 'materia', data: any } | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [alumnosRes, materiasRes, notasRes] = await Promise.all([
        getAlumnos(), getMaterias(), getTodasLasNotas()
      ]);
      setAlumnos(alumnosRes.data);
      setMaterias(materiasRes.data);
      setNotas(notasRes.data);
    } catch (error) {
      console.error("Error cargando la matriz", error);
    }
  };

  // Lógica de búsqueda: Ahora redirige a la pestaña 'detalles'
  const handleSearchAlumno = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // IMPORTANTE: Evita que el navegador recargue
      if (idBusquedaAlumno) {
        const found = alumnos.find(a => a.id === parseInt(idBusquedaAlumno));
        if (found) {
          setEntidadDetalle({ tipo: 'alumno', data: found });
          setTabActual('detalles');
        } else {
          Swal.fire('No encontrado', 'El ID del alumno no existe', 'error');
        }
        setIdBusquedaAlumno('');
      }
    }
  };

  const handleSearchMateria = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // IMPORTANTE: Evita que el navegador recargue
      if (idBusquedaMateria) {
        const found = materias.find(m => m.id === parseInt(idBusquedaMateria));
        if (found) {
          setEntidadDetalle({ tipo: 'materia', data: found });
          setTabActual('detalles');
        } else {
          Swal.fire('No encontrado', 'El ID de la materia no existe', 'error');
        }
        setIdBusquedaMateria('');
      }
    }
  };

  // --- MODALES CRUD ---
  const abrirModalAlumno = async (alumno?: Alumno) => {
    const isEdit = !!alumno;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Alumno' : 'Nuevo Alumno',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${alumno?.nombre || ''}">
        <input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${alumno?.apellido || ''}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${alumno?.email || ''}">
        <input id="swal-fecha" class="swal2-input" type="date" value="${alumno?.fechaNacimiento || ''}">
      `,
      preConfirm: () => {
        return {
          nombre: (document.getElementById('swal-nombre') as HTMLInputElement).value,
          apellido: (document.getElementById('swal-apellido') as HTMLInputElement).value,
          email: (document.getElementById('swal-email') as HTMLInputElement).value,
          fechaNacimiento: (document.getElementById('swal-fecha') as HTMLInputElement).value
        }
      }
    });
    if (formValues) {
      try {
        if (isEdit) await updateAlumno(alumno!.id, { ...alumno, ...formValues });
        else await createAlumno(formValues);
        cargarDatos();
      } catch (e) { Swal.fire('Error', 'No se pudo guardar', 'error'); }
    }
  };

  const abrirModalMateria = async (materia?: Materia) => {
    const isEdit = !!materia;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Materia' : 'Nueva Materia',
      html: `
        <input id="swal-mat-nombre" class="swal2-input" placeholder="Nombre" value="${materia?.nombre || ''}">
        <input id="swal-mat-codigo" class="swal2-input" placeholder="Código" value="${materia?.codigo || ''}">
        <input id="swal-mat-creditos" class="swal2-input" type="number" placeholder="Créditos" value="${materia?.creditos || ''}">
      `,
      preConfirm: () => {
        return {
          nombre: (document.getElementById('swal-mat-nombre') as HTMLInputElement).value,
          codigo: (document.getElementById('swal-mat-codigo') as HTMLInputElement).value,
          creditos: parseInt((document.getElementById('swal-mat-creditos') as HTMLInputElement).value)
        }
      }
    });
    if (formValues) {
      try {
        if (isEdit) await updateMateria(materia!.id, { ...materia, ...formValues });
        else await createMateria(formValues);
        cargarDatos();
      } catch (e) { Swal.fire('Error', 'No se pudo guardar', 'error'); }
    }
  };

  const handleSaveNota = async (alumnoId: number, materiaId: number, valor: number, notaId?: number) => {
    const payload = { valor, fechaRegistro: new Date().toISOString().split('T')[0], alumno: { id: alumnoId } as Alumno, materia: { id: materiaId } as Materia };
    try {
      if (notaId) await updateNota(notaId, payload);
      else await createNota(payload);
      cargarDatos();
    } catch (e) { Swal.fire('Error', 'No se guardó la nota', 'error'); }
  };

  return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">Gestión Académica</h1>
            <nav className="app-nav">
              <button className={tabActual === 'matriz' ? 'active' : ''} onClick={() => setTabActual('matriz')}>Matriz</button>
              <button className={tabActual === 'alumnos' ? 'active' : ''} onClick={() => setTabActual('alumnos')}>Alumnos</button>
              <button className={tabActual === 'materias' ? 'active' : ''} onClick={() => setTabActual('materias')}>Materias</button>
              {entidadDetalle && (
                  <button className={tabActual === 'detalles' ? 'active' : ''} onClick={() => setTabActual('detalles')}>🔎 Vista Detalle</button>
              )}
            </nav>
          </div>

          <div className="header-right">
            <div className="search-group">
              <div className="search-box">
                <span className="search-label">ID Estudiante</span>
                <input
                    type="number" placeholder="Enter..."
                    value={idBusquedaAlumno}
                    onChange={(e) => setIdBusquedaAlumno(e.target.value)}
                    onKeyDown={handleSearchAlumno}
                />
              </div>
              <div className="search-box">
                <span className="search-label">ID Materia</span>
                <input
                    type="number" placeholder="Enter..."
                    value={idBusquedaMateria}
                    onChange={(e) => setIdBusquedaMateria(e.target.value)}
                    onKeyDown={handleSearchMateria}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">
          {tabActual === 'matriz' && (
              <div className="matrix-wrapper">
                <table className="matrix-table">
                  <thead>
                  <tr>
                    <th>Estudiante</th>
                    {materias.map(m => (
                        <th key={m.id}>
                          <div className="subject-name">{m.nombre}</div>
                          <div className="subject-detail">(id={m.id} codigo={m.codigo} creditos={m.creditos})</div>
                        </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {alumnos.map(a => (
                      <tr key={a.id}>
                        <td className="student-cell">
                          <span className="student-id-label">ID: {a.id}</span>
                          <span className="student-name-text">{a.nombre} {a.apellido}</span>
                        </td>
                        {materias.map(m => {
                          const nota = notas.find(n => n.alumno?.id === a.id && n.materia?.id === m.id);
                          return (
                              <td key={m.id}>
                                <GradeCell alumnoId={a.id} materiaId={m.id} notaExistente={nota} onSave={handleSaveNota} />
                              </td>
                          );
                        })}
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {tabActual === 'alumnos' && (
              <div className="view-container">
                <div className="view-header">
                  <h2>Listado de Estudiantes</h2>
                  <button className="btn-main" onClick={() => abrirModalAlumno()}>+ Nuevo Alumno</button>
                </div>
                <table className="data-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Fecha Nacimiento</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  {alumnos.map(a => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.nombre} {a.apellido}</td>
                        <td>{a.email}</td>
                        <td>{a.fechaNacimiento}</td>
                        <td>
                          <button className="icon-btn" onClick={() => abrirModalAlumno(a)}>✏️</button>
                          <button className="icon-btn" onClick={() => deleteAlumno(a.id).then(cargarDatos)}>🗑️</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {tabActual === 'materias' && (
              <div className="view-container">
                <div className="view-header">
                  <h2>Listado de Materias</h2>
                  <button className="btn-main" onClick={() => abrirModalMateria()}>+ Nueva Materia</button>
                </div>
                <table className="data-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Créditos</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  {materias.map(m => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.codigo}</td>
                        <td>{m.nombre}</td>
                        <td>{m.creditos}</td>
                        <td>
                          <button className="icon-btn" onClick={() => abrirModalMateria(m)}>✏️</button>
                          <button className="icon-btn" onClick={() => deleteMateria(m.id).then(cargarDatos)}>🗑️</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {/* --- VISTA DE DETALLE (NUEVA VENTANA) --- */}
          {tabActual === 'detalles' && entidadDetalle && (
              <div className="view-container detail-view">
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-badge">{entidadDetalle.tipo.toUpperCase()}</span>
                    <h2>Información Detallada del Registro</h2>
                  </div>
                  <hr />
                  <div className="detail-content">
                    {entidadDetalle.tipo === 'alumno' ? (
                        <div className="info-grid">
                          <div className="info-item"><span>ID de Registro:</span> <p>{entidadDetalle.data.id}</p></div>
                          <div className="info-item"><span>Nombre Completo:</span> <p>{entidadDetalle.data.nombre} {entidadDetalle.data.apellido}</p></div>
                          <div className="info-item"><span>Correo Institucional:</span> <p>{entidadDetalle.data.email}</p></div>
                          <div className="info-item"><span>Fecha de Nacimiento:</span> <p>{entidadDetalle.data.fechaNacimiento}</p></div>
                        </div>
                    ) : (
                        <div className="info-grid">
                          <div className="info-item"><span>ID de Registro:</span> <p>{entidadDetalle.data.id}</p></div>
                          <div className="info-item"><span>Código de Materia:</span> <p>{entidadDetalle.data.codigo}</p></div>
                          <div className="info-item"><span>Nombre de Asignatura:</span> <p>{entidadDetalle.data.nombre}</p></div>
                          <div className="info-item"><span>Créditos Académicos:</span> <p>{entidadDetalle.data.creditos}</p></div>
                        </div>
                    )}
                  </div>
                  <div className="detail-footer">
                    <button className="btn-main" onClick={() => setTabActual('matriz')}>Volver a la Matriz</button>
                  </div>
                </div>
              </div>
          )}
        </main>
      </div>
  );
};

export default App;