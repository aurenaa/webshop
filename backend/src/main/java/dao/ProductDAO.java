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

import beans.Product;
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
	            if (tokens.length < 8) {
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

	            if (id.isEmpty() || name.isEmpty() || price.isEmpty() || saleType.isEmpty())
	                continue;

	            Product.SaleType saleEnum = Product.SaleType.valueOf(saleType);
	            Date date = java.sql.Date.valueOf(datePosted);

	            products.put(id, new Product(id, name, description, category, Double.parseDouble(price), saleEnum, date, sellerId));
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

	            String line = String.format("%s;%s;%s;%s;%.2f;%s;%s;%s",
	                product.getId(),
	                product.getName(),
	                product.getDescription(),
	                product.getCategory(),
	                product.getPrice(), 
	                product.getSaleType(),
	                dateStr,
	                product.getSellerId()
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

	                    String newLine = String.format("%s;%s;%s;%s;%.2f;%s;%s;%s",
	                            updatedProduct.getId(),
	                            updatedProduct.getName(),
	                            updatedProduct.getDescription(),
	                            updatedProduct.getCategory(),
	                            updatedProduct.getPrice(),
	                            updatedProduct.getSaleType(),
	                            dateStr,
	                            updatedProduct.getSellerId()
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
}