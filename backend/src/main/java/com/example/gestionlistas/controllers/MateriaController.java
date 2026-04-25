package com.example.gestionlistas.controllers;

import com.example.gestionlistas.models.Materia;
import com.example.gestionlistas.repositories.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materias")
@CrossOrigin(origins = "*")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    @GetMapping
    public List<Materia> getAll() { return materiaRepository.findAll(); }

    @PostMapping
    public Materia create(@RequestBody Materia materia) { return materiaRepository.save(materia); }

    @GetMapping("/{id}")
    public ResponseEntity<Materia> getById(@PathVariable Long id) {
        return materiaRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Materia> update(@PathVariable Long id, @RequestBody Materia det) {
        return materiaRepository.findById(id).map(m -> {
            m.setNombre(det.getNombre());
            m.setCodigo(det.getCodigo());
            m.setCreditos(det.getCreditos());
            return ResponseEntity.ok(materiaRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materiaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}