package com.example.gestionlistas.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "materias")
@Data
public class Materia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String codigo;
    private Integer creditos;

    @OneToMany(mappedBy = "materia", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Nota> notas;
}