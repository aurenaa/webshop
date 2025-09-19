package beans;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;


public class Review implements Serializable {
	private String id;
	private String reviewerId;
	private String reviewedUserId;
	private String productId;
	private int rating;
	private String comment;
	private Date date;
    
	public Review() { }
	
	public Review(String id, String reviewerId, String reviewedUserId, String productId, int rating, String comment, Date date) {
		this.id = id;
		this.reviewerId = reviewerId;
		this.reviewedUserId = reviewedUserId;
		this.productId = productId;
		this.rating = rating;
		this.comment = comment;
		this.date = date;
	}
	
    public String getId() {
    	return id;
    }

    public void setId(String id) {
    	this.id = id;
    }
    
    public String getReviewerId() {
    	return reviewerId;
    }

    public void setReviewerId(String reviewerId) {
    	this.reviewerId = reviewerId;
    }
    
    public String getReviewedUserId() {
    	return reviewedUserId;
    }

    public void setReviewedUserId(String reviewedUserId) {
    	this.reviewedUserId = reviewedUserId;
    }
    
    public String getProductId() {
    	return productId;
    }

    public void setProductId(String productId) {
    	this.productId = productId;
    }
    
    public int getRating() {
    	return rating;
    }

    public void setRating(int rating) {
    	this.rating = rating;
    }
    
    public void setComment(String comment) {
    	this.comment = comment;
    }
    
    public String getComment() {
    	return comment;
    }
    
    public void setDate(Date date) {
    	this.date = date;
    }
    
    public Date getDate() {
    	return date;
    }
}