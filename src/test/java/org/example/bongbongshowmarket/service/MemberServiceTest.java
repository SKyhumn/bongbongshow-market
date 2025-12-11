package org.example.bongbongshowmarket.service;

import org.example.bongbongshowmarket.dto.LoginDto;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.entitiy.Role;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MemberServiceTest {
    @InjectMocks
    MemberService memberService;

    @Mock
    UserRepository repository;

    @Mock
    PasswordEncoder encoder;

    @Mock
    JwtTokenProvider provider;

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

//    @Test
//    @DisplayName("로그인 성공: 이메일과 비밀번호가 일치하면 토큰을 발급한다")
//    void signInSuccess(){
//        LoginDto dto = new LoginDto();
//        dto.setEmail("test@gmail.com");
//        dto.setPassword("1234");
//
//        UserEntity mockUser = new UserEntity();
//        mockUser.setEmail("test@gmail.com");
//        mockUser.setPassword("encodedPassword");
//        mockUser.setRole(Role.USER);
//
//        when(repository.findByEmail(dto.getEmail())).thenReturn(Optional.of(mockUser));
//        when(encoder.matches(dto.getPassword(), mockUser.getPassword())).thenReturn(true);
//        when(provider.createAccessToken(any(), any())).thenReturn("access-token-sample");
//        when(provider.createRefreshToken(any(), any())).thenReturn("refresh-token-sample");
//        Map<String, String> result = memberService.signin(dto);
//        assertNotNull(result);
//        assertEquals("access-token-sample", result.get("accessToken"));
//        assertEquals("refresh-token-sample", result.get("refreshToken"));
//    }
}
