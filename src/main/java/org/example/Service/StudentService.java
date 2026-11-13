package org.example.Service;

import org.example.Model.Student;
import org.example.Repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private  StudentRepository sr;

    public StudentService(StudentRepository sr) {
        this.sr = sr;
    }

    public Student saveStudent(Student student) {
        return sr.save(student);
    }
}