package dto;

import java.time.LocalDate;

public class UserDTO {
	private String firstName;
	private String lastName;
	private String username;
	private String email;
	private String phoneNumber;
	private String password;
    private LocalDate birthDate;        
    private String description; 
    private String profilePicture;
    
    public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
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
	
	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
    public LocalDate getBirthDate() { 
    	return birthDate; 
    }
    
    public void setBirthDate(LocalDate birthDate) { 
    	this.birthDate = birthDate; 
    }
    
    public String getDescription() { 
    	return description;
    }
    
    public void setDescription(String description) { 
    	this.description = description;
    }
    
    public String getProfilePicture() { 
    	return description;
    }
    
    public void setProfilePicture(String profilePicture) { 
    	this.profilePicture = profilePicture;
    }
    
}
