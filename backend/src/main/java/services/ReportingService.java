package services;

import java.time.LocalDate;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.ProfileReport;
import beans.User;
import dao.ProfileReportDAO;
import dao.UserDAO;

import dto.ProfileReportDTO;
import dto.ProfileReportDTO.ReportStatus;

@Path("/report")
public class ReportingService {

    @Context
    ServletContext ctx;
    
    @PostConstruct
    public void init() {
        String contextPath = ctx.getRealPath("");
        ctx.setAttribute("userDAO", new UserDAO(contextPath));
    }
    
    @POST
    @Path("/reports")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response submitReport(ProfileReportDTO dto) {
        String reason = dto.getReason();
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
        report.setReason(reason);
        report.setStatus(ProfileReport.ReportStatus.valueOf(status.name()));
        report.setSubmittedByUserId(submittedByUserId);
        report.setReportedUserId(reportedUserId);
        report.setSubmissionDate(java.sql.Date.valueOf(LocalDate.now()));

        report = reportDAO.save(report);
        reportDAO.addReport(report, ctx.getRealPath(""));
  
        return Response.status(201).entity(report).build();
    }
}
