import React from 'react';
import { Materia } from '../types';

interface MateriasPageProps {
    materias: Materia[];
    onEdit: (materia: Materia) => void;
    onDelete: (id: number) => void;
    onNueva: () => void;
}

const MateriasPage: React.FC<MateriasPageProps> = ({ materias, onEdit, onDelete, onNueva }) => {
    return (
        <div className="view-container">
            <div className="view-header">
                <h2>Listado de Materias</h2>
                <button className="btn-main" onClick={onNueva}>+ Nueva Materia</button>
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
                        <td className="cell-actions">
                            <button className="icon-btn" onClick={() => onEdit(m)} title="Editar">✏️</button>
                            <button className="icon-btn" onClick={() => onDelete(m.id)} title="Eliminar">🗑️</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MateriasPage;