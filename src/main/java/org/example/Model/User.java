package org.example.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.Enumeration.Role;
import org.example.Enumeration.VerificationStatus;

@Entity
@Getter
@Setter
public class  User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable=false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false )
    private VerificationStatus verificationStatus=VerificationStatus.NOT_REQUIRED;
}