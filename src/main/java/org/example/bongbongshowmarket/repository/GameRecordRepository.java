package org.example.bongbongshowmarket.repository;

import org.example.bongbongshowmarket.entitiy.GameRecord;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {
    @Query("SELECT r.user.name, COUNT(r) " +  // 반드시 email (글자)
            "FROM GameRecord r " +
            "WHERE r.gameResult = 'W' " +       // (아까 맞춘 'W' 조건)
            "GROUP BY r.user.name " +          // 그룹 기준도 email
            "ORDER BY COUNT(r) DESC")
    List<Object[]> findTopRankers(Pageable pageable);
    long countByUserAndGameResult(UserEntity user, String gameResult);

    // 윗 코드처와 같지만 리미트가 없음
    @Query("SELECT r.user.name, COUNT(r) " +
            "FROM GameRecord r " +
            "WHERE r.gameResult = 'W' " +
            "GROUP BY r.user.name " +
            "ORDER BY COUNT(r) DESC")
    List<Object[]> findAllRankers();

    void deleteByUser(UserEntity user);
}
