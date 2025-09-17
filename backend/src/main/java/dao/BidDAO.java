package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import beans.Bid;

public class BidDAO {
	private Map<String, Bid> bids = new HashMap<>();
	
	public BidDAO() {
	
	}
	
	public BidDAO(String contextPath) {
		loadBids(contextPath);
	}
	
	public Bid findById(String id) {
		return bids.containsKey(id) ? bids.get(id) : null;
	}
	
	public Collection<Bid> findAll() {
		return bids.values();
	}
	
	private void loadBids(String contextPath) {
	    BufferedReader in = null;
	    try {
	        File file = new File(contextPath + "/bids.txt");
	        in = new BufferedReader(new FileReader(file));
	        String line;
	        
	        while ((line = in.readLine()) != null) {
	            line = line.trim();
	            if (line.equals("") || line.indexOf('#') == 0)
	                continue;

	            String[] tokens = line.split(";", -1);
	            
	            if (tokens.length < 4) {
	                System.err.println("Invalid line format: " + line);
	                continue;
	            }

	            String offer = tokens[0].trim();
	            String buyerId = tokens[1].trim();
	            
	            //bids.put(new Bid(Double.parseDouble(offer), buyerId));
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
	
	public void addBid(Bid bid, String contextPath) {
	    try {
	        File file = new File(contextPath + "/bids.txt");

	        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
	            out.println();
	            out.println(String.format("%s;%d;%s",
	            		bid.getOffer(),
	            		bid.getBuyerId()
	            ));
	        }
	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }
	}
	
	public Bid save(Bid bid) {
	    int maxId = -1;
	    for (String id : bids.keySet()) {
	        int idNum = Integer.parseInt(id);
	        if (idNum > maxId) maxId = idNum;
	    }
	    int newId = maxId + 1;
		return bid;
	}
	
}