package com.sau.movieapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity // Bu sınıf, filmleri temsil eder ve veritabanında "movies" tablosuna karşılık gelir
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 32) // Film başlığı için maksimum 32 karakter
    private String title;

    @Column(length = 16) // Yönetmen için maksimum 16 karakter
    private String director;

    private Integer year;

    private String imageName;
}
