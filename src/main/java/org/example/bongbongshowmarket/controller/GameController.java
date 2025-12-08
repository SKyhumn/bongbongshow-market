package org.example.bongbongshowmarket.controller;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.service.GameService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/common")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }
    
    @PostMapping("/play")
    public Map<String, String> playGame(@RequestBody Map<String, String> payload){
        String userMove = payload.get("userMove");
        return gameService.playGame(userMove);
    }
}
