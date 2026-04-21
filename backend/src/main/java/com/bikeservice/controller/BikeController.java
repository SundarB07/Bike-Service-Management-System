package com.bikeservice.controller;

import com.bikeservice.model.Bike;
import com.bikeservice.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping
    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable Integer id) {
        return bikeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Bike createBike(@RequestBody Bike bike) {
        return bikeRepository.save(bike);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bike> updateBike(@PathVariable Integer id,
                                           @RequestBody Bike bikeDetails) {
        return bikeRepository.findById(id).map(bike -> {
            bike.setRegistrationNo(bikeDetails.getRegistrationNo());
            bike.setModel(bikeDetails.getModel());
            bike.setBrand(bikeDetails.getBrand());
            bike.setCustomer(bikeDetails.getCustomer());
            return ResponseEntity.ok(bikeRepository.save(bike));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable Integer id) {
        return bikeRepository.findById(id).map(bike -> {
            bikeRepository.delete(bike);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
