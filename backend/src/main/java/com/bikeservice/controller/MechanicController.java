package com.bikeservice.controller;

import com.bikeservice.model.Mechanic;
import com.bikeservice.repository.MechanicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class MechanicController {

    @Autowired
    private MechanicRepository mechanicRepository;

    @GetMapping
    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mechanic> getMechanicById(@PathVariable Integer id) {
        return mechanicRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mechanic createMechanic(@RequestBody Mechanic mechanic) {
        return mechanicRepository.save(mechanic);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mechanic> updateMechanic(@PathVariable Integer id,
                                                   @RequestBody Mechanic mechanicDetails) {
        return mechanicRepository.findById(id).map(mechanic -> {
            mechanic.setName(mechanicDetails.getName());
            mechanic.setPhone(mechanicDetails.getPhone());
            mechanic.setSpecialisation(mechanicDetails.getSpecialisation());
            return ResponseEntity.ok(mechanicRepository.save(mechanic));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMechanic(@PathVariable Integer id) {
        return mechanicRepository.findById(id).map(mechanic -> {
            mechanicRepository.delete(mechanic);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
