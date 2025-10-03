package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Product;
import beans.Review;
import beans.User;
import dao.ProductDAO;
import dao.PurchaseDAO;
import dao.ReviewDAO;
import dao.UserDAO;
import dto.AuctionEndDTO;
import dto.ReviewDTO;
import dto.UserDTO;

@Path("/users")
public class UserService {

    @Context
    ServletContext ctx;

    @PostConstruct
    public void init() {
        String contextPath = ctx.getRealPath("");
        if (ctx.getAttribute("userDAO") == null) {
            ctx.setAttribute("userDAO", new UserDAO(contextPath));
        }
        if (ctx.getAttribute("productDAO") == null) {
            ctx.setAttribute("productDAO", new ProductDAO(contextPath));
        }
    }
    
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getUsers() {
	    UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
	    Collection<User> users = dao.findAll();
	    return users;
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
        return Response.ok(updatedUser).build();
    }
    
    @PATCH
    @Path("/{productId}/endAuction")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response endAuction(@PathParam("productId") String productId, AuctionEndDTO dto) {
        String sellerId = dto.getSellerId();
        String buyerId = dto.getBuyerId();
    	UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
    	ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");
    	
    	User seller = userDAO.findById(sellerId);
    	User buyer = userDAO.findById(buyerId);
		
    	userDAO.removeProductId(seller, productId, ctx.getRealPath(""));
    	userDAO.addProductId(buyer, productId, ctx.getRealPath(""));
    	productDAO.statusSold(productId, ctx.getRealPath(""));
    	return Response.status(201).entity("Auction ended successfully").build();
    }
    
    
    @GET
    @Path("/{id}/withFeedback")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserWithFeedback(@PathParam("id") String id) { 
        UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
        ReviewDAO reviewDAO = new ReviewDAO(ctx.getRealPath(""));

        User user = userDao.findById(id);
        if (user == null) {
            return Response.status(404).entity("User not found").build();
        }

        List<Review> reviewsForUser = reviewDAO.findReviewsByReviewedUser(id);

        List<ReviewDTO> feedback = new ArrayList<>();
        for (Review r : reviewsForUser) {
            ReviewDTO dto = new ReviewDTO();
            dto.setId(r.getId());
            dto.setRating(r.getRating());
            dto.setComment(r.getComment());
            dto.setDate(r.getDate());

            User reviewer = userDao.findById(r.getReviewerId());
            dto.setReviewerUsername(reviewer != null ? reviewer.getUsername() : "Unknown");
         
            feedback.add(dto);
        }

        user.setFeedback(feedback);
        return Response.ok().entity(user).build();
    }
    
    @GET
    @Path("/{id}/purchases")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getPurchases(@PathParam("id") String userId) {
        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");

        User user = userDAO.findById(userId);
        if (user == null) {
            throw new WebApplicationException("User not found", 404);
        }

        List<Product> purchased = new ArrayList<>();
        for (String pid : user.getPurchaseList()) {
            Product p = productDAO.findProduct(pid);
            if (p != null) {
                purchased.add(p);
            }
        }

        return purchased;
    }
    
    @GET
    @Path("/suspicious")
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getSuspiciousUsers() {
        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        PurchaseDAO purchaseDAO = (PurchaseDAO) ctx.getAttribute("purchaseDAO");
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");

        if (purchaseDAO == null) {
            purchaseDAO = new PurchaseDAO(ctx.getRealPath(""));
            ctx.setAttribute("purchaseDAO", purchaseDAO);
        }

        List<User> suspicious = userDAO.getSuspiciousUsers(purchaseDAO, productDAO);
        return suspicious;
    }
    
}
