package com.bikeservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mechanic")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mechanic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Mechanic_id")
    private Integer mechanicId;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;

    @Column(name = "Phone", length = 15)
    private String phone;

    @Column(name = "Specialisation", length = 50)
    private String specialisation;
}
