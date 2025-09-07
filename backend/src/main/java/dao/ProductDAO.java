package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
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
	
}