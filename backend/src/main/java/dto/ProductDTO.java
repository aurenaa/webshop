package dto;
import beans.Location;
import beans.Category;
import beans.Product.SaleType;
import beans.Product.Status;;

public class ProductDTO
{
	private String name;
	private String description;
    private Category category;
    private double price;
    private SaleType saleType;
    private boolean buyerReviewed;
    private boolean sellerReviewed;
    private Status status;
    private double biggestBid;
    private Location location;

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
    
    public String getName() { return name; }
    public void setName(String name) {this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) {this.description = description; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public SaleType getSaleType() { return saleType; }
    public void setSaleType(SaleType saleType) { this.saleType = saleType; }
    
    public boolean getBuyerReviewed() { 
    	return buyerReviewed; 
    }
    
    public void setBuyerReviewed(boolean buyerReviewed) { 
    	this.buyerReviewed = buyerReviewed; 
    }
    
    public boolean getSellerReviewed() { 
    	return sellerReviewed; 
    }
    
    public void setSellerReviewed(boolean sellerReviewed) { 
    	this.sellerReviewed = sellerReviewed; 
    }
    
    public Status getStatus()
    {
    	return status;
    }
    
    public void setStatus(Status status)
    {
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
}