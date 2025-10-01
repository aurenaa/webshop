package dto;

public class BidDTO {
	
	private String buyerId;
	private double offer;
	
	public BidDTO() {}
	
	public BidDTO(String buyerId, double offer)
	{
		this.buyerId = buyerId;
		this.offer = offer;
	}
	
	public String getBuyerId()
	{
		return buyerId;
	}
	
	public void setBuyerId(String buyerId)
	{
		this.buyerId = buyerId;
	}
	
	public double getOffer()
	{
		return offer;
	}
	
	public void setOffer(double offer)
	{
		this.offer = offer;
	}
}
