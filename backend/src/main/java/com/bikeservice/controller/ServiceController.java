package com.bikeservice.controller;

import com.bikeservice.model.ServiceRecord;
import com.bikeservice.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<ServiceRecord> getAllServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRecord> getServiceById(@PathVariable Integer id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ServiceRecord createService(@RequestBody ServiceRecord serviceRecord) {
        return serviceRepository.save(serviceRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceRecord> updateService(@PathVariable Integer id,
                                                       @RequestBody ServiceRecord serviceDetails) {
        return serviceRepository.findById(id).map(svc -> {
            svc.setServiceDate(serviceDetails.getServiceDate());
            svc.setServiceType(serviceDetails.getServiceType());
            svc.setCost(serviceDetails.getCost());
            svc.setProblemDesc(serviceDetails.getProblemDesc());
            svc.setBike(serviceDetails.getBike());
            svc.setMechanic(serviceDetails.getMechanic());
            return ResponseEntity.ok(serviceRepository.save(svc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        return serviceRepository.findById(id).map(svc -> {
            serviceRepository.delete(svc);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
