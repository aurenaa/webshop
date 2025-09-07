package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import beans.User;

public class UserDAO {
	private Map<String, User> users = new HashMap<>();
	
	public UserDAO() {
	
	}
	
	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	public User find(String username, String password) {
		if (!users.containsKey(username)) {
			return null;
		}
		User user = users.get(username);
		if (!user.getPassword().equals(password)) {
			return null;
		}
		return user;
	}
	
	public Collection<User> findAll() {
		return users.values();
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
	                String firstName = st.nextToken().trim();
	                String lastName = st.nextToken().trim();
	                String username = st.nextToken().trim();
	                String email = st.nextToken().trim();
	                String phoneNumber = st.nextToken().trim();
	                String password = st.nextToken().trim();
					
					users.put(username, new User(firstName, lastName, username, email, phoneNumber, password, "BUYER", false));
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

	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	        	out.println();
	            out.println(String.format("%s;%s;%s;%s;%s;%s",
	                user.getFirstName(),
	                user.getLastName(), 
	                user.getUsername(),
	                user.getEmail(),
	                user.getPhoneNumber(),
	                user.getPassword()
	            ));
	        }

	        users.put(user.getUsername(), user);

	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }
	}
}