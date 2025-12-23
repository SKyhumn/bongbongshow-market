package org.example.bongbongshowmarket.controller;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.example.bongbongshowmarket.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    private final UserRepository repository;
    
    @PostMapping("/play")
    public Map<String, String> playGame(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetails userDetails){
        if (userDetails == null){
            throw new RuntimeException("로그인이 필요합니다");
        }

        String userMove = payload.get("userMove");
        String aiMove = payload.get("aiMove");

        String email = userDetails.getUsername();
        UserEntity entity = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        Long userNo = entity.getUserNo();

        return gameService.playGame(userMove, userNo, aiMove);  
    }
}
