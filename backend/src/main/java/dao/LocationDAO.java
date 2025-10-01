package dao;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import beans.Location;

public class LocationDAO {
    private HashMap<String, Location> locations = new HashMap<>();

    public Location findLocation(String id) {
        return locations.get(id);
    }

    public Location save(Location loc, String contextPath) {
        int maxId = locations.keySet().stream().mapToInt(k -> Integer.parseInt(k.replace("loc_", ""))).max().orElse(0);
        String newId = "loc_" + (maxId + 1);
        locations.put(newId, loc);
        addLocationToFile(newId, loc, contextPath);
        return loc;
    }

    private void addLocationToFile(String id, Location loc, String contextPath) {
        try (PrintWriter out = new PrintWriter(new FileWriter(contextPath + "/locations.txt", true))) {
            out.println(id + ";" + loc.getLatitude() + ";" + loc.getLongitude() + ";" + loc.getAddress());
        } catch (IOException e) { e.printStackTrace(); }
    }

    public void loadLocations(String contextPath) {
        try (BufferedReader in = new BufferedReader(new FileReader(contextPath + "/locations.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] parts = line.split(";", 4);
                String id = parts[0];
                double lat = Double.parseDouble(parts[1]);
                double lon = Double.parseDouble(parts[2]);
                String addr = parts[3];
                locations.put(id, new Location(lat, lon, addr));
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
}
