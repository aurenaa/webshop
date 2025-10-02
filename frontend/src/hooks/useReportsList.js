import { useState, useEffect } from "react";
import axios from "axios";

export function useReportsList() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8080/WebShopAppREST/rest/report");
      setReports(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return reports;
}