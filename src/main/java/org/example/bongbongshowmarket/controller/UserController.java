package org.example.bongbongshowmarket.controller;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.RankDto;
import org.example.bongbongshowmarket.dto.TokenDto;
import org.example.bongbongshowmarket.dto.UserStatsDto;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.GameRecordRepository;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.example.bongbongshowmarket.service.GameService;
import org.example.bongbongshowmarket.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final GameRecordRepository gameRecordRepository;
    private final UserRepository userRepository;
    private final GameService gameService;
    private final MemberService memberService;

    @GetMapping("/hello")
    public ModelAndView helloP() {
        return new ModelAndView("hello");
    }

    @GetMapping("/stats")
        public ResponseEntity<UserStatsDto> getUserStats(@AuthenticationPrincipal UserDetails userDetails) {
            return ResponseEntity.ok(gameService.getUserStats(userDetails.getUsername()));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<RankDto>> getRanking() {
        return ResponseEntity.ok(gameService.getTop10Ranking());
    }

    @GetMapping("/ranking/all")
    public ResponseEntity<List<RankDto>> getAllRanking(){
        return ResponseEntity.ok(gameService.getAllRanking());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> withdraw(@AuthenticationPrincipal UserDetails userDetails){
        memberService.withdraw(userDetails.getUsername());
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다");
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(@AuthenticationPrincipal UserDetails user,
                                                @RequestParam("file") MultipartFile file) {
        memberService.updateProfileImage(user.getUsername(), file);
        return ResponseEntity.ok().body(Map.of("message", "프로필 이미지가 변경되었습니다."));
    }
}