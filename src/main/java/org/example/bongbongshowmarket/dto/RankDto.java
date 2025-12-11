package org.example.bongbongshowmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RankDto {
    private int rank;
    private String email;
    private Long winCount;
}
