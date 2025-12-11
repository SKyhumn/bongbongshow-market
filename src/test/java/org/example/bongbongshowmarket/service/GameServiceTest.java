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
        Map<String, String> result = gameService.testPlayGames("rock", "scissors"); // 플레이어가 rock ai가 scissors를 보낼때
        assertThat(result.get("userMove")).isEqualTo("rock"); //result에서 받아온 userMove가 rock가 맞는지 확인
        assertThat(result.get("aiMove")).isEqualTo("scissors"); // result에서 받아온 aiMove가 scissors가 맞는지 확인
        assertThat(result.get("result")).isEqualTo("win"); // result에서 받아온 result가 win이 맞는지 확인
    }

//    @Test
//    @DisplayName("가위바위보 게임 결과 테스트")
//    void testPlayGame_ResultFormat(){
//        String userMove = "rock"; // 사용자는 rock
//        Map<String, String> result = gameService.playGame(userMove); // gameService에 userMove를 냄
//        assertThat(result).containsKeys("result", "userMove", "aiMove"); // Map 안에 이것들이 있어야함
//        assertThat(result.get("userMove")).isEqualTo(userMove); // result에서 얻어온 userMove와 내가 설정한 userMove가 같아야함
//        assertThat(possibleMoves).contains(result.get("aiMove")); // Ai가 낼수 있는 값인지 확인
//        assertThat(Arrays.asList("win", "lose", "draw")).contains(result.get("result")); // result가 win, lose, dawn중 하나인지 확인
//    }

    @Test
    @DisplayName("잘못된 입력값 테스트")
    void testErrorInputValue(){
        Map<String, String> result = gameService.testPlayGames("Null","rock"); // 플레이어가 null ai가 rock를 보낼때
        assertThat(result.get("result")).isEqualTo("lose"); //특정 상황에만 win 아니면 lose를 반환하라 했으니 lose가 뜰것
    }

//    @Test
//    @DisplayName("랜덤 잘 작동 되는지 확인")
//    void testRandom(){
//        boolean rock = false; // 아직 안나왔음
//        boolean scissors = false; // 아직 안나왔음
//        boolean paper = false; // 아직 안나왔음
//
//        for (int i = 0 ; i < 50; i ++){ // 50번 반복
//            Map<String, String> result = gameService.playGame("rock"); // 유저는 rock으로 설정하고 플래이 시킴
//            String ai = result.get("aiMove"); // ai값 가지고 오기
//
//            if (ai.equals("rock")) rock = true; // ai값이 rock 이면 rock true로 변경
//            if (ai.equals("scissors")) scissors = true; // ai값이 scissors이면 true로 변경
//            if (ai.equals("paper")) paper = true; // ai값이 paper이면 true로 변경
//        }
//
//        assertThat(rock).isTrue(); //rock 값이 true인지 확인
//        assertThat(scissors).isTrue(); //scissors 값이 true인지 확인
//        assertThat(paper).isTrue(); //paper 값이 true 인지 확인
//    }

    @Test
    @DisplayName("null 입력시 예외가 발생하는지 테스트")
    void testNullInput(){
        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class, () ->
            gameService.testPlayGames(null, "rock") //IllegalArgumentException으로 수정 완료함
        );
    }
}
