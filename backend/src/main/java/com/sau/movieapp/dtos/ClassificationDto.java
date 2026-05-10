package com.sau.movieapp.dtos;

import com.sau.movieapp.model.Category;
import com.sau.movieapp.model.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassificationDto {
    private Long id;
    private Movie movie;
    private Category category;
    private LocalDate date;
}
