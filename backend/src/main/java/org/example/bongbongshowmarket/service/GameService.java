package org.example.bongbongshowmarket.service;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.RankDto;
import org.example.bongbongshowmarket.dto.UserStatsDto;
import org.example.bongbongshowmarket.entitiy.GameRecord;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.repository.GameRecordRepository;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameService {
    private final UserRepository userRepository;
    private final GameRecordRepository gameRecordRepository;
    private final Random random = new Random(); // 랜덤
    private final String[] moves = {"rock", "scissors", "paper"}; // 주먹, 가위, 보 설정

  public Map<String, String> playGame(String userMove, Long userNo, String aiMove){
      if(userMove == null){
          throw new IllegalArgumentException("UserMove cannot be null");
      }
      UserEntity user = userRepository.findById(userNo)
              .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저 입니다"));
      String result = determineWinner(userMove, aiMove);

      saveGameRecord(user, result);

      return Map.of(
              "result", result,
              "userMove", userMove,
              "aiMove", aiMove
      );
  }

  private void saveGameRecord(UserEntity user, String result){
      GameRecord record = new GameRecord();
      record.setUser(user);
      record.setPlayedAt(LocalDateTime.now());

      if("win".equals(result)) record.setGameResult("W");
      else if ("lose".equals(result)) record.setGameResult("L");
      else if ("draw".equals(result)) record.setGameResult("D");
      else throw new IllegalArgumentException("올바르지 않은 게임 결과 입니다");

      gameRecordRepository.save(record);
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

    // GameService.java 안에 추가

    public List<RankDto> getTop10Ranking() {
        // 0페이지에서 10개만 가져와라 (TOP 10)
        Pageable topTen = PageRequest.of(0, 10);

        List<Object[]> results = gameRecordRepository.findTopRankers(topTen);

        List<RankDto> rankingList = new ArrayList<>();

        int rank = 1;
        for (Object[] result : results) {
            String name = (String) result[0];
            Long winCount = (Long) result[1];
            String profileImage = (String) result[2];

            // 랭킹, 이메일, 승수 담기
            rankingList.add(new RankDto(rank++, name, winCount, profileImage));
        }

        return rankingList;
    }

    public List<RankDto> getAllRanking(){
      List<Object[]> results = gameRecordRepository.findAllRankers();
      List<RankDto> rankingList = new ArrayList<>();

      int rank = 1;
      for (Object[] result : results){
          String name = (String) result[0];
          Long winCount = (Long) result[1];
          String profileImage = (String) result[2];

          rankingList.add(new RankDto(rank++, name, winCount, profileImage));
      }

      return rankingList;
    }

    @Transactional(readOnly = true)
    public UserStatsDto getUserStats(String email) {
      UserEntity user = userRepository.findByEmail(email)
              .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다"));

        Long win = gameRecordRepository.countByUserAndGameResult(user, "W");
        Long lose = gameRecordRepository.countByUserAndGameResult(user,"L");
        Long draw = gameRecordRepository.countByUserAndGameResult(user,"D");

        List<Object[]> allRankers = gameRecordRepository.findAllRankers();
        int myRank = 0;
        int currentRank = 1;
        for(Object[] row : allRankers){
            String rankerName = (String) row[0];
            if (rankerName.equals(user.getName())) {
                myRank = currentRank;
                break;
            }
            currentRank++;
        }

        return new UserStatsDto(
                win,
                lose,
                draw,
                myRank,
                user.getProfileImage()
        );
    }
}
