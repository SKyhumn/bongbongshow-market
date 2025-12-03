package org.example.bongbongshowmarket.service;

import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class MemberServiceTest {
    @InjectMocks
    MemberService memberService;

    @Mock
    UserRepository repository;

    @Mock
    PasswordEncoder encoder;

    @Test
    @DisplayName("회원가입시 이메일이 null 이면 예외가 발생해야 한다")
    void emailInputNull(){
        MemberDto dto = new MemberDto();
        dto.setEmail(null);
        dto.setPassword("1234");

        Throwable exception = assertThrows(IllegalArgumentException.class, () -> {
            memberService.createUser(dto);
        });

        assertEquals("이메일은 필수 입력 값입니다", exception.getMessage());
    }
}
