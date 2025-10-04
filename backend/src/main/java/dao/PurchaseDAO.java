package dao;

import java.io.*;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.util.*;
import beans.Purchase;

public class PurchaseDAO {

    private HashMap<String, Purchase> purchases = new HashMap<>();

    public PurchaseDAO() {}

    public PurchaseDAO(String contextPath) {
        loadPurchases(contextPath);
    }

    public Collection<Purchase> findAll() {
        return purchases.values();
    }

    public Purchase findPurchase(String id) {
        return purchases.get(id);
    }
    
    public Purchase findPurchaseByProductId(String productId) {
        for (Purchase p : purchases.values()) {
            if (p.getProductId().trim().equals(productId.trim())) {
                return p;
            }
        }
        return null;
    }

    private void loadPurchases(String contextPath) {
        BufferedReader in = null;
        try {
            File file = new File(contextPath + "/purchases.txt");
            if (!file.exists()) return;

            in = new BufferedReader(new FileReader(file));
            String line;
            while ((line = in.readLine()) != null) {
                line = line.trim();
                if (line.equals("") || line.startsWith("#")) continue;

                String[] tokens = line.split(";");
                if (tokens.length < 4) continue;

                String id = tokens[0].trim();
                String productId = tokens[1].trim();
                String buyerId = tokens[2].trim();
                String rejectionReason = tokens.length > 3 ? tokens[3].trim() : "";
                String datePosted = tokens[4].trim();
                
	            LocalDate date = LocalDate.parse(datePosted);
                
                purchases.put(id, new Purchase(id, productId, buyerId, rejectionReason, date));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (in != null) try { in.close(); } catch (Exception e) {}
        }
    }

    public Purchase save(Purchase purchase, String contextPath) {
        int maxId = 0;
        for (String id : purchases.keySet()) {
            int idNum = Integer.parseInt(id);
            if (idNum > maxId) maxId = idNum;
        }
        int newId = maxId + 1;
        purchase.setId(String.valueOf(newId));
        purchases.put(purchase.getId(), purchase);

        addPurchaseToFile(purchase, contextPath);
        return purchase;
    }

    private void addPurchaseToFile(Purchase purchase, String contextPath) {
        try {
            File file = new File(contextPath + "/purchases.txt");
            try (FileWriter fw = new FileWriter(file, true);
                 PrintWriter out = new PrintWriter(fw)) {
            	
            	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            	String dateStr = purchase.getDate().format(formatter);
	            
	            String line = String.format("%s;%s;%s;%s;%s",
	                    purchase.getId(),
	                    purchase.getProductId(),
	                    purchase.getBuyerId(),
	                    purchase.getRejectionReason() != null ? purchase.getRejectionReason() : "",
	                    dateStr
	            );
                out.println(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void editPurchase(Purchase updated, String contextPath) {
        File file = new File(contextPath + "/purchases.txt");
        try {
            List<String> lines = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;

                    String[] parts = line.split(";");
                    if (parts[0].equals(updated.getId())) {
                    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    	String dateStr = updated.getDate().format(formatter);
                    	
                        String newLine = String.format("%s;%s;%s;%s",
                                updated.getId(),
                                updated.getProductId(),
                                updated.getBuyerId(),
                                updated.getRejectionReason() != null ? updated.getRejectionReason() : "",
                                dateStr
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

    public void deletePurchase(String id, String contextPath) {
        purchases.remove(id);

        File file = new File(contextPath + "/purchases.txt");
        try {
            List<String> lines = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;

                    String[] parts = line.split(";");
                    if (!parts[0].equals(id)) {
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