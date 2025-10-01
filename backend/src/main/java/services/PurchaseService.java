package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Product;
import beans.Product.Status;
import beans.Purchase;
import beans.User;
import dao.ProductDAO;
import dao.UserDAO;
import dao.PurchaseDAO;

@Path("/purchases")
public class PurchaseService {

    @Context
    ServletContext ctx;

    @PostConstruct
    public void init() {
        String path = ctx.getRealPath("");
        if (ctx.getAttribute("productDAO") == null) {
            ctx.setAttribute("productDAO", new ProductDAO(path));
        }
        if (ctx.getAttribute("userDAO") == null) {
            ctx.setAttribute("userDAO", new UserDAO(path));
        }
        if (ctx.getAttribute("purchaseDAO") == null) {
            ctx.setAttribute("purchaseDAO", new PurchaseDAO(path));
        }
    }

    @POST
    @Path("/{productId}/buy")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Purchase buyProduct(@PathParam("productId") String productId, Purchase purchaseRequest) {
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");
        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        PurchaseDAO purchaseDAO = (PurchaseDAO) ctx.getAttribute("purchaseDAO");

        Product product = productDAO.findProduct(productId);

        if (product.getStatus() != Status.AVAILABLE) {
            return null;
        }

        Purchase purchase = new Purchase();
        purchase.setProductId(productId);
        purchase.setBuyerId(purchaseRequest.getBuyerId());
        purchaseDAO.save(purchase, ctx.getRealPath(""));

        product.setStatus(Status.PROCESSING);
        productDAO.editFileProduct(product, ctx.getRealPath(""));

        User seller = userDAO.findById(product.getSellerId());
        if (seller != null) {
            userDAO.removeProductId(seller, product.getId(), ctx.getRealPath(""));
            userDAO.editFileUser(seller, ctx.getRealPath(""));
        }

        User buyer = userDAO.findById(purchase.getBuyerId());
        if (buyer != null) {
            userDAO.addPurchaseId(buyer, purchase.getId(), ctx.getRealPath(""));
            userDAO.editFileUser(buyer, ctx.getRealPath(""));
        }

        return purchase;
    }

    @POST
    @Path("/{purchaseId}/sell")
    @Produces(MediaType.APPLICATION_JSON)
    public Purchase sellProduct(@PathParam("purchaseId") String purchaseId) {
        PurchaseDAO purchaseDAO = (PurchaseDAO) ctx.getAttribute("purchaseDAO");
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");
        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

        Purchase purchase = purchaseDAO.findPurchase(purchaseId);
        Product product = productDAO.findProduct(purchase.getProductId());

        product.setStatus(Status.SOLD);
        productDAO.editFileProduct(product, ctx.getRealPath(""));

        User seller = userDAO.findById(product.getSellerId());
        if (seller != null) {
            userDAO.removeProductId(seller, product.getId(), ctx.getRealPath(""));
            userDAO.editFileUser(seller, ctx.getRealPath(""));
        }

        User buyer = userDAO.findById(purchase.getBuyerId());
        if (buyer != null) {
            userDAO.addPurchaseId(buyer, purchase.getId(), ctx.getRealPath(""));
            userDAO.editFileUser(buyer, ctx.getRealPath(""));
        }

        return purchase;
    }

    @POST
    @Path("/{purchaseId}/reject")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Purchase rejectPurchase(@PathParam("purchaseId") String purchaseId, @QueryParam("reason") String reason) {
        PurchaseDAO purchaseDAO = (PurchaseDAO) ctx.getAttribute("purchaseDAO");
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");

        Purchase purchase = purchaseDAO.findPurchase(purchaseId);
        Product product = productDAO.findProduct(purchase.getProductId());

        purchase.setRejectionReason(reason);
        purchaseDAO.editPurchase(purchase, ctx.getRealPath(""));

        product.setStatus(Status.REJECTED);
        productDAO.editFileProduct(product, ctx.getRealPath(""));

        return purchase;
    }

    @PATCH
    @Path("/{purchaseId}/cancel")
    @Produces(MediaType.APPLICATION_JSON)
    public Purchase cancelPurchase(@PathParam("purchaseId") String purchaseId) {
        PurchaseDAO purchaseDAO = (PurchaseDAO) ctx.getAttribute("purchaseDAO");
        ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");

        Purchase purchase = purchaseDAO.findPurchase(purchaseId);
        Product product = productDAO.findProduct(purchase.getProductId());

        product.setStatus(Status.CANCELED);
        productDAO.editFileProduct(product, ctx.getRealPath(""));

        return purchase;
    }
}