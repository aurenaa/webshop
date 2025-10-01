package beans;

public class Purchase {
    private String id;
    private String productId;
    private String buyerId;
    private String rejectionReason;

    public Purchase() {}

    public Purchase(String id, String productId, String buyerId, String rejectionReason) {
        this.id = id;
        this.productId = productId;
        this.buyerId = buyerId;
        this.rejectionReason = rejectionReason;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }
    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getBuyerId() {
        return buyerId;
    }
    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}