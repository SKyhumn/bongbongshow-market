package org.example.bongbongshowmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
public class RankDto {
    private int rank;
    private String name;
    private Long winCount;
    private String profileImage;
}
