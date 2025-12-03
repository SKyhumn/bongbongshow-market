package org.example.bongbongshowmarket.service;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.entitiy.Role;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class MemberService {
    private final UserRepository repository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public void createUser(MemberDto member){
        if (member == null || member.getEmail() == null || member.getEmail().isBlank()){
            throw new IllegalArgumentException("이메일은 필수 입력 값입니다");
        }

        if(repository.existsByEmail(member.getEmail())){
            throw new RuntimeException("이미 가입한 유저입니다.");
        }
        UserEntity entity = new UserEntity();
        entity.setEmail(member.getEmail());
        entity.setPassword(passwordEncoder.encode(member.getPassword()));
        entity.setRole(Role.USER);

        repository.save(entity);
    }

    public Map<String, String> signin(MemberDto dto){
        UserEntity entity = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일을 찾을 수 없습니다"));
        if(!passwordEncoder.matches(dto.getPassword(), entity.getPassword())) {
            throw new RuntimeException("비밀번호가 일치 하지 않습니다");
        }
        String access = tokenProvider.createAccessToken(entity.getEmail(), entity.getRole());
        String refresh = tokenProvider.createRefreshToken(entity.getEmail(), entity.getRole());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", access);
        tokens.put("refreshToken", refresh);
        return tokens;
    }

}
