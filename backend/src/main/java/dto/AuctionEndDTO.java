package dto;

public class AuctionEndDTO {
	
    private String sellerId;
    private String buyerId;

    public AuctionEndDTO() { }

    public AuctionEndDTO(String sellerId, String buyerId) {
        this.sellerId = sellerId;
        this.buyerId = buyerId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }
}