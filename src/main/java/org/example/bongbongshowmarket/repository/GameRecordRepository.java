package org.example.bongbongshowmarket.repository;

import org.example.bongbongshowmarket.entitiy.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {
}
