package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.PATCH;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Product;
import beans.User;
import dao.ProductDAO;
import dao.UserDAO;
import dto.ProductUpdateDTO;


@Path("/mainpage")
public class ProductService {
	@Context
	ServletContext ctx;
	
	public ProductService() {
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("productDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("productDAO", new ProductDAO(contextPath));
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Product> getProducts() {
	    ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
	    Collection<Product> products = dao.findAll();
	    return products;
	}
	
	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Product newProduct(Product p) {
	    ProductDAO productDAO = (ProductDAO) ctx.getAttribute("productDAO");
	    UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
	    Product product = productDAO.save(p);
	    productDAO.addProduct(product, ctx.getRealPath(""));
	    
	    User user = userDAO.findById(p.getSellerId());
	    if (user != null) {
	    	userDAO.addProductId(user, product.getId(), ctx.getRealPath(""));
	    	userDAO.editFileUser(user, ctx.getRealPath(""));
	    }
	    return product;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Product getProductById(@PathParam("id") String id) {
	    ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
	    Product product = dao.findProduct(id);
	    return product;
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Product deleteProduct(@PathParam("id") String id) {
		ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		Product product = dao.findProduct(id);
	    if (product != null) {
	        dao.deleteProduct(id, ctx.getRealPath(""));
	        User owner = userDAO.findById(product.getSellerId());
	        if (owner != null) {
	            userDAO.removeProductId(owner, product.getId(), ctx.getRealPath(""));
	        }
	    }
	    return product;
	}
	
	@PUT
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Product putProduct(@PathParam("id") String id, Product product) {
		ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
		return dao.updateProducts(id, product, ctx.getRealPath(""));
	}
	
	@PATCH
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Product patchProduct(@PathParam("id") String id, ProductUpdateDTO updates) {
	    ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
	    String contextPath = ctx.getRealPath("");
	    Product product = dao.updateProduct(id, updates, contextPath);
	    
	    dao.editFileProduct(product, contextPath);
	    return product;
	}
}