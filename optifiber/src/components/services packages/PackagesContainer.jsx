import ApiRequest from "../hooks/apiRequest";
import PackagesCard from "./services.component";
import Card from "./Create.card";
import { useEffect, useState } from "react";

export default function PackagesContainer() {
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    try {
      const res = await makeRequest("/services/all");
      setPackages(res || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePackageCreated = () => {
    fetchPackages();
  };

  return (
    <div>
      <Card onPackageCreated={handlePackageCreated} />
      <PackagesCard packages={packages} />
    </div>
  );
}