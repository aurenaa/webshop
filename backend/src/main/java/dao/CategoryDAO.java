package dao;

import java.io.*;
import java.util.*;

import beans.Category;

public class CategoryDAO {

    private HashMap<String, Category> categories = new HashMap<>();

    public CategoryDAO() {}

    public CategoryDAO(String contextPath) {
        loadCategories(contextPath);
    }

    public Collection<Category> findAll() {
        return categories.values();
    }

    public Category findCategory(String name) {
        return categories.get(name);
    }

    public boolean addCategory(Category category, String contextPath) {
        if (category == null || category.getName() == null || category.getName().isEmpty())
            return false;

        if (categories.containsKey(category.getName()))
            return false;

        categories.put(category.getName(), category);
        saveCategoryToFile(category, contextPath);
        return true;
    }

    private void loadCategories(String contextPath) {
        File file = new File(contextPath + "/categories.txt");
        if (!file.exists()) return;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty())
                    categories.put(line, new Category(line));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void saveCategoryToFile(Category category, String contextPath) {
        File file = new File(contextPath + "/categories.txt");
        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
            out.println(category.getName());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}