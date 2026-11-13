package org.example.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FirstPage {
    @GetMapping("/")
    public String firstPage()
    {
        return "This is application is by Bhargav , Working Fine";
    }

}
