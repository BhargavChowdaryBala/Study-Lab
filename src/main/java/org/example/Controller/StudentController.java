
package org.example.Controller;

import org.example.Model.Student;
import org.example.Service.StudentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
public class StudentController {

    private  StudentService ss;

    public StudentController(StudentService ss) {
        this.ss = ss;
    }

    @PostMapping("/save")
    public Student saveStudent(@RequestBody Student student) {
        return ss.saveStudent(student);
    }
}
