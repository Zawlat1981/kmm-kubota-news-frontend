'use client';

import { useState, useEffect } from 'react';

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentline = lines[i].split(',');
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
    }
    result.push(obj);
  }
  return result;
}

export default function CompanyDirectoryPage() {
  const [kubotaCompanies, setKubotaCompanies] = useState([]);
  const [otherCompanies, setOtherCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kubota'); // Side Menu အတွက် state

  useEffect(() => {
    async function fetchSheetData() {
      try {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCvsg3Aqd74s4VZKgZhU3Qv-2DQhi3vxmDKHciWcrcv7hz-m75W-t9ssZhB4y4MAGy5JzpMHSw/pub?gid=61187645&single=true&output=csv';
        
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        
        const data = parseCSV(csvText);

        const kubota = data.filter(item => 
          item.Brand?.toLowerCase().includes('kubota') || 
          item.Category?.toLowerCase().includes('kubota')
        );
        const others = data.filter(item => 
          !item.Brand?.toLowerCase().includes('kubota') && 
          !item.Category?.toLowerCase().includes('kubota')
        );

        setKubotaCompanies(kubota);
        setOtherCompanies(others);
      } catch (error) {
        console.error('Error fetching Google Sheet:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSheetData();
  }, []);

  if (loading) return <div className="p-6 text-center text-lg">Loading directory data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      
      {/* Side Menu (Sidebar) */}
      <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-md border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Categories</h2>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('kubota')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'kubota'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔴 Kubota Company ({kubotaCompanies.length})
          </button>
          <button
            onClick={() => setActiveTab('others')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'others'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔵 Other Brand Company ({otherCompanies.length})
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Company & Dealer Directory</h1>

        {/* Kubota Section */}
        {activeTab === 'kubota' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-600 border-b-2 border-red-600 pb-2">
              Kubota Companies
            </h2>
            {kubotaCompanies.length === 0 ? (
              <p className="text-gray-500">No Kubota companies found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kubotaCompanies.map((comp, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-800">{comp['Company Name'] || comp.Name}</h3>
                    <p className="text-sm text-gray-500 mt-1">🏷️ Brand: <span className="font-semibold text-gray-700">{comp.Brand}</span></p>
                    <p className="text-gray-600 mt-2">📍 {comp.Address || comp.address}</p>
                    <p className="text-gray-600 mt-1">📞 {comp.Phone || comp.phone}</p>
                    {comp['Google Map'] && (
                      <a 
                        href={comp['Google Map']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm"
                      >
                        View on Google Map →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Other Brand Section */}
        {activeTab === 'others' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">
              Other Brand Companies
            </h2>
            {otherCompanies.length === 0 ? (
              <p className="text-gray-500">No other brand companies found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherCompanies.map((comp, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-800">{comp['Company Name'] || comp.Name}</h3>
                    <p className="text-sm text-gray-500 mt-1">🏷️ Brand: <span className="font-semibold text-gray-700">{comp.Brand}</span></p>
                    <p className="text-gray-600 mt-2">📍 {comp.Address || comp.address}</p>
                    <p className="text-gray-600 mt-1">📞 {comp.Phone || comp.phone}</p>
                    {comp['Google Map'] && (
                      <a 
                        href={comp['Google Map']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm"
                      >
                        View on Google Map →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}