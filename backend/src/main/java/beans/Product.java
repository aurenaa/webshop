package beans;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Product {
    private String id;
    private String name;
    private String description;
    private Category category;
    private double price;
    private SaleType saleType;
    private LocalDate datePosted;
    private String sellerId;
    private List<Bid> bids;
    private Status status;
    private double biggestBid;
    private List<String> productPictures;
    private Location location;

    public enum SaleType {
    	FIXED_PRICE,
        AUCTION
    }
    
    public enum Status {
    	AVAILABLE, PROCESSING, SOLD, REJECTED, CANCELED
    }

    public Product() {
    	this.datePosted = LocalDate.now();
        this.bids = new ArrayList<>();
        this.productPictures = new ArrayList<>();
    }


    public Product(String id, String name, String description, Category category, double price, SaleType saleType, String sellerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.saleType = saleType;
        this.datePosted = LocalDate.now();
        this.sellerId = sellerId;
    }
    
    public Product(String id, String name, String description, Category category, double price, SaleType saleType, LocalDate datePosted, String sellerId, Location location, Status status, List<String> productPictures, List<Bid> bids) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.saleType = saleType;
        this.datePosted = datePosted;
        this.sellerId = sellerId;
        this.status = status;
        this.productPictures = productPictures;
	    this.bids = bids;
	    this.location = location;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
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

    public LocalDate getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(LocalDate date) {
        this.datePosted = date;
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
    
    public double getBiggestBid()
    {
    	return biggestBid;
    }
    
    public void setBiggestBid(double bBid)
    {
    	this.biggestBid = bBid;
    }
    
    public double getMaxBid()
    {
    	if(bids == null || bids.isEmpty())
    	{
    		return price;
    	}
    	return bids.stream().mapToDouble(Bid::getOffer).max().orElse(price);
    }

    public List<String> getProductPictures() { 
    	return productPictures; 
    }
    
    public void setProductPictures(List<String> productPictures) {
    	this.productPictures = productPictures; 
    }
    
    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
