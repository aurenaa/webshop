package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.PATCH;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.User;
import dao.UserDAO;
import dto.UserDTO;

@Path("/users")
public class UserService {

    @Context
    ServletContext ctx;

    @PostConstruct
    public void init() {
        if (ctx.getAttribute("userDAO") == null) {
            String contextPath = ctx.getRealPath("");
            ctx.setAttribute("userDAO", new UserDAO(contextPath));
        }
    }
    
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("id") String id) { 
	    UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
	    User user = userDao.findById(id);
	    if (user == null) {
	        return Response.status(404).entity("User not found").build();
	    }
	    return Response.ok().entity(user).build();
	}
	
    @PATCH
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") String id, UserDTO updates) {
        UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
        String contextPath = ctx.getRealPath("");
        User updatedUser = dao.updateUser(id, updates, contextPath);
        dao.editFileUser(updatedUser, contextPath);
        return Response.ok(updatedUser).build();
    }
}
