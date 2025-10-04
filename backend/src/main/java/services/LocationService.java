package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Location;
import dao.LocationDAO;

@Path("/locations")
public class LocationService {
	@Context
	ServletContext ctx;
	
	public LocationService() {
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("locationDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("locationDAO", new LocationDAO(contextPath));
		}
	}
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Location createLocation(Location location) {
        LocationDAO locationDAO = (LocationDAO) ctx.getAttribute("locationDAO");
        return locationDAO.save(location, ctx.getRealPath(""));
    }
}