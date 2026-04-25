import axios from 'axios';
import { Alumno, Materia, Nota } from '../types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const getAlumnos = () => api.get<Alumno[]>('/alumnos');
export const createAlumno = (alumno: Partial<Alumno>) => api.post<Alumno>('/alumnos', alumno);
export const updateAlumno = (id: number, alumno: Partial<Alumno>) => api.put<Alumno>(`/alumnos/${id}`, alumno);
export const deleteAlumno = (id: number) => api.delete(`/alumnos/${id}`);

export const getMaterias = () => api.get<Materia[]>('/materias');
export const createMateria = (materia: Partial<Materia>) => api.post<Materia>('/materias', materia);
export const updateMateria = (id: number, materia: Partial<Materia>) => api.put<Materia>(`/materias/${id}`, materia);
export const deleteMateria = (id: number) => api.delete(`/materias/${id}`);

export const getTodasLasNotas = () => api.get<Nota[]>('/notas');
export const createNota = (nota: Partial<Nota>) => api.post<Nota>('/notas', nota);
export const updateNota = (id: number, nota: Partial<Nota>) => api.put<Nota>(`/notas/${id}`, nota);

export default api;