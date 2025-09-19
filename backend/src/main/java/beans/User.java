package beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;

import javax.json.bind.annotation.JsonbDateFormat;

import dto.ReviewDTO;


public class User implements Serializable {
	
	public enum Role { BUYER, SELLER, ADMINISTRATOR }
	private String id;
	private String firstName;
	private String lastName;
	private String username;
	private String email;
	private String phoneNumber;
	private String password;
	
    @JsonbDateFormat(value = "yyyy-MM-dd")
    private LocalDate birthDate;        
    private String profilePicture; 
    private String description;   
    private Role role;          
    private boolean blocked; 
    private List<String> productList;
    
    private List<String> reviewsReceived;
    private double averageRating;
    private List<ReviewDTO> feedback;
    
	public User() {
	}

	//for registration
	public User(String id, String firstName, String lastName, String username, String email, String phoneNumber, String password, Role role, boolean blocked, List<String> productList) {
	    this.id = id;
		this.firstName = firstName;
	    this.lastName = lastName;
	    this.username = username;
	    this.email = email;
	    this.phoneNumber = phoneNumber;
	    this.password = password;
	    this.role = role;
	    this.blocked = blocked;
	    this.birthDate = null;
	    this.profilePicture = null;
	    this.description = null;
	    this.productList = productList != null ? productList : new ArrayList<>();
	}

    public User(String id, String firstName, String lastName, String username, String email, String phoneNumber, String password, LocalDate birthDate, String profilePicture, String description, Role role, boolean blocked, List<String> productList) {
	    this.id = id;
    	this.firstName = firstName;
	    this.lastName = lastName;
	    this.username = username;
	    this.email = email;
	    this.phoneNumber = phoneNumber;
	    this.password = password;
	    this.birthDate = birthDate;
	    this.profilePicture = profilePicture;
	    this.description = description;
	    this.role = role;
	    this.blocked = blocked;
	    this.productList = productList;
    }
    
    public User(String id, String firstName, String lastName, String username, String email, String phoneNumber,
            String password, Role role, boolean blocked, List<String> productList, LocalDate birthDate, String description, 
            String profilePicture, Double averageRating, List<String> reviewsReceived) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.role = role;
    this.blocked = blocked;
    this.productList = productList != null ? productList : new ArrayList<>();
    this.birthDate = birthDate;
    this.description = description;
    this.profilePicture = profilePicture;
    this.averageRating = averageRating;
    this.reviewsReceived = reviewsReceived;
}
    
    public String getId() {
    	return id;
    }

    public void setId(String id) {
    	this.id = id;
    }
    
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
    
    public void setBirthDate(String birthDateStr) {
        if (birthDateStr == null || birthDateStr.isEmpty()) {
            this.birthDate = null;
        } else {
            this.birthDate = LocalDate.parse(birthDateStr);
        }
    }
    
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getProfilePicture() { 
    	return profilePicture; 
    }
    
    public void setProfilePicture(String profilePicture) {
    	this.profilePicture = profilePicture; 
    }

    public String getDescription() { 
    	return description;
    }
    
    public void setDescription(String description) { 
    	this.description = description;
    }

    public Role getRole() { 
    	return role; 
    }
    public void setRole(Role role) { 
    	this.role = role; 
    }

    public boolean isBlocked() { 
    	return blocked; 
    }
    
    public void setBlocked(boolean blocked) { 
    	this.blocked = blocked; 
    }
    
    public void setProductList(ArrayList<String> productList) {
    	this.productList = productList;
    }
    
	public List<String> getProductList() {
	    return productList;
	}
	
    public void setReviewsList(ArrayList<String> reviewsReceived) {
    	this.reviewsReceived = reviewsReceived;
    }
    
	public List<String> getReviewsList() {
	    return reviewsReceived;
	}
	
    public double getRating() {
    	return averageRating;
    }

    public void setRating(double averageRating) {
    	this.averageRating = averageRating;
    }	
    
    public List<ReviewDTO> getFeedback() { 
    	return feedback;
    }
    
    public void setFeedback(List<ReviewDTO> feedback) {
    	this.feedback = feedback;
    }

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
		result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
		result = prime * result + ((password == null) ? 0 : password.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		if (email == null) {
			if (other.email != null)
				return false;
		} else if (!email.equals(other.email))
			return false;
		if (firstName == null) {
			if (other.firstName != null)
				return false;
		} else if (!firstName.equals(other.firstName))
			return false;
		if (lastName == null) {
			if (other.lastName != null)
				return false;
		} else if (!lastName.equals(other.lastName))
			return false;
		if (password == null) {
			if (other.password != null)
				return false;
		} else if (!password.equals(other.password))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "User [firstName=" + firstName + ", lastName=" + lastName + ", email=" + email + ", username=" + username
				+ ", password=" + password + "]";
	}

	private static final long serialVersionUID = 6640936480584723344L;
}
