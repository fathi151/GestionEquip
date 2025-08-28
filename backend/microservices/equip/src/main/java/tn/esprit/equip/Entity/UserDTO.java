package tn.esprit.equip.Entity;

public class UserDTO {

    private String registrationNumber; // New primary identifier
    private String token;
    private String role;
    private String username;
    private String email;

    // Getters and setters for id (backward compatibility)


    // Getters and setters for registrationNumber
    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }





        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }


}