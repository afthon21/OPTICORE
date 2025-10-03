import ApiRequest from "../hooks/apiRequest";
import PackagesCard from "./services.component";
import { useEffect, useState } from "react";

export default function PackagesContainer() {
  const { makeRequest, error, loading } = ApiRequest(import.meta.env.VITE_API_BASE);
  const [packages, setPackages] = useState([]);

  console.log("=== PACKAGES CONTAINER RENDER ===");
  console.log("API Base URL:", import.meta.env.VITE_API_BASE);
  console.log("Current error:", error);
  console.log("Loading:", loading);

  const fetchPackages = async () => {
    try {
      console.log("=== FETCHING PACKAGES ===");
      console.log("Making request to /packages/all");
      const res = await makeRequest("/packages/all");
      console.log("Raw response:", res);
      console.log("Response type:", typeof res);
      console.log("Is array:", Array.isArray(res));
      console.log("Number of packages:", res ? res.length : 0);
      console.log("Hook error after request:", error);
      
      if (error) {
        console.error("API Error:", error);
        return;
      }
      
      if (res && res.length > 0) {
        console.log("First package:", res[0]);
      }
      
      setPackages(res || []);
      console.log("Packages state updated with:", res || []);
    } catch (err) {
      console.error("Exception in fetchPackages:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div>
      <PackagesCard packages={packages} />
    </div>
  );
}