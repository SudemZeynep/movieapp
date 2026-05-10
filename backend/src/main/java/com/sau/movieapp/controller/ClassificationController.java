package com.sau.movieapp.controller;

import com.sau.movieapp.dtos.ClassificationDto;
import com.sau.movieapp.exception.ResourceNotFoundException;
import com.sau.movieapp.model.Classification;
import com.sau.movieapp.repository.ClassificationRepository;
import com.sau.movieapp.service.ClassificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/classification")
public class ClassificationController {
    private final ClassificationRepository classificationRepository;
    private final ClassificationService classificationService;

    public ClassificationController(ClassificationRepository classificationRepository,
                                     ClassificationService classificationService) {
        this.classificationRepository = classificationRepository;
        this.classificationService = classificationService;
    }

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<Classification>> getAll() {
        return new ResponseEntity<>(classificationRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/join", produces = "application/json")
    public ResponseEntity<List<ClassificationDto>> getAllJoin() {
        return new ResponseEntity<>(classificationService.getAllWithJoin(), HttpStatus.OK);
    }

    @GetMapping(value = "/get/{id}", produces = "application/json")
    public ResponseEntity<Classification> getById(@PathVariable Long id) {
        Classification c = classificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classification not found: " + id));
        return new ResponseEntity<>(c, HttpStatus.OK);
    }

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Classification> add(@RequestBody Classification classification) {
        return new ResponseEntity<>(classificationRepository.save(classification), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Classification> update(@PathVariable Long id, @RequestBody Classification classification) {
        Classification c = classificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classification not found: " + id));
        c.setMovieId(classification.getMovieId());
        c.setCategoryId(classification.getCategoryId());
        c.setDate(classification.getDate());
        return new ResponseEntity<>(classificationRepository.save(c), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classification not found: " + id));
        classificationRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
