import React from 'react';
import { Alumno, Materia } from '../types';

interface DetallePageProps {
    entidad: {
        tipo: 'alumno' | 'materia';
        data: Alumno | Materia
    };
    onVolver: () => void;
}

const DetallePage: React.FC<DetallePageProps> = ({ entidad, onVolver }) => {
    const isAlumno = entidad.tipo === 'alumno';
    const d = entidad.data;

    return (
        <div className="view-container detail-view">
            <div className="detail-card">
                <div className="detail-header">
                    <span className="detail-badge">{entidad.tipo.toUpperCase()}</span>
                    <h2>Información Detallada del Registro</h2>
                </div>
                <hr />
                <div className="detail-content">
                    {isAlumno ? (
                        // Renderizado para Alumno
                        <div className="info-grid">
                            <div className="info-item">
                                <span>ID de Registro:</span>
                                <p>{(d as Alumno).id}</p>
                            </div>
                            <div className="info-item">
                                <span>Nombre Completo:</span>
                                <p>{(d as Alumno).nombre} {(d as Alumno).apellido}</p>
                            </div>
                            <div className="info-item">
                                <span>Correo Institucional:</span>
                                <p>{(d as Alumno).email}</p>
                            </div>
                            <div className="info-item">
                                <span>Fecha de Nacimiento:</span>
                                <p>{(d as Alumno).fechaNacimiento}</p>
                            </div>
                        </div>
                    ) : (
                        // Renderizado para Materia
                        <div className="info-grid">
                            <div className="info-item">
                                <span>ID de Registro:</span>
                                <p>{(d as Materia).id}</p>
                            </div>
                            <div className="info-item">
                                <span>Código de Materia:</span>
                                <p>{(d as Materia).codigo}</p>
                            </div>
                            <div className="info-item">
                                <span>Nombre de Asignatura:</span>
                                <p>{(d as Materia).nombre}</p>
                            </div>
                            <div className="info-item">
                                <span>Créditos Académicos:</span>
                                <p>{(d as Materia).creditos}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="detail-footer">
                    <button className="btn-main" onClick={onVolver}>
                        Volver a la Matriz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetallePage;