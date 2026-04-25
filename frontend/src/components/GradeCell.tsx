import React, { useState } from 'react';
import { Nota } from '../types';

interface Props {
    alumnoId: number;
    materiaId: number;
    notaExistente?: Nota;
    onSave: (alumnoId: number, materiaId: number, valor: number, notaId?: number) => void;
}

const GradeCell: React.FC<Props> = ({ alumnoId, materiaId, notaExistente, onSave }) => {
    const [editando, setEditando] = useState(false);
    const [valor, setValor] = useState(notaExistente ? notaExistente.valor.toString() : '');

    const handleBlurOrEnter = (e: React.FocusEvent | React.KeyboardEvent) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;

        setEditando(false);
        const numValue = parseFloat(valor);

        if (!isNaN(numValue) && numValue !== notaExistente?.valor) {
            onSave(alumnoId, materiaId, numValue, notaExistente?.id);
        }
    };

    if (editando) {
        return (
            <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="form-control form-control-sm text-center"
                autoFocus
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onBlur={handleBlurOrEnter}
                onKeyDown={handleBlurOrEnter}
            />
        );
    }

    return (
        <div
            className="p-2 text-center"
            style={{ cursor: 'pointer', minHeight: '35px', backgroundColor: notaExistente ? 'transparent' : '#f8f9fa' }}
            onClick={() => setEditando(true)}
            title="Clic para editar"
        >
            {notaExistente ? notaExistente.valor.toFixed(1) : '-'}
        </div>
    );
};

export default GradeCell;