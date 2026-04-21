package com.bikeservice.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "bike")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Bike_id")
    private Integer bikeId;

    @Column(name = "Registration_no", unique = true, length = 20)
    private String registrationNo;

    @Column(name = "Model", length = 50)
    private String model;

    @Column(name = "Brand", length = 50)
    private String brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Customer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Customer customer;
}
