package tn.esprit.equip.Service.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("JWT Filter - Processing request: " + request.getRequestURI());

        String jwtToken = extractTokenFromRequest(request);
        System.out.println("JWT Filter - Token extracted: " + (jwtToken != null ? "Present" : "Null"));

        if (jwtToken != null && !jwtToken.isEmpty()) {
            System.out.println("JWT Filter - Token format check: " + jwtToken.substring(0, Math.min(50, jwtToken.length())) + "...");
            System.out.println("JWT Filter - Token parts count: " + jwtToken.split("\\.").length);

            try {
                String username = JwtUtils.extractUsername(jwtToken);
                System.out.println("JWT Filter - Username extracted: " + username);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    try {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        System.out.println("JWT Filter - UserDetails loaded for: " + username);

                        if (JwtUtils.validateToken(jwtToken, userDetails)) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(authentication);

                            // Debug logging
                            System.out.println("JWT Filter - User authenticated: " + username);
                            System.out.println("JWT Filter - User authorities: " + userDetails.getAuthorities());
                            System.out.println("JWT Filter - Authentication set in SecurityContext");
                        } else {
                            System.out.println("JWT Filter - Token validation failed for user: " + username);
                        }
                    } catch (Exception e) {
                        System.err.println("JWT Filter - Error loading user details for: " + username + " - " + e.getMessage());
                        e.printStackTrace();
                    }
                } else if (username != null) {
                    System.out.println("JWT Filter - Authentication already exists in SecurityContext");
                }
            } catch (Exception e) {
                System.err.println("JWT Filter - Error parsing JWT token: " + e.getMessage());
                System.err.println("JWT Filter - Invalid token format or content");
            }
        } else {
            System.out.println("JWT Filter - No JWT token found in request");
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}