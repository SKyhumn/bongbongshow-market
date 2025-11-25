package org.example.bongbongshowmarket.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class GameServiceTest {
    @InjectMocks
    private GameService gameService;

    private final List<String> possibleMoves = Arrays.asList("rock", "scissors", "paper");

    @Test
    @DisplayName("승패 테스트")
    void testDetermineWinner_Direct(){
        Map<String, String> result = gameService.testPlayGames("rock", "scissors");
        assertThat(result.get("userMove")).isEqualTo("rock");
        assertThat(result.get("aiMove")).isEqualTo("scissors");
        assertThat(result.get("result")).isEqualTo("win");
    }

    @Test
    @DisplayName("가위바위보 게임 결과 테스트")
    void testPlayGame_ResultFormat(){
        String userMove = "rock";
        Map<String, String> result = gameService.playGame(userMove);
        assertThat(result).containsKeys("result", "userMove", "aiMove");
        assertThat(result.get("userMove")).isEqualTo(userMove);
        assertThat(possibleMoves).contains(result.get("aiMove"));
        assertThat(Arrays.asList("win", "lose", "dawn")).contains(result.get("result"));
    }
}
