package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.Date;
import java.util.StringTokenizer;

import beans.Product;

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
			String line, id = "", name = "", price = "", description = "", category = "", saleType = "", datePosted = "";
			StringTokenizer st;
			
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while (st.hasMoreTokens()) {
					id = st.nextToken().trim();
					name = st.nextToken().trim();
					description = st.nextToken().trim();
					category = st.nextToken().trim();
					price = st.nextToken().trim();
					saleType = st.nextToken().trim();
					datePosted = st.nextToken().trim();
				}
				
	            Product.SaleType saleEnum = Product.SaleType.valueOf(saleType);  
	            Date date = java.sql.Date.valueOf(datePosted);

	            products.put(id, new Product(id, name, description, category,
	                    Double.parseDouble(price), saleEnum, date));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
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

	            String line = String.format("%s;%s;%s;%s;%.2f;%s;%s",
	                product.getId(),
	                product.getName(),
	                product.getDescription(),
	                product.getCategory(),
	                product.getPrice(), 
	                product.getSaleType(),
	                dateStr
	            );

	            out.println(); 
	            out.println(line);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

}