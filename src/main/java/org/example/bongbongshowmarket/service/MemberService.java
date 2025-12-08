package org.example.bongbongshowmarket.service;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.LoginDto;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.entitiy.Role;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class MemberService {
    private final UserRepository repository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final Map<String, String> memoryStore = new ConcurrentHashMap<>();

    public void sendCodeToEmail(String toEmail){
        if(repository.existsByEmail(toEmail)){
            throw new RuntimeException("이미 가입한 이메일 입니다");
        }
        String authCode = this.createCode();
        mailService.createNumber(toEmail, authCode);

        memoryStore.put("AuthCode:" + toEmail, authCode);
    }

    public boolean verifyCode(String email, String inputCode){
        String storedCode = memoryStore.get("AuthCode:" + email);

        if (storedCode != null && storedCode.equals(inputCode)) {
            memoryStore.remove("AuthCode:" + email);
            memoryStore.put("Verified:" + email, "TRUE");
            return true;
        }
        return false;
    }

    public void createUser(MemberDto member){

        String isVerified = memoryStore.get("Verified:" + member.getEmail());
        if (isVerified == null || !isVerified.equals("TRUE")) {
            throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
        }
        if (member.getEmail() == null || member.getEmail().isBlank()){
            throw new IllegalArgumentException("이메일은 필수 입력 값입니다");
        }
        if(member.getName() == null || member.getName().isBlank()){
            throw new IllegalArgumentException("이름이 입력되지 않았습니다");
        }
        if(member.getPassword() == null || member.getPassword().isBlank()){
            throw new IllegalArgumentException("비밀번호를 입력되지 않았습니다");
        }

        if(repository.existsByEmail(member.getEmail())){
            throw new RuntimeException("이미 가입한 유저입니다.");
        }

        UserEntity entity = new UserEntity();
        entity.setEmail(member.getEmail());
        entity.setPassword(passwordEncoder.encode(member.getPassword()));
        entity.setName(member.getName());
        entity.setRole(Role.USER);

        repository.save(entity);

        memoryStore.remove("Verified:" + member.getEmail());
    }

    public Map<String, String> signin(LoginDto dto){
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

    private String createCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            key.append(random.nextInt(10));
        }
        return key.toString();
    }
}
