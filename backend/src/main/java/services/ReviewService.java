package services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.*;

import beans.Review;
import beans.User;
import dao.ReviewDAO;
import dao.UserDAO;
import dto.ReviewDTO;

@Path("/reviews")
public class ReviewService {

    @Context
    ServletContext ctx;

    @PostConstruct
    public void init() {
        String contextPath = ctx.getRealPath("");
        if (ctx.getAttribute("userDAO") == null) {
            ctx.setAttribute("userDAO", new UserDAO(contextPath));
        }
        if (ctx.getAttribute("reviewDAO") == null) {
            ctx.setAttribute("reviewDAO", new ReviewDAO(contextPath));
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Review> getReviews() {
        ReviewDAO dao = (ReviewDAO) ctx.getAttribute("reviewDAO");
	    Collection<Review> reviews = dao.findAll();
	    return reviews;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response submitReview(ReviewDTO dto) {
        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        ReviewDAO reviewDAO = (ReviewDAO) ctx.getAttribute("reviewDAO");

        User reviewedUser = userDAO.findById(dto.getReviewedUserId());
        User reviewer = userDAO.findById(dto.getReviewerId());

        if (reviewedUser == null || reviewer == null) {
            return Response.status(404).entity("User not found").build();
        }

        Review review = new Review();
        review.setReviewerId(dto.getReviewerId());
        review.setReviewedUserId(dto.getReviewedUserId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setDate(java.sql.Date.valueOf(LocalDate.now()));

        reviewDAO.save(review);
        reviewDAO.addReview(review, ctx.getRealPath(""));

        userDAO.addReviewId(reviewedUser, review.getId(), ctx.getRealPath(""), reviewDAO);

        return Response.status(201).entity(review).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteReview(@PathParam("id") String id) {
        ReviewDAO reviewDAO = (ReviewDAO) ctx.getAttribute("reviewDAO");
        boolean removed = reviewDAO.deleteReview(id, ctx.getRealPath(""));
        if (!removed) {
            return Response.status(404).entity("Review not found").build();
        }
        return Response.ok().entity("Review deleted").build();
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateReview(@PathParam("id") String id, ReviewDTO updates) {
        ReviewDAO reviewDAO = (ReviewDAO) ctx.getAttribute("reviewDAO");
        Review updated = reviewDAO.updateComment(id, updates, ctx.getRealPath(""));
        if (updated == null) {
            return Response.status(404).entity("Review not found").build();
        }
        return Response.ok(updated).build();
    }
}
