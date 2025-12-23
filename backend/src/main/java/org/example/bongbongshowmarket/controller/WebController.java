package org.example.bongbongshowmarket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping(value =  {"/", "/signin", "/signup", "/home", "/hello"})
    public String forward() {
        return "forward:/index.html";
    }
    @GetMapping("/error")
    public String error() {
        return "forward:/index.html";
    }
}
