package com.bikeservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Customer_id")
    private Integer customerId;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;

    @Column(name = "Phone", length = 15)
    private String phone;

    @Column(name = "Address", length = 100)
    private String address;
}
