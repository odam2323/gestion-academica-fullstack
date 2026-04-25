import React from 'react';

interface LoadingProps {
    mensaje?: string;
}

const Loading: React.FC<LoadingProps> = ({ mensaje = "Sincronizando datos..." }) => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p style={{ marginTop: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                {mensaje}
            </p>
        </div>
    );
};

export default Loading;