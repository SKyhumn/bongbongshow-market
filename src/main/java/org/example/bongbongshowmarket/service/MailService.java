package org.example.bongbongshowmarket.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void createNumber(String email, String number){
        MimeMessage message = javaMailSender.createMimeMessage();

        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(email);
            helper.setSubject("[가위바위보게임] 회원가입 인증번호");

            String body = "<h3>요청하신 인증번호 입니다</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>감사합니다.</h3>";

            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (MessagingException e){
            log.error("메시지", e);
            throw new RuntimeException("이메일 발송 불가");
        }
    }
}
