package org.example.bongbongshowmarket.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.bongbongshowmarket.entitiy.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {
    private final String SECURITY_KEY;
    private final Key key;
    private final long ACCESS_TOKEN_VALID = 1000L * 60 * 30;
    private final long REFRESH_TOKEN_VALID = 1000L * 60 * 60 * 24 * 7;

    public JwtTokenProvider(@Value("${jwt.security-key}") String securityKey){
        this.SECURITY_KEY = securityKey;
        log.info("현재 로드된 security key 값: "+ securityKey);
        this.key = Keys.hmacShaKeyFor(securityKey.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(String email, Role role, long expireTime){
        Date now = new Date();

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expireTime))
                .signWith(key)
                .compact();
    }

    public String createAccessToken(String email, Role role){
        return createToken(email, role, ACCESS_TOKEN_VALID);
    }
    public String createRefreshToken(String email, Role role){
        return createToken(email, role, REFRESH_TOKEN_VALID);
    }

    public String getEmail(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRole(String token){
        return (String) Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token){
        try {
            Jwts
                    .parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e){
            log.info("잘못된 JWT 서명입니다");
        }catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }
}
