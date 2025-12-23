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
    @Query("SELECT u.name, COUNT(g), u.profileImage " +
            "FROM GameRecord g " +
            "JOIN g.user u " +
            "WHERE g.gameResult = 'W' " +
            "GROUP BY u.name, u.profileImage " +
            "ORDER BY COUNT(g) DESC")
    List<Object[]> findTopRankers(Pageable pageable);
    long countByUserAndGameResult(UserEntity user, String gameResult);

    // 윗 코드처와 같지만 리미트가 없음
    @Query("SELECT u.name, COUNT(g), u.profileImage, u.email " +
            "FROM GameRecord g " +
            "JOIN g.user u " +
            "WHERE g.gameResult = 'W' " +
            "GROUP BY u " +
            "ORDER BY COUNT(g) DESC")
    List<Object[]> findAllRankers();

    void deleteByUser(UserEntity user);
}
