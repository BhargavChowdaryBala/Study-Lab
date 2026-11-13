package org.example.Repository;

import org.example.Enumeration.Role;
import org.example.Enumeration.VerificationStatus;
import org.example.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
    List<User> findByRole(Role role);
    List<User> findByRoleAndVerificationStatus(
            Role role,
            VerificationStatus verificationStatus
    );
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);

    Optional<User> findByEmailOrName(String email, String name);
}
