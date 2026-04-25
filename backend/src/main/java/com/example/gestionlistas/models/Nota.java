package com.example.gestionlistas.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "notas")
@Data
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valor;
    private LocalDate fechaRegistro;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;
}