package org.example.bongbongshowmarket.config;

import lombok.RequiredArgsConstructor;
import org.example.bongbongshowmarket.jwt.JwtAuthenticationFilter;
import org.example.bongbongshowmarket.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider tokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)

                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/assets/**", "/*.ico", "/*.json", "/*.svg", "/*.png", "/*.jpg").permitAll()
                        .requestMatchers("/api/public/**", "/signin").permitAll()
                        .requestMatchers("/api/user/**", "/hello").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401); // 강제 이동 대신 "권한 없음" 신호만 보냄
                        }))
                .addFilterBefore(new JwtAuthenticationFilter(tokenProvider),
                        UsernamePasswordAuthenticationFilter.class);
         return http.build();
    }
}
