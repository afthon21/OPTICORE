import ApiRequest from "../hooks/apiRequest";
import PackagesCard from "./services.component";
import { useEffect, useState } from "react";

export default function PackagesContainer() {
  const { makeRequest, error, loading } = ApiRequest(import.meta.env.VITE_API_BASE);
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    try {
      const res = await makeRequest("/packages/all");
      
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
      <PackagesCard packages={packages} setPackages={setPackages} />
    </div>
  );
}