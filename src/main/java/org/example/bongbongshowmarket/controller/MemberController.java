package org.example.bongbongshowmarket.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.LoginDto;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService service;

    @GetMapping("/signin")
    public ModelAndView signInPage(){
        return new ModelAndView("signin");
    }

    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        service.sendCodeToEmail(email);
        return ResponseEntity.ok("이메일로 인증코드를 전송하였습니다");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        boolean isVerified = service.verifyCode(email, code);

        if (isVerified) {
            return ResponseEntity.ok("인증 성공!");
        } else {
            return ResponseEntity.badRequest().body("인증 실패: 코드가 일치하지 않거나 만료되었습니다.");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createUser(@RequestBody MemberDto dto){
        service.createUser(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginDto dto, HttpServletResponse response){
        String resultMessage = service.signin(dto, response);
        return ResponseEntity.ok(resultMessage);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok("로그아웃 되었습니다");
    }
}
