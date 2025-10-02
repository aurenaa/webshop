package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import beans.Review;
import dto.ReviewDTO;

public class ReviewDAO {
	private Map<String, Review> reviews = new HashMap<>();
	
	public ReviewDAO() {
	
	}
	
	public ReviewDAO(String contextPath) {
		loadReviews(contextPath);
	}
	
	public Review findById(String id) {
		return reviews.containsKey(id) ? reviews.get(id) : null;
	}
	
	public Collection<Review> findAll() {
		return reviews.values();
	}
	
	private void loadReviews(String contextPath) {
	    BufferedReader in = null;
	    try {
	        File file = new File(contextPath + "/reviews.txt");
	        in = new BufferedReader(new FileReader(file));
	        String line;
	        
	        while ((line = in.readLine()) != null) {
	            line = line.trim();
	            if (line.equals("") || line.indexOf('#') == 0)
	                continue;

	            String[] tokens = line.split(";", -1);
	            
	            if (tokens.length < 7) {
	                System.err.println("Invalid line format: " + line);
	                continue;
	            }

	            String id = tokens[0].trim();
	            String reviewerId = tokens[1].trim();
	            String reviewedUserId = tokens[2].trim();
	            String rating = tokens[3].trim();
	            String comment = tokens[4].trim();
	            String datePosted = tokens[5].trim();
	            String deleted = tokens[6].trim();
	            
	            Date date = java.sql.Date.valueOf(datePosted);
	            boolean flag = Boolean.parseBoolean(deleted);
	            reviews.put(id, new Review(id, reviewerId, reviewedUserId, Integer.parseInt(rating), comment, date, flag));
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (Exception e) {
	            }
	        }
	    }
	}
	
	public void addReview(Review review, String contextPath) {
	    try {
	        File file = new File(contextPath + "/reviews.txt");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	        String dateStr = sdf.format(review.getDate());
	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	            out.println(String.format("%s;%s;%s;%s;%s;%s;%s",
	            		review.getId(),
	            		review.getReviewerId(),
	            		review.getReviewedUserId(),
	            		review.getRating(),
	            		review.getComment(),
	            		dateStr,
	            		false
	            ));
	            out.println();
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }
	}
	
	public Review save(Review review) {
	    int newId;
	    if (reviews.isEmpty()) {
	        newId = 1;
	    } else {
	        int maxId = reviews.keySet().stream()
	                .mapToInt(Integer::parseInt)
	                .max()
	                .getAsInt();
	        newId = maxId + 1;
	    }
	    review.setId(String.valueOf(newId));
	    review.setDate(java.sql.Date.valueOf(LocalDate.now()));
	    reviews.put(review.getId(), review);
	    return review;
	}
	
	public List<Review> findReviewsByReviewedUser(String userId) {
	    Collection<Review> allReviews = this.findAll();
	    List<Review> result = new ArrayList<>();
	    for (Review r : allReviews) {
	        if (r.getReviewedUserId().equals(userId)) {
	            result.add(r);
	        }
	    }
	    return result;
	}
	
	public boolean deleteReview(String id, String contextPath) {
		Review reviewToDelete = findById(id);
		if (reviewToDelete != null) {
			reviewToDelete.setDeleted(true);
			editReview(reviewToDelete, contextPath);
			return true;
		}
		return false;
	}
	
	public Review updateComment(String id, ReviewDTO updated, String contextPath) {
		Review r = findById(id);
		if(updated.getComment() != null)
		{
			r.setComment(updated.getComment());
		}
		editReview(r, contextPath);
		return r;
	}
	
	
	public void editReview(Review updated, String contextPath) {
	    File file = new File(contextPath + "/reviews.txt");
	    try {
	        List<String> lines = new ArrayList<>();
	        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            String line;
	            while ((line = reader.readLine()) != null) {
	                if (line.trim().isEmpty()) continue;

	                String[] parts = line.split(";");
	                if (parts[0].equals(updated.getId())) {
	                    String newLine = String.format("%s;%s;%s;%d;%s;%s;%b",
	                            updated.getId(),
	                            updated.getReviewerId(),
	                            updated.getReviewedUserId(),
	                            updated.getRating(),
	                            updated.getComment(),
	                            sdf.format(updated.getDate()),
	                            updated.getDeleted()
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
}