package services;

import java.time.LocalDate;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Review;
import beans.User;
import dao.ProductDAO;
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
    
    @POST
    @Path("/reviews")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response submitReview(ReviewDTO dto) {
        String reviewedUserId = dto.getReviewedUserId();
        String reviewerId = dto.getReviewerId();
        int rating = dto.getRating();
        String comment = dto.getComment();

        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        ReviewDAO reviewDAO = new ReviewDAO(ctx.getRealPath(""));

        User reviewedUser = userDAO.findById(reviewedUserId);
        User reviewer = userDAO.findById(reviewerId);

        if (reviewedUser == null || reviewer == null) {
            return Response.status(404).entity("User not found").build();
        }

        Review review = new Review();
        review.setReviewerId(reviewerId);
        review.setReviewedUserId(reviewedUserId);
        review.setRating(rating);
        review.setComment(comment);
        review.setDate(java.sql.Date.valueOf(LocalDate.now()));

        review = reviewDAO.save(review);
        reviewDAO.addReview(review, ctx.getRealPath(""));
       
        userDAO.addReviewId(reviewedUser, review.getId(), ctx.getRealPath(""), reviewDAO);
        
        return Response.status(201).entity(review).build();
    }
}
