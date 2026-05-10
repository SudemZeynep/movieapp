package com.sau.movieapp.controller;

import com.sau.movieapp.exception.ResourceNotFoundException;
import com.sau.movieapp.model.Movie;
import com.sau.movieapp.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/movie")
public class MovieController {
    private final MovieRepository movieRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<Movie>> getAll() {
        return new ResponseEntity<>(movieRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/get/{id}", produces = "application/json")
    public ResponseEntity<Movie> getById(@PathVariable Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Movie> add(@RequestBody Movie movie) {
        return new ResponseEntity<>(movieRepository.save(movie), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Movie> update(@PathVariable Long id, @RequestBody Movie movie) {
        Movie m = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
        m.setTitle(movie.getTitle());
        m.setDirector(movie.getDirector());
        m.setYear(movie.getYear());
        return new ResponseEntity<>(movieRepository.save(m), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
        movieRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/upload/{id}")
    public ResponseEntity<Movie> uploadImage(@PathVariable Long id,
                                              @RequestParam("file") MultipartFile file) throws IOException {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        movie.setImageName(filename);
        return new ResponseEntity<>(movieRepository.save(movie), HttpStatus.OK);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<Resource> downloadImage(@PathVariable Long id) throws MalformedURLException {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));

        if (movie.getImageName() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Path filePath = Paths.get(uploadDir).resolve(movie.getImageName());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + movie.getImageName() + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}
