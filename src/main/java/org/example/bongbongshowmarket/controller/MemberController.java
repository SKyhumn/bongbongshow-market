package org.example.bongbongshowmarket.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.LoginDto;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.dto.TokenDto;
import org.example.bongbongshowmarket.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        memberService.sendCodeToEmail(email);
        return ResponseEntity.ok("이메일로 인증코드를 전송하였습니다");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        boolean isVerified = memberService.verifyCode(email, code);

        if (isVerified) {
            return ResponseEntity.ok("인증 성공!");
        } else {
            return ResponseEntity.badRequest().body("인증 실패: 코드가 일치하지 않거나 만료되었습니다.");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createUser(@RequestBody MemberDto dto){
        memberService.createUser(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginDto dto, HttpServletResponse response){
        try {
            TokenDto tokenDto = memberService.signin(dto, response);
            return ResponseEntity.ok(tokenDto);
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok("로그아웃 되었습니다");
    }
    
    @PostMapping("/send-reset-code")
    public ResponseEntity<String> sendResetCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        try{
            memberService.sendResetCodeToEmail(email);
            return ResponseEntity.ok("인증번호가 발송되었습니다.");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        try {
            memberService.resetPassword(email, newPassword);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/qr/init")
    public ResponseEntity<String> initQr() {
        return ResponseEntity.ok(memberService.startQrSession());
    }

    @GetMapping("/qr/poll")
    public ResponseEntity<?> pollQr(@RequestParam String uuid) {
        try {
            TokenDto token = memberService.pollQrSession(uuid);
            if (token != null) {
                return ResponseEntity.ok(token); // 성공하면 토큰 줌
            } else {
                return ResponseEntity.ok("WAITING"); // 아직 안됨
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
