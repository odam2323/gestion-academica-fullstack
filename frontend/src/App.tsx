import React, { useEffect, useState } from 'react';
import {
  getAlumnos, getMaterias, getTodasLasNotas, createNota, updateNota,
  createAlumno, updateAlumno, deleteAlumno,
  createMateria, updateMateria, deleteMateria
} from './services/api';
import { Alumno, Materia, Nota } from './types';
import Header from './components/Header';
import Loading from './components/Loading'; // Nuevo componente
import MatrizPage from './pages/MatrizPage';
import AlumnosPage from './pages/AlumnosPage';
import MateriasPage from './pages/MateriasPage';
import DetallePage from './pages/DetallePage';
import Swal from 'sweetalert2';
import './styles/App.css';

const App: React.FC = () => {
  // --- ESTADOS ---
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga global
  const [tabActual, setTabActual] = useState<'matriz' | 'alumnos' | 'materias' | 'detalles'>('matriz');
  const [idBusquedaAlumno, setIdBusquedaAlumno] = useState('');
  const [idBusquedaMateria, setIdBusquedaMateria] = useState('');
  const [entidadDetalle, setEntidadDetalle] = useState<{ tipo: 'alumno' | 'materia', data: Alumno | Materia } | null>(null);

  // --- CARGA DE DATOS ---
  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [alumnosRes, materiasRes, notasRes] = await Promise.all([
        getAlumnos(), getMaterias(), getTodasLasNotas()
      ]);
      setAlumnos(alumnosRes.data);
      setMaterias(materiasRes.data);
      setNotas(notasRes.data);
    } catch (error) {
      console.error("Error cargando datos", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE BÚSQUEDA ---
  const handleSearchAlumno = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const found = alumnos.find(a => a.id === parseInt(idBusquedaAlumno));
      if (found) {
        setEntidadDetalle({ tipo: 'alumno', data: found });
        setTabActual('detalles');
      } else {
        Swal.fire('No encontrado', 'El ID del alumno no existe', 'error');
      }
      setIdBusquedaAlumno('');
    }
  };

  const handleSearchMateria = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const found = materias.find(m => m.id === parseInt(idBusquedaMateria));
      if (found) {
        setEntidadDetalle({ tipo: 'materia', data: found });
        setTabActual('detalles');
      } else {
        Swal.fire('No encontrado', 'El ID de la materia no existe', 'error');
      }
      setIdBusquedaMateria('');
    }
  };

  // --- MODALES CRUD ESTUDIANTES CON VALIDACIÓN ---
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
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value;
        const apellido = (document.getElementById('swal-apellido') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const fecha = (document.getElementById('swal-fecha') as HTMLInputElement).value;

        if (!nombre || !apellido || !email || !fecha) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }
        return { nombre, apellido, email, fechaNacimiento: fecha };
      }
    });

    if (formValues) {
      setLoading(true);
      try {
        if (isEdit) await updateAlumno(alumno!.id, { ...alumno, ...formValues });
        else await createAlumno(formValues);
        await cargarDatos();
      } catch (e) {
        Swal.fire('Error', 'No se pudo guardar el registro', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEliminarAlumno = async (id: number) => {
    const res = await Swal.fire({
      title: '¿Eliminar Estudiante?',
      text: "Se borrarán sus notas asociadas permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      confirmButtonText: 'Sí, eliminar'
    });
    if (res.isConfirmed) {
      setLoading(true);
      try {
        await deleteAlumno(id);
        await cargarDatos();
      } finally {
        setLoading(false);
      }
    }
  };

  // --- MODALES CRUD MATERIAS CON VALIDACIÓN ---
  const abrirModalMateria = async (materia?: Materia) => {
    const isEdit = !!materia;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Materia' : 'Nueva Materia',
      html: `
        <input id="swal-mat-nombre" class="swal2-input" placeholder="Nombre" value="${materia?.nombre || ''}">
        <input id="swal-mat-codigo" class="swal2-input" placeholder="Código" value="${materia?.codigo || ''}">
        <input id="swal-mat-creditos" class="swal2-input" type="number" placeholder="Créditos" value="${materia?.creditos || ''}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('swal-mat-nombre') as HTMLInputElement).value;
        const codigo = (document.getElementById('swal-mat-codigo') as HTMLInputElement).value;
        const creditos = (document.getElementById('swal-mat-creditos') as HTMLInputElement).value;

        if (!nombre || !codigo || !creditos) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }
        return { nombre, codigo, creditos: parseInt(creditos) };
      }
    });

    if (formValues) {
      setLoading(true);
      try {
        if (isEdit) await updateMateria(materia!.id, { ...materia, ...formValues });
        else await createMateria(formValues);
        await cargarDatos();
      } catch (e) {
        Swal.fire('Error', 'No se pudo guardar la materia', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEliminarMateria = async (id: number) => {
    const res = await Swal.fire({
      title: '¿Eliminar Materia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--secondary)',
      confirmButtonText: 'Sí, eliminar'
    });
    if (res.isConfirmed) {
      setLoading(true);
      try {
        await deleteMateria(id);
        await cargarDatos();
      } finally {
        setLoading(false);
      }
    }
  };

  // --- GESTIÓN DE NOTAS ---
  const handleSaveNota = async (alumnoId: number, materiaId: number, valor: number, notaId?: number) => {
    const payload = {
      valor,
      fechaRegistro: new Date().toISOString().split('T')[0],
      alumno: { id: alumnoId } as Alumno,
      materia: { id: materiaId } as Materia
    };
    try {
      if (notaId) await updateNota(notaId, payload);
      else await createNota(payload);
      await cargarDatos();
    } catch (e) {
      Swal.fire('Error', 'No se guardó la calificación', 'error');
    }
  };

  // --- RENDERIZADO ---
  return (
      <div className="app-container">
        <Header
            tabActual={tabActual}
            setTabActual={setTabActual}
            idBusquedaAlumno={idBusquedaAlumno}
            setIdBusquedaAlumno={setIdBusquedaAlumno}
            handleSearchAlumno={handleSearchAlumno}
            idBusquedaMateria={idBusquedaMateria}
            setIdBusquedaMateria={setIdBusquedaMateria}
            handleSearchMateria={handleSearchMateria}
            tieneDetalle={!!entidadDetalle}
        />

        <main className="content-area" style={{ position: 'relative' }}>
          {/* Componente de carga centralizado */}
          {loading && <Loading mensaje="Sincronizando con el servidor..." />}

          {tabActual === 'matriz' && (
              <MatrizPage
                  alumnos={alumnos}
                  materias={materias}
                  notas={notas}
                  onSaveNota={handleSaveNota}
              />
          )}
          {tabActual === 'alumnos' && (
              <AlumnosPage
                  alumnos={alumnos}
                  onEdit={abrirModalAlumno}
                  onDelete={handleEliminarAlumno}
                  onNuevo={() => abrirModalAlumno()}
              />
          )}
          {tabActual === 'materias' && (
              <MateriasPage
                  materias={materias}
                  onEdit={abrirModalMateria}
                  onDelete={handleEliminarMateria}
                  onNueva={() => abrirModalMateria()}
              />
          )}
          {tabActual === 'detalles' && entidadDetalle && (
              <DetallePage
                  entidad={entidadDetalle}
                  onVolver={() => setTabActual('matriz')}
              />
          )}
        </main>
      </div>
  );
};

export default App;