package beans;

import java.util.Date;

public class ProfileReport {
    private String id;
    private String reportReason;
    private Date submissionDate;
    private String submittedByUserId;
    private String reportedUserId;
    private ReportStatus status;
    private String rejectionReason;
    
    public enum ReportStatus { SUBMITTED, REJECTED, ACCEPTED }    
    public ProfileReport() {}

    public ProfileReport(String id, String reportReason, String submittedByUserId, String reportedUserId, ReportStatus status, Date submissionDate, String rejectionReason) {
        this.id = id;
        this.reportReason = reportReason;
        this.submissionDate = submissionDate;
        this.submittedByUserId = submittedByUserId;
        this.reportedUserId = reportedUserId;
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public String getId() { 
    	return id; 
    }
    
    public void setId(String id) { 
    	this.id = id; 
    }

    public String getReportReason() { 
    	return reportReason; 
    }
    
    public void setReportReason(String reportReason) { 
    	this.reportReason = reportReason; 
    }
    
    public String getRejectionReason() { 
    	return rejectionReason; 
    }
    
    public void setRejectionReason(String rejectionReason) { 
    	this.rejectionReason = rejectionReason; 
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