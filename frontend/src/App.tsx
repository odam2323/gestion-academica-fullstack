import React, { useEffect, useState } from 'react';
import {
  getAlumnos, getMaterias, getTodasLasNotas, createNota, updateNota,
  createAlumno, updateAlumno, deleteAlumno,
  createMateria, updateMateria, deleteMateria
} from './services/api';
import { Alumno, Materia, Nota } from './types';
import GradeCell from './components/GradeCell';
import Swal from 'sweetalert2';
import './App.css';

const App: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

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


  const abrirModalAlumno = async (alumno?: Alumno) => {
    const isEdit = !!alumno;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Alumno' : 'Nuevo Alumno',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${alumno?.nombre || ''}">
        <input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${alumno?.apellido || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value;
        const apellido = (document.getElementById('swal-apellido') as HTMLInputElement).value;
        if (!nombre || !apellido) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
        }
        return { nombre, apellido };
      }
    });

    if (formValues) {
      try {
        if (isEdit) {
          await updateAlumno(alumno!.id, { ...alumno, ...formValues });
        } else {
          await createAlumno({ ...formValues, email: 'temp@mail.com', fechaNacimiento: '2000-01-01' });
        }
        cargarDatos();
        Swal.fire({ icon: 'success', title: 'Guardado', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      } catch (e) {
        Swal.fire('Error', 'No se pudo guardar el alumno', 'error');
      }
    }
  };


  const abrirModalMateria = async (materia?: Materia) => {
    const isEdit = !!materia;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Materia' : 'Nueva Materia',
      html: `
        <input id="swal-mat-nombre" class="swal2-input" placeholder="Nombre de materia" value="${materia?.nombre || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-mat-nombre') as HTMLInputElement).value;
        if (!nombre) Swal.showValidationMessage('El nombre es obligatorio');
        return { nombre };
      }
    });

    if (formValues) {
      try {
        if (isEdit) {
          await updateMateria(materia!.id, { ...materia, ...formValues });
        } else {
          await createMateria({ ...formValues, codigo: 'MAT-' + Math.floor(Math.random()*100), creditos: 3 });
        }
        cargarDatos();
        Swal.fire({ icon: 'success', title: 'Guardado', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      } catch (e) {
        Swal.fire('Error', 'Error en el servidor', 'error');
      }
    }
  };

  const handleEliminarAlumno = async (id: number) => {
    const res = await Swal.fire({ title: '¿Eliminar Alumno?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e63946' });
    if (res.isConfirmed) {
      await deleteAlumno(id);
      cargarDatos();
      Swal.fire('Borrado', '', 'success');
    }
  };

  const handleEliminarMateria = async (id: number) => {
    const res = await Swal.fire({ title: '¿Eliminar Materia?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e63946' });
    if (res.isConfirmed) {
      await deleteMateria(id);
      cargarDatos();
      Swal.fire('Borrada', '', 'success');
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
          <div>
            <h1 className="app-title">Panel Académico</h1>
            <p className="app-subtitle">Gestión de calificaciones y estudiantes</p>
          </div>
          <div>
            <button className="btn-main" onClick={() => abrirModalAlumno()}>+ Estudiante</button>
            <button className="btn-secondary" onClick={() => abrirModalMateria()}>+ Materia</button>
          </div>
        </header>

        <main className="matrix-wrapper">
          <table className="matrix-table">
            <thead>
            <tr>
              <th className="col-actions">Acciones</th>
              <th>Estudiante</th>
              {materias.map(m => (
                  <th key={m.id}>
                    <div className="subject-name">{m.nombre}</div>
                    <div>
                      <button className="icon-btn" onClick={() => abrirModalMateria(m)} title="Editar">✏️</button>
                      <button className="icon-btn" onClick={() => handleEliminarMateria(m.id)} title="Eliminar">🗑️</button>
                    </div>
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {alumnos.length === 0 ? (
                <tr>
                  <td colSpan={materias.length + 2} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No hay registros en el sistema.
                  </td>
                </tr>
            ) : (
                alumnos.map(a => (
                    <tr key={a.id}>
                      <td className="cell-actions">
                        <button className="icon-btn" onClick={() => abrirModalAlumno(a)} title="Editar">✏️</button>
                        <button className="icon-btn" onClick={() => handleEliminarAlumno(a.id)} title="Eliminar">🗑️</button>
                      </td>
                      <td className="student-name">{a.nombre} {a.apellido}</td>
                      {materias.map(m => {
                        const nota = notas.find(n => n.alumno?.id === a.id && n.materia?.id === m.id);
                        return (
                            <td key={m.id} className="cell-grade">
                              <GradeCell alumnoId={a.id} materiaId={m.id} notaExistente={nota} onSave={handleSaveNota} />
                            </td>
                        );
                      })}
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </main>
      </div>
  );
};

export default App;