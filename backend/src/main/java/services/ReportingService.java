package services;

import java.time.LocalDate;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.ProfileReport;
import beans.Review;
import beans.User;
import dao.ProfileReportDAO;
import dao.ReviewDAO;
import dao.UserDAO;

import dto.ProfileReportDTO;
import dto.ReviewDTO;
import dto.ProfileReportDTO.ReportStatus;

@Path("/report")
public class ReportingService {

    @Context
    ServletContext ctx;
    
    @PostConstruct
    public void init() {
        String contextPath = ctx.getRealPath("");
        if (ctx.getAttribute("userDAO") == null) {
            ctx.setAttribute("userDAO", new UserDAO(contextPath));
        }
        if (ctx.getAttribute("reportDAO") == null) {
            ctx.setAttribute("reportDAO", new ProfileReportDAO(contextPath));
        }
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<ProfileReport> getReport() {
    	ProfileReportDAO dao = (ProfileReportDAO) ctx.getAttribute("reportDAO");
	    Collection<ProfileReport> reports = dao.findAll();
	    return reports;
    }
    
    @PATCH
    @Path("/{id}/reject")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response rejectReport(@PathParam("id") String id, ProfileReportDTO updates) {
        ProfileReportDAO profileReportDAO = (ProfileReportDAO) ctx.getAttribute("reportDAO");
        ProfileReport updated = profileReportDAO.rejectReport(id, updates, ctx.getRealPath(""));
        if (updated == null) {
            return Response.status(404).entity("Report not found").build();
        }
    
        return Response.ok(updated).build();
    }
    
    @POST
    @Path("/reports")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response submitReport(ProfileReportDTO dto) {
        String reason = dto.getRejectionReason();
        String submittedByUserId = dto.getSubmittedByUserId();
        String reportedUserId = dto.getReportedUserId();
        ReportStatus status = dto.getStatus();

        UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
        ProfileReportDAO reportDAO = new ProfileReportDAO(ctx.getRealPath(""));

        User reportedUser = userDAO.findById(reportedUserId);
        User reporter = userDAO.findById(submittedByUserId);

        if (reportedUser == null || reporter == null) {
            return Response.status(404).entity("User not found").build();
        }

        ProfileReport report = new ProfileReport();
        report.setReportReason(reason);
        report.setStatus(ProfileReport.ReportStatus.valueOf(status.name()));
        report.setSubmittedByUserId(submittedByUserId);
        report.setReportedUserId(reportedUserId);
        report.setSubmissionDate(java.sql.Date.valueOf(LocalDate.now()));

        report = reportDAO.save(report);
        reportDAO.addReport(report, ctx.getRealPath(""));
  
        return Response.status(201).entity(report).build();
    }
}
