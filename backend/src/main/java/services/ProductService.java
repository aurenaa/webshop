package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Product;
import dao.ProductDAO;


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
	    ProductDAO dao = (ProductDAO) ctx.getAttribute("productDAO");
	    Product product = dao.save(p);
	    dao.addProduct(product, ctx.getRealPath(""));
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
		return dao.deleteProduct(id);
	}
}