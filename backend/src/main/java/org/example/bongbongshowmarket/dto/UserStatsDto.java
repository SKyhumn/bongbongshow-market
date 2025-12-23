package org.example.bongbongshowmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserStatsDto {
    private long win;
    private long lose;
    private long draw;
    private int rank;
    private String profileImage;
}
