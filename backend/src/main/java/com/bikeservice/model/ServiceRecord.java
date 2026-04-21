package com.bikeservice.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "service")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Service_id")
    private Integer serviceId;

    @Column(name = "Service_date")
    private LocalDate serviceDate;

    @Column(name = "Service_type", length = 50)
    private String serviceType;

    @Column(name = "Cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "Problem_desc", length = 200)
    private String problemDesc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Bike_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Bike bike;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Mechanic_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Mechanic mechanic;
}
