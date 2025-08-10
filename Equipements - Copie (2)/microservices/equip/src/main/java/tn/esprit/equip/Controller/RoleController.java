package tn.esprit.equip.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.equip.Entity.Role;
import tn.esprit.equip.Service.RoleService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:4200")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Get all available roles
     */
    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllRoles() {
        List<String> roles = roleService.getAllRoleCodes();
        return ResponseEntity.ok(roles);
    }

    /**
     * Get detailed role information
     */
    @GetMapping("/details")
    public ResponseEntity<List<Role>> getRoleDetails() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    /**
     * Check current user's role and permissions
     */
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        
        // Extract role from authorities
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
                
        response.put("role", role);
        response.put("hasEquipmentAccess", roleService.hasEquipmentAccess(role));
        response.put("hasAdminPrivileges", roleService.hasAdminPrivileges(role));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Validate a role
     */
    @GetMapping("/validate/{roleCode}")
    public ResponseEntity<Map<String, Object>> validateRole(@PathVariable String roleCode) {
        Map<String, Object> response = new HashMap<>();
        response.put("roleCode", roleCode);
        response.put("isValid", roleService.isValidRole(roleCode));
        response.put("hasEquipmentAccess", roleService.hasEquipmentAccess(roleCode));
        response.put("hasAdminPrivileges", roleService.hasAdminPrivileges(roleCode));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Admin only - Get role statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DSI')")
    public ResponseEntity<Map<String, Object>> getRoleStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRoles", roleService.getAllRoles().size());
        stats.put("availableRoles", roleService.getAllRoleCodes());
        stats.put("defaultRole", roleService.getDefaultRole());
        
        return ResponseEntity.ok(stats);
    }
}
