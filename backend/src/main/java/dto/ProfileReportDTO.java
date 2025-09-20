package dto;

import java.util.Date;

public class ProfileReportDTO  {
	private String id;
    private String reason;
    private Date submissionDate;
    private String submittedByUserId;
    private String reportedUserId;
    private ReportStatus status;
    
    public enum ReportStatus { SUBMITTED, REJECTED, ACCEPTED }    
    public ProfileReportDTO() {}

    public ProfileReportDTO(String id, String reason, String submittedByUserId, String reportedUserId, ReportStatus status, Date submissionDate) {
        this.id = id;
        this.reason = reason;
        this.submissionDate = submissionDate;
        this.submittedByUserId = submittedByUserId;
        this.reportedUserId = reportedUserId;
        this.status = status;
    }

    public String getId() { 
    	return id; 
    }
    public void setId(String id) { 
    	this.id = id; 
    }

    public String getReason() { 
    	return reason; 
    }
    public void setReason(String reason) { 
    	this.reason = reason; 
    }

    public Date getSubmissionDate() { 
    	return submissionDate; 
    }
    public void setSubmissionDate(Date submissionDate) { 
    	this.submissionDate = submissionDate;
    }

    public String getSubmittedByUserId() {
    	return submittedByUserId; 
    }
    public void setSubmittedByUserId(String submittedByUserId) { 
    	this.submittedByUserId = submittedByUserId;
    }

    public String getReportedUserId() { 
    	return reportedUserId; 
    }
    public void setReportedUserId(String reportedUserId) {
    	this.reportedUserId = reportedUserId;
    }

    public ReportStatus getStatus() { 
    	return status; 
    }
    public void setStatus(ReportStatus status) { 
    	this.status = status; 
    }
}