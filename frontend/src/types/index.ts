export interface Alumno {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: string;
}

export interface Materia {
    id: number;
    codigo: string;
    nombre: string;
    creditos: number;
}

export interface Nota {
    id?: number;
    valor: number;
    fechaRegistro: string;
    alumno: Alumno;
    materia: Materia;
}