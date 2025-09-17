package beans;

public class Bid {
	private double offer;
    private String buyerId;
    
    public Bid() {}
    
    public Bid(double offer, String buyerId) {
    	this.offer = offer;
    	this.buyerId = buyerId;
    }
    
    public double getOffer() {
    	return offer; 
    }
    
    public void setOffer(double offer) { 
    	this.offer = offer;
    }

    public String getBuyerId() { 
    	return buyerId; 
    }
    
    public void setBuyerId(String buyerId) { 
    	this.buyerId = buyerId; 
    }
}