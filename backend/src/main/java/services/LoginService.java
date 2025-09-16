package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.User;
import dao.UserDAO;

@Path("")
public class LoginService {
	@Context
	ServletContext ctx;
	
	public LoginService() {
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("userDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(User user, @Context HttpServletRequest request) {
	    UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
	    if (userDao == null) {
	        return Response.status(500).entity("Server configuration error").build();
	    }
	    
	    if (user == null) {
	        return Response.status(400).entity("Invalid request data").build();
	    }
	    
	    if (user.getUsername() == null || user.getPassword() == null) {
	        return Response.status(400).entity("Username and password required").build();
	    }
	    
	    User loggedUser = userDao.findByUsernameAndPassword(user.getUsername(), user.getPassword());
	    if (loggedUser == null) {
	        return Response.status(400).entity("Invalid username and/or password").build();
	    }
	    
	    request.getSession().setAttribute("user", loggedUser);
	    return Response.ok()
	        .entity("{\"userId\": \"" + loggedUser.getId() + "\"}")
	        .build();
	}
	
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response register(User u, @Context HttpServletRequest request) {
	    UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
	    
	    if (userDao.usernameExists(u.getUsername())) {
	        return Response.status(400).entity("Username already exists").build();
	    }
	    
	    if (userDao.emailExists(u.getEmail())) {
	        return Response.status(400).entity("Email already exists").build();
	    }
	    
	    User user = userDao.save(u);
	    userDao.registerUser(user, ctx.getRealPath(""));
	    
	    request.getSession().setAttribute("user", user);
	    
	    return Response.status(201).entity("User registered successfully").build();
	}
	
	@GET
	@Path("/check-username/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response checkUsernameExists(@PathParam("username") String username) {
	    UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
	    boolean exists = userDao.usernameExists(username);
	    
	    return Response.status(200)
	            .entity("{\"exists\": " + exists + "}")
	            .build();
	}
}