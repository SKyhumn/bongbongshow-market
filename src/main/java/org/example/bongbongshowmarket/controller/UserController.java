package org.example.bongbongshowmarket.controller;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.TokenDto;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/hello")
    public ModelAndView helloP() {
        return new ModelAndView("hello");
    }
}