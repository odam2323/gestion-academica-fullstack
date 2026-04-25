package com.example.gestionlistas.controllers;

import com.example.gestionlistas.models.Nota;
import com.example.gestionlistas.repositories.NotaRepository;
import com.example.gestionlistas.repositories.AlumnoRepository;
import com.example.gestionlistas.repositories.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class NotaController {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    // CREAR UNA NOTA NUEVA
    @PostMapping
    public ResponseEntity<Nota> registrarNota(@RequestBody Nota nota) {
        if (nota.getAlumno() == null || !alumnoRepository.existsById(nota.getAlumno().getId()) ||
                nota.getMateria() == null || !materiaRepository.existsById(nota.getMateria().getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(notaRepository.save(nota));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Nota> actualizarNota(@PathVariable Long id, @RequestBody Nota detallesNota) {
        Optional<Nota> notaExistente = notaRepository.findById(id);

        if (notaExistente.isPresent()) {
            Nota notaAActualizar = notaExistente.get();

            notaAActualizar.setValor(detallesNota.getValor());
            return ResponseEntity.ok(notaRepository.save(notaAActualizar));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping
    public List<Nota> listarTodas() {
        return notaRepository.findAll();
    }


    @GetMapping("/alumno/{alumnoId}")
    public List<Nota> listarPorAlumno(@PathVariable Long alumnoId) {
        return notaRepository.findByAlumnoId(alumnoId);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNota(@PathVariable Long id) {
        if (!notaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        notaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}