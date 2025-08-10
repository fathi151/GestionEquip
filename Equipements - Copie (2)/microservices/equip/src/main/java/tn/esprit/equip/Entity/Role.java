package tn.esprit.equip.Entity;

/**
 * Enum representing the different roles in the system
 */
public enum Role {
    USER("USER", "Standard User"),
    ADMIN("ADMIN", "Administrator"),
    DSI("DSI", "Direction des Systèmes d'Information"),
    DAG("DAG", "Direction Administrative et Générale"),
    JURIDIQUE("JURIDIQUE", "Service Juridique");

    private final String code;
    private final String description;

    Role(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Get Role from string code
     */
    public static Role fromCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return USER; // Default role
        }
        
        for (Role role : Role.values()) {
            if (role.getCode().equalsIgnoreCase(code.trim())) {
                return role;
            }
        }
        return USER; // Default if not found
    }

    /**
     * Check if a role has equipment access
     */
    public boolean hasEquipmentAccess() {
        return this == USER || this == ADMIN || this == DSI || this == DAG || this == JURIDIQUE;
    }

    /**
     * Check if a role has admin privileges
     */
    public boolean hasAdminPrivileges() {
        return this == ADMIN || this == DSI;
    }

    @Override
    public String toString() {
        return code;
    }
}
