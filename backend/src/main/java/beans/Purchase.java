package beans;

import java.util.Date;

public class Purchase {
    private String id;
    private String productId;
    private String buyerId;
    private String rejectionReason;
    private Date date;
    
    public Purchase() {}

    public Purchase(String id, String productId, String buyerId, String rejectionReason, Date date) {
        this.id = id;
        this.productId = productId;
        this.buyerId = buyerId;
        this.rejectionReason = rejectionReason;
        this.date = date;
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
    
    public Date getDate() {
        return date;
    }
    
    public void setDate(Date date) {
        this.date = date;
    }
}