package org.example.bongbongshowmarket.service;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.dto.LoginDto;
import org.example.bongbongshowmarket.dto.MemberDto;
import org.example.bongbongshowmarket.dto.TokenDto;
import org.example.bongbongshowmarket.entitiy.Role;
import org.example.bongbongshowmarket.entitiy.UserEntity;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.example.bongbongshowmarket.repository.GameRecordRepository;
import org.example.bongbongshowmarket.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class MemberService {
    private final UserRepository repository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final Map<String, String> memoryStore = new ConcurrentHashMap<>();
    private final GameRecordRepository gameRecordRepository;

    private final Map<String, QrSession> qrSessionStore = new ConcurrentHashMap<>();

    private static class QrSession {
        String status;
        String email;
        long createdAt;

        public QrSession() {
            this.status = "WAITING";
            this.createdAt = System.currentTimeMillis();
        }
    }

    public String startQrSession() {
        String uuid = java.util.UUID.randomUUID().toString();
        qrSessionStore.put(uuid, new QrSession());
        return uuid;
    }

    public TokenDto pollQrSession(String uuid) {
        QrSession session = qrSessionStore.get(uuid);
        if (session == null) {
            throw new IllegalArgumentException("유효하지 않은 QR 코드입니다.");
        }
        if (System.currentTimeMillis() - session.createdAt > 3 * 60 * 1000) {
            qrSessionStore.remove(uuid);
            throw new IllegalArgumentException("QR 코드가 만료되었습니다.");
        }
        if ("WAITING".equals(session.status)) {
            return null;
        }
        if ("DONE".equals(session.status) && session.email != null) {
            UserEntity user = repository.findByEmail(session.email)
                    .orElseThrow(() -> new IllegalArgumentException("유저 정보 없음"));
            TokenDto tokenDto = tokenProvider.createToken(user.getEmail(), user.getRole(), 1000 * 60 * 60);
            qrSessionStore.remove(uuid);
            return tokenDto;
        }
        return null;
    }

    public void authorizeQrSession(String uuid, String email) {
        QrSession session = qrSessionStore.get(uuid);
        if (session == null) {
            throw new IllegalArgumentException("유효하지 않은 QR 코드입니다.");
        }
        session.status = "DONE";
        session.email = email;
    }

    public void sendCodeToEmail(String toEmail){
        if(repository.existsByEmail(toEmail)){
            throw new RuntimeException("이미 가입한 이메일 입니다");
        }
        String authCode = this.createCode();
        mailService.createNumber(toEmail, authCode, "[봉봉마켓] 회원가입 인증번호");

        memoryStore.put("AuthCode:" + toEmail, authCode);
    }

    public void sendResetCodeToEmail(String toEmail){
        if(!repository.existsByEmail(toEmail)){
            throw new RuntimeException("가입되지 않은 이메일 입니다.");
        }

        String authCode = this.createCode();
        mailService.createNumber(toEmail, authCode, "[봉봉마켓] 비밀번호 재설정 인증번호");

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

    public TokenDto signin(LoginDto dto, HttpServletResponse response){
        UserEntity user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일 입니다"));

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
        }
        long expireTimeMs = 1000 * 60 * 60;

        TokenDto Tokendto = tokenProvider.createToken(user.getEmail(), user.getRole(), expireTimeMs);

        Cookie cookie = new Cookie("accessToken", Tokendto.getAccessToken());
        cookie.setHttpOnly(true);  // 자바스크립트 해킹 방지
        cookie.setSecure(true);    // HTTPS 필수
        cookie.setPath("/");       // 모든 곳에서 사용
        cookie.setMaxAge(60 * 60);

        response.addCookie(cookie);

        return Tokendto;
    }

    private String createCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            key.append(random.nextInt(10));
        }
        return key.toString();
    }

    @Transactional
    public void withdraw(String email){
        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다"));

        gameRecordRepository.deleteByUser(user);
        repository.delete(user);
    }

    @Transactional
    public void updateProfileImage(String email, MultipartFile file){
        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다"));

        try {
            String base64Image = "data:" + file.getContentType() + ";base64," +
                    Base64.getEncoder().encodeToString(file.getBytes());
            user.setProfileImage(base64Image);
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void resetPassword(String email, String newPassword){
        String isVerified = memoryStore.get("Verified:" + email);

        if (isVerified == null || !isVerified.equals("TRUE")) {
            throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
        }
        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        if(passwordEncoder.matches(newPassword, user.getPassword())){
            throw new RuntimeException("이전의 설정한 비밀번호로 재설정 할 수 없습니다");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        memoryStore.remove("Verified:" + email);
    }
}
