package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.time.LocalDate;
import java.util.Map;

import beans.User;
import beans.User.Role;
import dto.UserDTO;

public class UserDAO {
	private Map<String, User> users = new HashMap<>();
	
	public UserDAO() {
	
	}
	
	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	public User findById(String id) {
		return users.containsKey(id) ? users.get(id) : null;
	}
	
	public Collection<User> findAll() {
		return users.values();
	}
	
	public User findByUsernameAndPassword(String username, String password) {    	  
	    for (User u : users.values()) {	   
	        if (u.getUsername().equals(username) && u.getPassword().equals(password)) {
	            if (u.isBlocked()) {
	                return null;
	            }
	            return u;
	        }
	    }
	    return null;
	}
	
	public boolean usernameExists(String username) {
	    for (User user : users.values()) {  
	        if (user.getUsername().equals(username)) 
	            return true;
	        }
	    return false;
	}
	
	public boolean emailExists(String email) {
	    for (User user : users.values()) {
	        if (user.getEmail().equalsIgnoreCase(email)) {
	            return true;
	        }
	    }
	    return false;
	}
	
	private void loadUsers(String contextPath) {
	    BufferedReader in = null;
	    try {
	        File file = new File(contextPath + "/users.txt");
	        in = new BufferedReader(new FileReader(file));
	        String line;
	        
	        while ((line = in.readLine()) != null) {
	            line = line.trim();
	            if (line.equals("") || line.indexOf('#') == 0)
	                continue;

	            String[] tokens = line.split(";", -1);
	            
	            if (tokens.length < 9) {
	                System.err.println("Invalid line format: " + line);
	                continue;
	            }

	            String id = tokens[0].trim();
	            String firstName = tokens[1].trim();
	            String lastName = tokens[2].trim();
	            String username = tokens[3].trim();
	            String email = tokens[4].trim();
	            String phoneNumber = tokens[5].trim();
	            String password = tokens[6].trim();
	            String roleStr = tokens[7].trim();
	            String blockedStr = tokens[8].trim();
	            
	            if (roleStr.isEmpty()) {
	                System.err.println("Empty role for user: " + id);
	                continue;
	            }
	            
	            Role role;
	            try {
	                role = Role.valueOf(roleStr.toUpperCase());
	            } catch (IllegalArgumentException e) {
	                System.err.println("Invalid role '" + roleStr + "' for user: " + id);
	                continue;
	            }
	            
	            boolean blocked = Boolean.parseBoolean(blockedStr);

	            LocalDate birthDate = null;
	            String description = "";
	            List<String> productList = new ArrayList<>();

	            if (tokens.length > 9 && !tokens[9].trim().isEmpty()) {
	                String birthDateStr = tokens[9].trim();
	                if (!birthDateStr.contains("|") && (birthDateStr.contains("-") || birthDateStr.contains("/"))) {
	                    try {
	                        birthDate = LocalDate.parse(birthDateStr);
	                    } catch (Exception e) {
	                        System.err.println("Invalid birth date for user " + id + ": " + birthDateStr);
	                    }
	                } else {
	                    System.out.println("No birth date, parsing as products: " + birthDateStr);
	                    if (birthDateStr.contains("|")) {
	                        for (String productId : birthDateStr.split("\\|")) {
	                            if (!productId.trim().isEmpty()) {
	                                productList.add(productId.trim());
	                            }
	                        }
	                    }
	                }
	            }

	            if (tokens.length > 10 && !tokens[10].trim().isEmpty()) {
	                String descStr = tokens[10].trim();
	                if (!descStr.contains("|")) {
	                    description = descStr;
	                } else {
	                    if (productList.isEmpty()) {
	                        for (String productId : descStr.split("\\|")) {
	                            if (!productId.trim().isEmpty()) {
	                                productList.add(productId.trim());
	                            }
	                        }
	                    }
	                }
	            }

	            if (tokens.length > 11 && !tokens[11].trim().isEmpty() && productList.isEmpty()) {
	                String productsStr = tokens[11].trim();
	                for (String productId : productsStr.split("\\|")) {
	                    if (!productId.trim().isEmpty()) {
	                        productList.add(productId.trim());
	                    }
	                }
	            }
	            
	            String profilePicture = "";
	            if (tokens.length > 12 && !tokens[12].trim().isEmpty()) {
	                profilePicture = tokens[12].trim();
	            }
	            
	            users.put(id, new User(id, firstName, lastName, username, email, phoneNumber, password, role, blocked, productList, birthDate, description, profilePicture));
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (Exception e) {
	            }
	        }
	    }
	}
	
	public void registerUser(User user, String contextPath) {
	    try {
	        File file = new File(contextPath + "/users.txt");
	        String productsStr = user.getProductList() != null ? String.join("|", user.getProductList()) : "";
	        String birthDateStr = user.getBirthDate() != null ? user.getBirthDate().toString() : "";
	        String descriptionStr = user.getDescription() != null ? user.getDescription() : "";

	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	            out.println();
	            out.println(String.format("%s;%s;%s;%s;%s;%s;%s;%s;%b;%s;%s;%s",
	                    user.getId(),
	                    user.getFirstName(),
	                    user.getLastName(),
	                    user.getUsername(),
	                    user.getEmail(),
	                    user.getPhoneNumber(),
	                    user.getPassword(),
	                    user.getRole(),        
	                    user.isBlocked(),           
	                    birthDateStr,      
	                    descriptionStr,
	                    productsStr
	            ));
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }
	}
	
	public User save(User user) {
	    int maxId = -1;
	    for (String id : users.keySet()) {
	        int idNum = Integer.parseInt(id);
	        if (idNum > maxId) maxId = idNum;
	    }
	    int newId = maxId + 1;
	    user.setId(String.valueOf(newId));
	    
	    users.put(user.getId(), user);
		return user;
	}
	
	public void addProductId(User user, String productId) {
        if (user.getProductList() == null) {
            user.setProductList(new ArrayList<>());
        }
        user.getProductList().add(productId);

        if (user.getRole() == Role.BUYER) {
            user.setRole(Role.SELLER);
        }
	}

	public void editFileUser(User user, String contextPath) {
	    File file = new File(contextPath + "/users.txt");
	    try {
	        List<String> lines = new ArrayList<>();
	        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            String line;
	            while ((line = reader.readLine()) != null) {
	                if (line.trim().isEmpty()) continue;

	                String[] parts = line.split(";");
	                if (parts[0].equals(user.getId())) {
	                    String productsStr = user.getProductList() != null ? String.join("|", user.getProductList()) : "";	                   
	                    String birthDateStr = user.getBirthDate() != null ? user.getBirthDate().toString() : "";
	                    String descriptionStr = user.getDescription() != null ? user.getDescription() : "";
	                    String profilePictureStr = user.getProfilePicture() != null ? user.getProfilePicture() : "";
	                    
	                    String newLine = String.format("%s;%s;%s;%s;%s;%s;%s;%s;%b;%s;%s;%s",
	                        user.getId(),
	                        user.getFirstName(),
	                        user.getLastName(),
	                        user.getUsername(),
	                        user.getEmail(),
	                        user.getPhoneNumber(),
	                        user.getPassword(),
	                        user.getRole(),     
	                        user.isBlocked(),             
	                        birthDateStr,   
	                        descriptionStr,
	                        productsStr,
	                        profilePictureStr
	                    );
	                    lines.add(newLine);
	                } else {
	                    lines.add(line);
	                }
	            }
	        }
	        try (PrintWriter writer = new PrintWriter(new FileWriter(file, false))) {
	            for (String l : lines) {
	                writer.println(l);
	            }
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
    
    public void removeProductId(User user, String productId, String contextPath) {
        if (user.getProductList() != null) {
            user.getProductList().remove(productId);
            editFileUser(user, contextPath);
        }
    }
    
    public User updateUser(String id, UserDTO updated, String contextPath) {
        User u = users.get(id);
        if (u == null) {
            return null; 
        }

        if (updated.getDescription() != null) {
            u.setDescription(updated.getDescription());
        }
        
        if (updated.getFirstName() != null) {
        	u.setFirstName(updated.getFirstName());
        }
        
        if (updated.getLastName() != null) {
        	u.setLastName(updated.getLastName());
        }

        if (updated.getUsername() != null) {
        	u.setUsername(updated.getUsername());
        }
        
        if (updated.getPhoneNumber() != null) {
        	u.setPhoneNumber(updated.getPhoneNumber());
        }
        
        if (updated.getBirthDate() != null) {
        	u.setBirthDate(updated.getBirthDate());
        }

        if (updated.getPassword() != null) {
        	u.setPassword(updated.getPassword());
        }
        
        try {
            editFileUser(u, contextPath);
            System.out.println("File updated successfully.");
        } catch (Exception e) {
            System.out.println("Exception during file update: " + e.getMessage());
            e.printStackTrace();
        }

        return u;
    }
    
    public String saveProfileImage(String userId, InputStream fileInputStream, String fileName, String contextPath) throws IOException {
        File uploadDir = new File(contextPath + "/images/profiles");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String ext = "";
            int dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > 0) {
                ext = fileName.substring(dotIndex);
            }
            String newFileName = "user_" + userId + ext;

            File outputFile = new File(uploadDir, newFileName);

            try (OutputStream out = new FileOutputStream(outputFile)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }

            User u = users.get(userId);
            if (u != null) {
                u.setProfilePicture(newFileName); 
                editFileUser(u, contextPath); 
            }

            return newFileName;
        }
}