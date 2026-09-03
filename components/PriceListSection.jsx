"use client";
import { useEffect, useState } from "react";
import { getGoogleSheetsData } from "@/lib/fetchGoogleSheets";

export default function PriceListSection() {
  const [priceData, setPriceData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const data = await getGoogleSheetsData();
      setPriceData(data);
    }
    fetchData();
  }, []);

  const brands = ["All", ...new Set(priceData.map((item) => item.Brand).filter(Boolean))];

  const filteredPrices = selectedBrand === "All"
    ? priceData
    : priceData.filter((item) => item.Brand === selectedBrand);

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-3 text-orange-600">Search All Brand Machinery Prices</h2>
      
      <div className="flex gap-4 mb-4">
        <select 
          className="border p-2 rounded-md bg-white w-full md:w-1/3"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand === "All" ? "All Brand Agricultural Machine" : brand}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPrices.map((item, idx) => (
          <div key={idx} className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col justify-between">
            <div>
              {/* Google Sheet ထဲက ပုံလင့်ခ်ကို ယူ၍ ပြသရန် (Sheet ထဲက Column နာမည် Image ဖြစ်သည်ဟု ယူဆပါသည်) */}
              {item.Image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={item.Image} 
                  alt={item.Model || item.Name} 
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              
              <h3 className="font-bold text-lg text-gray-800">{item.Model || item.Name || "စက်ပစ္စည်း"}</h3>
              <p className="text-sm text-gray-600">Brand: {item.Brand}</p>
            </div>
            
            <p className="text-green-600 font-semibold mt-4">Price: {item.Price} MMK</p>
          </div>
        ))}
      </div>
    </div>
  );
}