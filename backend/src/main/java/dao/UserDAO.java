package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

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
	            return u;
	        }
	    }
	    return null;
	}
	
	public boolean usernameExists(String username) {
	    return users.containsKey(username);
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
			StringTokenizer st;
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while (st.hasMoreTokens()) {
				    String id = st.nextToken().trim();
	                String firstName = st.nextToken().trim();
	                String lastName = st.nextToken().trim();
	                String username = st.nextToken().trim();
	                String email = st.nextToken().trim();
	                String phoneNumber = st.nextToken().trim();
	                String password = st.nextToken().trim();
					
	                String roleStr = st.nextToken().trim();
	                String blockedStr = st.nextToken().trim();

	                Role role = Role.valueOf(roleStr);
	                boolean blocked = Boolean.parseBoolean(blockedStr);

	                List<String> productList = new ArrayList<>();
	                if (st.hasMoreTokens()) {
	                    String productsStr = st.nextToken().trim();
	                    if (!productsStr.isEmpty()) {
	                        for (String productId : productsStr.split("\\|")) {
	                            productList.add(productId);
	                        }
	                    }
	                }
	                java.util.Date birthDate = null;
	                if (st.hasMoreTokens()) {
	                    String birthDateStr = st.nextToken().trim();
	                    if (!birthDateStr.isEmpty()) {
	                        birthDate = java.sql.Date.valueOf(birthDateStr); // yyyy-MM-dd format
	                    }
	                }

	                String description = "";
	                if (st.hasMoreTokens()) {
	                    description = st.nextToken().trim();
	                }

	                users.put(id, new User(id, firstName, lastName, username, email, phoneNumber, password, role, blocked, productList, birthDate, description));
				}				
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
	}
	
	public void registerUser(User user, String contextPath) {
	    try {
	        File file = new File(contextPath + "/users.txt");
	        String productsStr = user.getProductList() != null ? String.join("|", user.getProductList()) : "";
	        
	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	        	out.println();
	            out.println(String.format("%s;%s;%s;%s;%s;%s;%s;%s;%b;%s",
	            	user.getId(),
	                user.getFirstName(),
	                user.getLastName(), 
	                user.getUsername(),
	                user.getEmail(),
	                user.getPhoneNumber(),
	                user.getPassword(),
	                user.getRole(),
	                user.isBlocked(),
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
                        String productsStr = String.join("|", user.getProductList());
                        String birthDateStr = user.getBirthDate() != null ? user.getBirthDate().toString() : "";
                        String descriptionStr = user.getDescription() != null ? user.getDescription() : "";
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
                                productsStr,
                                birthDateStr,
                                descriptionStr
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
    	User u = users.containsKey(id) ? users.get(id) : null;
    	if (updated.getUsername() != null) {
    		u.setUsername(updated.getUsername());
    	}
    	if (updated.getFirstName() != null) {
    		u.setFirstName(updated.getFirstName());
    	}
    	if (updated.getLastName() != null) {
    		u.setLastName(updated.getLastName());
    	}
    	if (updated.getEmail() != null) {
    		u.setEmail(updated.getEmail());
    	}
    	if (updated.getPhoneNumber() != null) {
    		u.setPhoneNumber(updated.getPhoneNumber());
    	}
    	if (updated.getPassword() != null) {
    		u.setPassword(updated.getPassword());
    	}
    	if (updated.getBirthDate() != null) {
    		u.setBirthDate(updated.getBirthDate());
    	}
    	if (updated.getDescription() != null) {
    		u.setDescription(updated.getDescription());
    	}
    	editFileUser(u, contextPath);
    	return u;
    }
}