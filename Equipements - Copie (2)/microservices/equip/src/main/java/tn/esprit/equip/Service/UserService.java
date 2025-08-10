package tn.esprit.equip.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.equip.Entity.*;
import tn.esprit.equip.Repository.*;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StatusRepository statusRepository;
    
    @Autowired
    private PositionRepository positionRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private HarborRepository harborRepository;
    
    @Autowired
    private AgentRepository agentRepository;

    // User CRUD operations
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByRegistrationNumber(String registrationNumber) {
        return userRepository.findByRegistrationNumber(registrationNumber);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String registrationNumber) {
        userRepository.deleteById(registrationNumber);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Status operations
    public List<Status> getAllStatuses() {
        return statusRepository.findAll();
    }

    public Status saveStatus(Status status) {
        return statusRepository.save(status);
    }

    // Position operations
    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position savePosition(Position position) {
        return positionRepository.save(position);
    }

    // Job operations
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    // Harbor operations
    public List<Harbor> getAllHarbors() {
        return harborRepository.findAll();
    }

    public Harbor saveHarbor(Harbor harbor) {
        return harborRepository.save(harbor);
    }

    // Agent operations
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Agent saveAgent(Agent agent) {
        return agentRepository.save(agent);
    }

    public Agent findAgentByUsername(String username) {
        return agentRepository.findByUsername(username);
    }

    public Optional<Agent>findAgentByEmail(String email) {
        return agentRepository.findByEmail(email);
    }
    List<User>findUsers(String Search){
        return userRepository.findByRegistrationNumberContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Search,Search,Search,Search);
    }
}
