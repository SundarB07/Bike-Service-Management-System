package com.bikeservice.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Payment_id")
    private Integer paymentId;

    @Column(name = "Payment_date")
    private LocalDate paymentDate;

    @Column(name = "Amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "Payment_mode", length = 20)
    private String paymentMode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Service_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ServiceRecord service;
}
