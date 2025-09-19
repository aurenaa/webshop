package beans;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

public class Product {
    private String id;
    private String name;
    private String description;
    private String category;
    private double price;
    private SaleType saleType;
    private Date datePosted;
    private String sellerId;
    private List<Bid> bids;
    private Status status;
    
    public enum SaleType {
    	FIXED_PRICE,
        AUCTION
    }
    
    public enum Status {
    	PROCESSING, SOLD, REJECTED, CANCELED
    }

    public Product() {
        this.datePosted = new Date();
        this.bids = new ArrayList<>();
    }

    public Product(String id, String name, String description, String category, double price, SaleType saleType, String sellerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.saleType = saleType;
        this.datePosted = new Date();
        this.sellerId = sellerId;
    }
    
    public Product(String id, String name, String description, String category, double price, SaleType saleType, Date datePosted, String sellerId, Status status, List<Bid> bids) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.saleType = saleType;
        this.datePosted = datePosted;
        this.sellerId = sellerId;
        this.status = status;
	    this.bids = bids;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public SaleType getSaleType() {
        return saleType;
    }

    public void setSaleType(SaleType saleType) {
        this.saleType = saleType;
    }

    public Date getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(Date datePosted) {
        this.datePosted = datePosted;
    }
    
    public String getSellerId() {
    	return this.sellerId;
    }
    
    public void setSellerId(String sellerId) {
    	this.sellerId = sellerId;
    }
    
    public List<Bid> getBids() {
        return bids;
    }

    public void setBids(List<Bid> bids) {
        this.bids = bids;
    }
    
    public Status getStatus() { 
    	return status; 
    }
    
    public void setStatus(Status status) { 
    	this.status = status; 
    }
}
