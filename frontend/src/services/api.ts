import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Alumno, Materia, Nota } from '../types';


interface CustomInternalConfig extends InternalAxiosRequestConfig {
    __retryCount?: number;
}

const api = axios.create({

    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
});


api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as CustomInternalConfig;


        if (!config || (error.response && error.response.status !== 503)) {
            return Promise.reject(error);
        }


        const MAX_RETRIES = 3;
        config.__retryCount = config.__retryCount || 0;

        if (config.__retryCount < MAX_RETRIES) {
            config.__retryCount += 1;

            console.warn(`[API] Intento de conexión ${config.__retryCount} fallido. Reintentando en 2s...`);


            await new Promise((resolve) => setTimeout(resolve, 2000));

            return api(config);
        }

        return Promise.reject(error);
    }
);


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