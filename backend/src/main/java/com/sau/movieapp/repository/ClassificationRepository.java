package com.sau.movieapp.repository;

import com.sau.movieapp.model.Classification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassificationRepository extends JpaRepository<Classification, Long> {
    List<Classification> findByMovieId(Long movieId);
    List<Classification> findByCategoryId(Long categoryId);
}
