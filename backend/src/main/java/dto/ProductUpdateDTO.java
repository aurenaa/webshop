package dto;

import beans.Product.SaleType;

public class ProductUpdateDTO
{
	private String name;
	private String description;
    private String category;
    private double price;
    private SaleType saleType;
    
    public String getName() { return name; }
    public void setName(String name) {this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) {this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public SaleType getSaleType() { return saleType; }
    public void setSaleType(SaleType saleType) { this.saleType = saleType; }
}