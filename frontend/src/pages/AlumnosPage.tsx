import React from 'react';
import { Alumno } from '../types';

interface AlumnosPageProps {
    alumnos: Alumno[];
    onEdit: (alumno: Alumno) => void;
    onDelete: (id: number) => void;
    onNuevo: () => void;
}

const AlumnosPage: React.FC<AlumnosPageProps> = ({ alumnos, onEdit, onDelete, onNuevo }) => {
    return (
        <div className="view-container">
            <div className="view-header">
                <h2>Listado de Estudiantes</h2>
                <button className="btn-main" onClick={onNuevo}>+ Nuevo Alumno</button>
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
                        <td className="cell-actions">
                            <button className="icon-btn" onClick={() => onEdit(a)} title="Editar">✏️</button>
                            <button className="icon-btn" onClick={() => onDelete(a.id)} title="Eliminar">🗑️</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlumnosPage;