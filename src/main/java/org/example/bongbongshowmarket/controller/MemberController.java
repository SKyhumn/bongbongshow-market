package org.example.bongbongshowmarket.controller;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService service;

    @PostMapping("/signup")
    public ResponseEntity<String> createUser(@RequestBody MemberDto dto){
        service.createUser(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody MemberDto dto){
        return ResponseEntity.ok(service.signin(dto));
    }
}
