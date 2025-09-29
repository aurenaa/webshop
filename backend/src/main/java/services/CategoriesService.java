package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Category;
import dao.CategoryDAO;

@Path("/categories")
public class CategoriesService {
	@Context
	ServletContext ctx;
	
	public CategoriesService() {
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("categoryDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("categoryDAO", new CategoryDAO(contextPath));
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Category> getCategories() {
		CategoryDAO dao = (CategoryDAO) ctx.getAttribute("categoryDAO");
	    Collection<Category> categories = dao.findAll();
	    return categories;
	}
	
	@POST
	@Path("/add-category")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addCategoy(Category c, @Context HttpServletRequest request) {
		CategoryDAO categoryDao = (CategoryDAO) ctx.getAttribute("categoryDAO");
	    String contextPath = ctx.getRealPath("");
	    
	    if (!categoryDao.addCategory(c, contextPath)) {
	        return Response.status(400).entity("Error adding category").build();
	    }
	    	    
	    return Response.status(201).entity("Category added successfully").build();
	}
	
}