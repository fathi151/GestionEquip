package tn.esprit.equip.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String uri = request.getRequestURI();
        String method = request.getMethod();
        String authHeader = request.getHeader("Authorization");
        
        System.out.println("=== REQUEST LOGGING ===");
        System.out.println("URI: " + method + " " + uri);
        System.out.println("Authorization Header: " + (authHeader != null ? "Present (" + authHeader.substring(0, Math.min(20, authHeader.length())) + "...)" : "Missing"));
        
        // Process the request
        filterChain.doFilter(request, response);
        
        // Check authentication after processing
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("After processing - Authentication: " + (auth != null ? auth.getName() + " with authorities: " + auth.getAuthorities() : "None"));
        System.out.println("Response Status: " + response.getStatus());
        System.out.println("=== END REQUEST ===");
    }
}
