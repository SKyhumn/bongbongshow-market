package org.example.bongbongshowmarket.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class PageController {
    @GetMapping("/signin")
    public ModelAndView signInPage(){
        return new ModelAndView("signin");
    }

    @GetMapping("/hello")
    public ModelAndView helloP() {
        return new ModelAndView("hello");
    }
}
