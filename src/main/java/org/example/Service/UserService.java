package org.example.Service;

import org.example.Enumeration.Role;
import org.example.Enumeration.VerificationStatus;
import org.example.Model.User;
import org.example.Repository.UserRepo;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo ur;
    private final NotificationService notificationService;

    public UserService(PasswordEncoder passwordEncoder, UserRepo ur, NotificationService notificationService) {
        this.passwordEncoder = passwordEncoder;
        this.ur = ur;
        this.notificationService = notificationService;
    }


    public ResponseEntity<?> saveUser(User user) {
        try {
            if (user.getRole() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role should not be empty");
            }
            if (user.getRole() == Role.ADMIN) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Normal user can't be admin");
            }
            if (user.getRole() == Role.STUDENT) {
                user.setVerificationStatus(VerificationStatus.NOT_REQUIRED);
            } else if (user.getRole() == Role.INSTRUCTOR) {
                user.setVerificationStatus(VerificationStatus.PENDING);
            }

            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password should not be empty");
            }


            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = ur.save(user);

            if (savedUser.getRole() == Role.STUDENT) {
                notificationService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getName());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User Exist Already");
        }
    }

    public ResponseEntity<?> deleteUser(long id) {
        Optional<User> exist = ur.findById(id);
        try {
            if (exist.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            } else {
                ur.deleteById(id);
                return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please delete the enrolled courses then only user can be deleted ");
        }

    }



    public User updateUser(User u, long id,UserDetails userDetails) throws AccessDeniedException {
        User exists = ur.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found to update"
                ));
        User loggedInUser = ur.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner=exists.getEmail().equalsIgnoreCase(loggedInUser.getEmail());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException(
                    "You can update only your own details");
        }
        if (u.getName() != null && !u.getName().trim().isEmpty()) {
            exists.setName(u.getName());
        }
        if (u.getEmail() != null && !u.getEmail().trim().isEmpty()) {
            exists.setEmail(u.getEmail());
        }
        if (u.getPassword() != null && !u.getPassword().trim().isEmpty()) {
            exists.setPassword(passwordEncoder.encode(u.getPassword()));
        }
        return ur.save(exists);
    }

    public Optional<User> getInstructorById(long id) {
        return ur.findById(id).filter(user -> user.getRole() == Role.INSTRUCTOR);
    }

    public Optional<User> getStudentById(long id) {
        return ur.findById(id).filter(user -> user.getRole() == Role.STUDENT);
    }

    public List<User> getAllStudents() {
        return ur.findByRole(Role.STUDENT);
    }

    public List<User> getAllInstructors() {
        return ur.findByRoleAndVerificationStatus(Role.INSTRUCTOR, VerificationStatus.APPROVED);
    }

    public List<User> getPendingInstructors() {
        return ur.findByRoleAndVerificationStatus(Role.INSTRUCTOR, VerificationStatus.PENDING);
    }

    public User updateInstructorStatus(long id, VerificationStatus status) {
        if (status != VerificationStatus.APPROVED && status != VerificationStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be APPROVED or REJECTED");
        }

        User instructor = ur.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User is not an instructor"
            );
        }

        if (instructor.getVerificationStatus() != VerificationStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Instructor has not verified yet(status:pending)"
            );
        }
        instructor.setVerificationStatus(status);
        User savedInstructor = ur.save(instructor);

        if (status == VerificationStatus.APPROVED) {
            notificationService.sendInstructorApprovalEmail(savedInstructor.getEmail(), savedInstructor.getName());
        }

        return savedInstructor;
    }

    public List<User> getAllUsers() {
        return ur.findAll();
    }
}