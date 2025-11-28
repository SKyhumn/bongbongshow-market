package org.example.bongbongshowmarket.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Random;

@Service
public class GameService {
    private final Random random = new Random(); // 랜덤
    private final String[] moves = {"rock", "scissors", "paper"}; // 주먹, 가위, 보 설정

  public Map<String, String> playGame(String userMove){
      if(userMove == null){
          throw new IllegalArgumentException("UserMove cannot be null");
      }

      String aiMove = moves[random.nextInt(moves.length)];
      String result = determineWinner(userMove, aiMove);
      return Map.of(
              "result", result,
              "userMove", userMove,
              "aiMove", aiMove
      );
  }

  public Map<String, String> testPlayGames(String userMove, String aiMove){
      if(userMove == null){
          throw new IllegalArgumentException("UserMove cannot be null");
      }

      String result = determineWinner(userMove, aiMove);
      return Map.of(
              "result", result,
              "userMove", userMove,
              "aiMove", aiMove
      );
  }

    private String determineWinner(String user, String ai){
        if(user.equals(ai)){
            return "draw"; // 비김
        }
        // 사용자가 이기는 경우
        if ((user.equals("rock") && ai.equals("scissors")) ||
                (user.equals("scissors") && ai.equals("paper")) ||
                (user.equals("paper") && ai.equals("rock"))) {
            return "win"; // 사용자가 이김
        } else {
            return "lose"; // 사용자가 짐
        }
    }
}
