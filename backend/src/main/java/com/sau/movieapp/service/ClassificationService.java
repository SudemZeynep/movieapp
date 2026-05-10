package com.sau.movieapp.service;

import com.sau.movieapp.dtos.ClassificationDto;
import com.sau.movieapp.exception.ResourceNotFoundException;
import com.sau.movieapp.model.Category;
import com.sau.movieapp.model.Classification;
import com.sau.movieapp.model.Movie;
import com.sau.movieapp.repository.CategoryRepository;
import com.sau.movieapp.repository.ClassificationRepository;
import com.sau.movieapp.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassificationService {
    private final ClassificationRepository classificationRepository;
    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    public ClassificationService(ClassificationRepository classificationRepository,
                                  MovieRepository movieRepository,
                                  CategoryRepository categoryRepository) {
        this.classificationRepository = classificationRepository;
        this.movieRepository = movieRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ClassificationDto> getAllWithJoin() {
        return classificationRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private ClassificationDto toDto(Classification c) {
        Movie movie = movieRepository.findById(c.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + c.getMovieId()));
        Category category = categoryRepository.findById(c.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + c.getCategoryId()));
        return new ClassificationDto(c.getId(), movie, category, c.getDate());
    }
}
