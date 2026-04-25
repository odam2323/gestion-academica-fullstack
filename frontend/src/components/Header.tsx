import React from 'react';

interface HeaderProps {
    tabActual: string;
    setTabActual: (tab: any) => void;
    idBusquedaAlumno: string;
    setIdBusquedaAlumno: (val: string) => void;
    handleSearchAlumno: (e: React.KeyboardEvent) => void;
    idBusquedaMateria: string;
    setIdBusquedaMateria: (val: string) => void;
    handleSearchMateria: (e: React.KeyboardEvent) => void;
    tieneDetalle: boolean;
}

const Header: React.FC<HeaderProps> = (props) => (
    <header className="app-header">
        <div className="header-left">
            <h1 className="app-title">Gestión Académica</h1>
            <nav className="app-nav">
                <button className={props.tabActual === 'matriz' ? 'active' : ''} onClick={() => props.setTabActual('matriz')}>Matriz</button>
                <button className={props.tabActual === 'alumnos' ? 'active' : ''} onClick={() => props.setTabActual('alumnos')}>Alumnos</button>
                <button className={props.tabActual === 'materias' ? 'active' : ''} onClick={() => props.setTabActual('materias')}>Materias</button>
                {props.tieneDetalle && (
                    <button className={props.tabActual === 'detalles' ? 'active' : ''} onClick={() => props.setTabActual('detalles')}>🔎 Vista Detalle</button>
                )}
            </nav>
        </div>
        <div className="header-right">
            <div className="search-group">
                <div className="search-box">
                    <span className="search-label">ID Estudiante</span>
                    <input
                        type="number" placeholder="Enter..." value={props.idBusquedaAlumno}
                        onChange={(e) => props.setIdBusquedaAlumno(e.target.value)}
                        onKeyDown={props.handleSearchAlumno}
                    />
                </div>
                <div className="search-box">
                    <span className="search-label">ID Materia</span>
                    <input
                        type="number" placeholder="Enter..." value={props.idBusquedaMateria}
                        onChange={(e) => props.setIdBusquedaMateria(e.target.value)}
                        onKeyDown={props.handleSearchMateria}
                    />
                </div>
            </div>
        </div>
    </header>
);

export default Header;