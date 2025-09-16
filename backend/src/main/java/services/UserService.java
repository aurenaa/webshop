package services;

import java.io.InputStream;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import beans.User;
import dao.UserDAO;
import dto.UserDTO;

import javax.servlet.annotation.MultipartConfig;

@MultipartConfig
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
        //dao.editFileUser(updatedUser, contextPath);
        return Response.ok(updatedUser).build();
    }
    
    @PATCH
    @Path("/{id}/upload-image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProfileImage(@PathParam("id") String id,
                                       @Context HttpServletRequest request) {
        UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
        String contextPath = ctx.getRealPath("");

        try {
            Part filePart = request.getPart("profileImage");
            try (InputStream fileInputStream = filePart.getInputStream()) {
                String fileName = filePart.getSubmittedFileName();
                dao.saveProfileImage(id, fileInputStream, fileName, contextPath);
            }

            return Response.ok(dao.findById(id)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("Failed to upload image").build();
        }
    }
}
