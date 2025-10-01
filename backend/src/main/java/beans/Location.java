package beans;

public class Location {
	private String id;
    private double latitude;
    private double longitude;
    private String address;

    public Location() {}

    public Location(double latitude, double longitude, String address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    public String getId() {
        return id;
    }

    public void setLatitude(String id) {
        this.id = id;
    }
    
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return latitude + "," + longitude + "," + address;
    }

    public static Location fromString(String str) {
        if (str == null || str.isEmpty()) return null;
        String[] parts = str.split(",", 3);
        if (parts.length < 3) return null;
        double lat = Double.parseDouble(parts[0]);
        double lon = Double.parseDouble(parts[1]);
        String addr = parts[2];
        return new Location(lat, lon, addr);
    }
}
