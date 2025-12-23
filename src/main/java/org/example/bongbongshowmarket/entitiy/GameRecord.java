package org.example.bongbongshowmarket.entitiy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "GameRecordEntity")
@Getter
@Setter
public class GameRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private UserEntity user;

    @Column(name = "gameResult", nullable = false, length = 1)
    private String gameResult;

    @Column(name = "played_at", nullable = false)
    private LocalDateTime playedAt;
}
