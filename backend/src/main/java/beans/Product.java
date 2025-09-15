package beans;

import java.util.Date;

public class Product {
    private String id;
    private String name;
    private String description;
    private String category;
    private double price;
    private SaleType saleType;
    private Date datePosted;
    private String sellerId;

    public enum SaleType {
    	FIXED_PRICE,
        AUCTION
    }

    public Product() {
        this.datePosted = new Date();
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
    
    public Product(String id, String name, String description, String category, double price, SaleType saleType, Date datePosted, String sellerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.saleType = saleType;
        this.datePosted = datePosted;
        this.sellerId = sellerId;
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
}
