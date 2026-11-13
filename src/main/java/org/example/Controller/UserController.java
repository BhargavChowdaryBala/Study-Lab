package org.example.Controller;

import org.example.Enumeration.VerificationStatus;
import org.example.Model.User;
import org.example.Repository.UserRepo;
import org.example.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserService us;
    private final UserRepo up;

    public UserController(UserService us, UserRepo up) {
        this.us = us;
        this.up = up;
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = us.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @PostMapping("/register")
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        return us.saveUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable long id) {
        Optional<User> userOptional = up.findById(id);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public User updateUser(@RequestBody User u, @PathVariable long id, @AuthenticationPrincipal UserDetails userdetails) {
        return us.updateUser(u, id,userdetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        return us.deleteUser(id);
    }

    @GetMapping("/students")
    public ResponseEntity<?> allStudents() {
        List<User> students = us.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/instructors")
    public ResponseEntity<?> getAllInstructors() {
        List<User> instructors = us.getAllInstructors();
        return ResponseEntity.ok(instructors);
    }

    @GetMapping("/admin/instructors/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getPendingInstructors() {
        return us.getPendingInstructors();
    }

    @PutMapping("/admin/instructors/{id}/verification")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateInstructorStatus(
            @PathVariable long id,
            @RequestParam VerificationStatus status) {

        return us.updateInstructorStatus(id, status);
    }
}
