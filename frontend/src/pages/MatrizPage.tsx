import React from 'react';
import { Alumno, Materia, Nota } from '../types';
import GradeCell from '../components/GradeCell';

interface MatrizPageProps {
    alumnos: Alumno[];
    materias: Materia[];
    notas: Nota[];
    onSaveNota: (alumnoId: number, materiaId: number, valor: number, notaId?: number) => void;
}

const MatrizPage: React.FC<MatrizPageProps> = ({ alumnos, materias, notas, onSaveNota }) => {
    return (
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
                {alumnos.length === 0 ? (
                    <tr>
                        <td colSpan={materias.length + 1} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            No hay registros en el sistema.
                        </td>
                    </tr>
                ) : (
                    alumnos.map(a => (
                        <tr key={a.id}>
                            <td className="student-cell">
                                <span className="student-id-label">ID: {a.id}</span>
                                <span className="student-name-text">{a.nombre} {a.apellido}</span>
                            </td>
                            {materias.map(m => {
                                const nota = notas.find(n => n.alumno?.id === a.id && n.materia?.id === m.id);
                                return (
                                    <td key={m.id} className="cell-grade">
                                        <GradeCell
                                            alumnoId={a.id}
                                            materiaId={m.id}
                                            notaExistente={nota}
                                            onSave={onSaveNota}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default MatrizPage;