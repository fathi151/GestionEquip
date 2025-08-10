package tn.esprit.equip.Service;

import org.springframework.stereotype.Service;
import tn.esprit.equip.Entity.Role;

import java.util.Arrays;
import java.util.List;

@Service
public class RoleService {

    /**
     * Get all available roles
     */
    public List<Role> getAllRoles() {
        return Arrays.asList(Role.values());
    }

    /**
     * Get all role codes as strings
     */
    public List<String> getAllRoleCodes() {
        return Arrays.stream(Role.values())
                .map(Role::getCode)
                .toList();
    }

    /**
     * Validate if a role code is valid
     */
    public boolean isValidRole(String roleCode) {
        if (roleCode == null || roleCode.trim().isEmpty()) {
            return false;
        }
        
        return Arrays.stream(Role.values())
                .anyMatch(role -> role.getCode().equalsIgnoreCase(roleCode.trim()));
    }

    /**
     * Get role from code with validation
     */
    public Role getRoleFromCode(String roleCode) {
        return Role.fromCode(roleCode);
    }

    /**
     * Check if a role has equipment access
     */
    public boolean hasEquipmentAccess(String roleCode) {
        Role role = Role.fromCode(roleCode);
        return role.hasEquipmentAccess();
    }

    /**
     * Check if a role has admin privileges
     */
    public boolean hasAdminPrivileges(String roleCode) {
        Role role = Role.fromCode(roleCode);
        return role.hasAdminPrivileges();
    }

    /**
     * Get default role
     */
    public String getDefaultRole() {
        return Role.USER.getCode();
    }
}
