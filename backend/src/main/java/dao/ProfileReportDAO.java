package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import beans.ProfileReport;
import beans.ProfileReport.ReportStatus;
import beans.User;
import dto.ProfileReportDTO;

public class ProfileReportDAO {
	private Map<String, ProfileReport> reports = new HashMap<>();
	
	public ProfileReportDAO() {
	
	}
	
	public ProfileReportDAO(String contextPath) {
		loadReports(contextPath);
	}
	
	public ProfileReport findById(String id) {
		return reports.containsKey(id) ? reports.get(id) : null;
	}
	
	public Collection<ProfileReport> findAll() {
		return reports.values();
	}
	
	private void loadReports(String contextPath) {
	    BufferedReader in = null;
	    try {
	        File file = new File(contextPath + "/reports.txt");
	        if (!file.exists()) {
	            System.out.println("Reports file does not exist, will be created on first report");
	            return;
	        }
	        
	        in = new BufferedReader(new FileReader(file));
	        String line;
	        
	        while ((line = in.readLine()) != null) {
	            line = line.trim();
	            if (line.equals("") || line.indexOf('#') == 0)
	                continue;

	            String[] tokens = line.split(";", -1);
	            
	            if (tokens.length < 7) {
	                System.err.println("Invalid line format: " + line);
	                continue;
	            }

	            String id = tokens[0].trim();
	            String reason = tokens[1].trim();
	            String submittedByUserId = tokens[2].trim();
	            String reportedUserId = tokens[3].trim();
	            String status = tokens[4].trim();
	            String submissionDate = tokens[5].trim();
	            String rejectionReason = tokens[6].trim();
	            
	            System.out.println("Loading report: id=" + id + ", reason=" + reason + 
	                    ", submittedBy=" + submittedByUserId + ", reportedUser=" + reportedUserId +
	                    ", status=" + status + ", date=" + submissionDate);
	                
	                try {
	                    Date date = java.sql.Date.valueOf(submissionDate);
	                    ProfileReport.ReportStatus statusEnum = ProfileReport.ReportStatus.valueOf(status);
	                    reports.put(id, new ProfileReport(id, reason, submittedByUserId, reportedUserId, statusEnum, date, rejectionReason));
	                } catch (IllegalArgumentException e) {
	                    System.err.println("Error parsing report line: " + line);
	                    e.printStackTrace();
	                }
	            }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (Exception e) {
	            }
	        }
	    }
	}
	
	public void addReport(ProfileReport report, String contextPath) {
	    try {
	        File file = new File(contextPath + "/reports.txt");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	        String dateStr = sdf.format(report.getSubmissionDate());
	        
	        boolean fileExists = file.exists() && file.length() > 0;
	        
	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	            if (fileExists) {
	                out.println();
	            }
	            
	            out.println(String.format("%s;%s;%s;%s;%s;%s;%s",
	                    report.getId(),
	                    report.getReportReason(),
	                    report.getSubmittedByUserId(),    
	                    report.getReportedUserId(),        
	                    report.getStatus(),               
	                    dateStr,                         
	                    report.getRejectionReason() == null ? "" : report.getRejectionReason()
	                ));
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }
	}
	
	public ProfileReport save(ProfileReport report) {
	    int newId;
	    if (reports.isEmpty()) {
	        newId = 1;
	    } else {
	        int maxId = reports.keySet().stream()
	                .mapToInt(Integer::parseInt)
	                .max()
	                .getAsInt();
	        newId = maxId + 1;
	    }
	    report.setId(String.valueOf(newId));
	    report.setSubmissionDate(java.sql.Date.valueOf(LocalDate.now()));
	    reports.put(report.getId(), report);
	    return report;
	}
	
	public ProfileReport rejectReport(String id, ProfileReportDTO updated, String contextPath) {
		ProfileReport r = findById(id);
		r.setRejectionReason(updated.getRejectionReason());
		r.setStatus(ReportStatus.REJECTED);
		editReport(r, contextPath);
		return r;
	}
	
	public ProfileReport acceptReport(String reportId, ProfileReportDTO updated, String contextPath, UserDAO userDAO) {
	    ProfileReport r = findById(reportId);
	    if (r == null) return null;

	    r.setStatus(ProfileReport.ReportStatus.ACCEPTED);

	    User reportedUser = userDAO.findById(r.getReportedUserId());
	    if (reportedUser != null) {
	        reportedUser.setBlocked(true); 
	        userDAO.editFileUser(reportedUser, contextPath); 
	    }

	    editReport(r, contextPath);
	    return r;
	}
	
	public boolean blockAccount(String userId, String contextPath, UserDAO userDAO) {
	    User u = userDAO.findById(userId);
	    if (u != null) {
	        u.setBlocked(true); 
	        userDAO.editFileUser(u, contextPath); 
	        return true;
	    }
	    return false;
	}
	
	public boolean unblockAccount(String userId, String contextPath, UserDAO userDAO) {
	    User u = userDAO.findById(userId);
	    if (u != null) {
	        u.setBlocked(false); 
	        userDAO.editFileUser(u, contextPath); 
	        return true;
	    }
	    return false;
	}
	
	public void editReport(ProfileReport updated, String contextPath) {
	    File file = new File(contextPath + "/reports.txt");
	    try {
	        List<String> lines = new ArrayList<>();
	        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            String line;
	            while ((line = reader.readLine()) != null) {
	                if (line.trim().isEmpty()) continue;

	                String[] parts = line.split(";");
	                if (parts[0].equals(updated.getId())) {
	                    String newLine = String.format("%s;%s;%s;%s;%s;%s;%s",
	                            updated.getId(),
	                            updated.getReportReason(),
	                            updated.getSubmittedByUserId(),
	                            updated.getReportedUserId(),
	                            updated.getStatus(),
	                            sdf.format(updated.getSubmissionDate()),
	                            updated.getRejectionReason()
	                    );
	                    lines.add(newLine);
	                } else {
	                    lines.add(line);
	                }
	            }
	        }

	        try (PrintWriter writer = new PrintWriter(new FileWriter(file, false))) {
	            for (String l : lines) {
	                writer.println(l);
	            }
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
}