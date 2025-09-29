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
import java.util.HashMap;
import java.util.List;
import java.util.Date;

import beans.Bid;
import beans.Product;
import beans.Product.Status;
import dto.ProductUpdateDTO;

public class ProductDAO {
	
	private HashMap<String, Product> products = new HashMap<String, Product>();
	
	public ProductDAO() {
		
	}
	
	public ProductDAO(String contextPath) {
		loadProducts(contextPath);
	}
	
	public Collection<Product> findAll() {
		return products.values();
	}
	
	public Product findProduct(String id) {
		return products.containsKey(id) ? products.get(id) : null;
	}
	
	private void loadProducts(String contextPath) {
	    BufferedReader in = null;
	    try {
	        File file = new File(contextPath + "/products.txt");
	        System.out.println(file.getCanonicalPath());
	        in = new BufferedReader(new FileReader(file));
	        String line;

	        while ((line = in.readLine()) != null) {
	            line = line.trim();
	            if (line.equals("") || line.startsWith("#"))
	                continue;

	            String[] tokens = line.split(";");
	            if (tokens.length < 9) {
	                System.out.println("Skipping: " + line);
	                continue;
	            }
	            
	            String id = tokens[0].trim();
	            String name = tokens[1].trim();
	            String description = tokens[2].trim();
	            String category = tokens[3].trim();
	            String price = tokens[4].trim();
	            String saleType = tokens[5].trim();
	            String datePosted = tokens[6].trim();
	            String sellerId = tokens[7].trim();
	            String status = tokens[8].trim();
	            
	            String buyerId = "";
	            if (tokens.length > 9) {
	                buyerId = tokens[9].trim();
	            }
	            
	            String rejectionReason = "";
	            if(tokens.length > 10)
	            {
	            	rejectionReason = tokens[10].trim();
	            }
	            
	            List<Bid> bids = new ArrayList<>();
	            if (tokens.length > 11 && !tokens[11].trim().isEmpty()) {
	                String bidsStr = tokens[11].trim();
	                String[] bidsArr = bidsStr.split("\\|");
	                for (String b : bidsArr) {
	                    String[] bidTokens = b.split(":");
	                    if (bidTokens.length == 2) {
	                        String bidbuyerId = bidTokens[0].trim();
	                        double offer = Double.parseDouble(bidTokens[1].trim());
	                        bids.add(new Bid(offer, bidbuyerId)); 
	                    }
	                }
	            }
                
	            if (id.isEmpty() || name.isEmpty() || price.isEmpty() || saleType.isEmpty())
	                continue;
	            
	            Product.SaleType saleEnum = Product.SaleType.valueOf(saleType);
	            Product.Status statusEnum = Product.Status.valueOf(status);
	            Date date = java.sql.Date.valueOf(datePosted);

	            products.put(id, new Product(id, name, description, category, Double.parseDouble(price), saleEnum, date, sellerId, statusEnum, buyerId, rejectionReason, bids));
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (Exception e) { }
	        }
	    }
	}
	
	public Product save(Product product) {
	    int maxId = -1;
	    for (String id : products.keySet()) {
	        int idNum = Integer.parseInt(id);
	        if (idNum > maxId) maxId = idNum;
	    }
	    int newId = maxId + 1;
	    product.setId(String.valueOf(newId));
	    
	    product.setDatePosted(java.sql.Date.valueOf(LocalDate.now()));
	    
	    products.put(product.getId(), product);
	    return product;
	}

	public void addProduct(Product product, String contextPath) {
	    try {
	        File file = new File(contextPath + "/products.txt");
	        
	        try (FileWriter fw = new FileWriter(file, true);
	             PrintWriter out = new PrintWriter(fw)) {
	            
	            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	            String dateStr = sdf.format(product.getDatePosted());
	            if (product.getStatus() == null) product.setStatus(Product.Status.AVAILABLE);
	            if (product.getBids() == null) product.setBids(new ArrayList<>());
	            
	            String bidsStr = "";
	            if (!product.getBids().isEmpty()) {
	                List<String> bidTokens = new ArrayList<>();
	                for (Bid b : product.getBids()) {
	                    bidTokens.add(b.getBuyerId() + ":" + b.getOffer());
	                }
	                bidsStr = String.join("|", bidTokens);
	            }
	            
	            String line = String.format("%s;%s;%s;%s;%.2f;%s;%s;%s;%s;%s;%s;",
	                product.getId(),
	                product.getName(),
	                product.getDescription(),
	                product.getCategory(),
	                product.getPrice(), 
	                product.getSaleType(),
	                dateStr,
	                product.getSellerId(),
	                product.getStatus(),
	                product.getBuyerId() != null ? product.getBuyerId() : "",
	                product.getRejectionReason() != null ? product.getRejectionReason() : "",
	                bidsStr
	            );

	            out.println(); 
	            out.println(line);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	public void deleteFileProduct(String productId, String contextPath) {
	    File file = new File(contextPath + "/products.txt");

	    try {
	        List<String> lines = new ArrayList<>();

	        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            String line;
	            while ((line = reader.readLine()) != null) {
	                if (line.trim().isEmpty()) continue;

	                String[] parts = line.split(";");
	                if (!parts[0].equals(productId)) {
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
	
	public Product deleteProduct(String id, String contextPath)
	{
		Product removed = products.remove(id);
		if (removed != null) {
	        deleteFileProduct(id, contextPath);
	    }
	    return removed;
	}
	
	public void statusSold(String id, String contextPath) {
	    Product product = findProduct(id);
	    if (product != null) {
	        product.setStatus(Status.SOLD);
	        editFileProduct(product, contextPath);
	    }
	}
	
	public void editFileProduct(Product updatedProduct, String contextPath) {
	    File file = new File(contextPath + "/products.txt");

	    try {
	        List<String> lines = new ArrayList<>();

	        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	            String line;
	            while ((line = reader.readLine()) != null) {
	                if (line.trim().isEmpty()) continue;

	                String[] parts = line.split(";");
	                if (parts[0].equals(updatedProduct.getId())) {
	                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	                    String dateStr = sdf.format(updatedProduct.getDatePosted());
	                    
	                    String bidsStr = "";
	                    if (updatedProduct.getBids() != null && !updatedProduct.getBids().isEmpty()) {
	                        List<String> bidTokens = new ArrayList<>();
	                        for (Bid b : updatedProduct.getBids()) {
	                            bidTokens.add(b.getBuyerId() + ":" + b.getOffer());
	                        }
	                        bidsStr = String.join("|", bidTokens);
	                    }
	                    
	                    String newLine = String.format("%s;%s;%s;%s;%.2f;%s;%s;%s;%s;%s;%s;%s",
	                            updatedProduct.getId(),
	                            updatedProduct.getName(),
	                            updatedProduct.getDescription(),
	                            updatedProduct.getCategory(),
	                            updatedProduct.getPrice(),
	                            updatedProduct.getSaleType(),
	                            dateStr,
	                            updatedProduct.getSellerId(),
	                            updatedProduct.getStatus(),
	                            updatedProduct.getBuyerId() != null ? updatedProduct.getBuyerId() : "",
	                            updatedProduct.getRejectionReason() != null ? updatedProduct.getRejectionReason() : "",
	                            bidsStr
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
	
	public void addBid(String productId, Bid bid, String contextPath) {
	    Product p = products.get(productId);
	    if (p != null) {
	        if (p.getBids() == null) {
	            p.setBids(new ArrayList<>());
	        }
	        p.getBids().add(bid);
	        editFileProduct(p, contextPath);
	    }
	}
	
	public Product updateProducts(String id, Product product, String contextPath) {
		Product p = products.containsKey(id) ? products.get(id) : null;
		if (p == null) {
			return null;
		} else {
			p.setId(id);
			p.setName(product.getName());
	        p.setDescription(product.getDescription());
	        p.setCategory(product.getCategory());
	        p.setPrice(product.getPrice());
	        p.setSaleType(product.getSaleType());
	        p.setDatePosted(product.getDatePosted());
			
			editFileProduct(p, contextPath);
		}
		
		return p;
	}

	public Product updateProduct(String id, ProductUpdateDTO updated, String contextPath)
	{
		Product p = products.containsKey(id) ? products.get(id) : null;
		
		if(updated.getName() != null)
		{
			p.setName(updated.getName());
		}
		if(updated.getDescription() != null)
		{
			p.setDescription(updated.getDescription());
		}
		if(updated.getCategory() != null)
		{
			p.setCategory(updated.getCategory());
		}
		if(updated.getPrice() != null)
		{
			p.setPrice(updated.getPrice());
		}
		if(updated.getSaleType() != null)
		{
			p.setSaleType(updated.getSaleType());
		}
		
		editFileProduct(p, contextPath);
		
		return p;
	}
	
	public void updateStatus(String id, Status newStatus, String contextPath, String buyerId)
	{
		Product p = products.get(id);
		p.setBuyerId(buyerId);
		p.setStatus(newStatus);
		editFileProduct(p, contextPath);
	}
}