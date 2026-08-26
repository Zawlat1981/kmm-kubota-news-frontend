'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Company {
  [key: string]: any;
}

function parseCSV(csvText: string): Company[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map((h: string) => h.trim().replace(/^"|"$/g, ''));
  
  const result: Company[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentline = lines[i].split(',');
    const obj: Company = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
    }
    result.push(obj);
  }
  return result;
}

export default function CompaniesPage() {
  const [activeTab, setActiveTab] = useState('kubota');
  const [kubotaCompanies, setKubotaCompanies] = useState<Company[]>([]);
  const [otherCompanies, setOtherCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSheetData() {
      try {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCvsg3Aqd74s4VZKgZhU3Qv-2DQhi3vxmDKHciWcrcv7hz-m75W-t9ssZhB4y4MAGy5JzpMHSw/pub?gid=61187645&single=true&output=csv';
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        const data = parseCSV(csvText);

        const kubota = data.filter((item: Company) => 
          item.Brand?.toLowerCase().includes('kubota') || 
          item.Category?.toLowerCase().includes('kubota')
        );
        const others = data.filter((item: Company) => 
          !item.Brand?.toLowerCase().includes('kubota') && 
          !item.Category?.toLowerCase().includes('kubota')
        );

        setKubotaCompanies(kubota);
        setOtherCompanies(others);
      } catch (error) {
        console.error('Error fetching sheet:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSheetData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with Back to Home button */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">KMM Company & Dealer Directory</h1>
        <Link 
          href="/" 
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          ← Back to Home Portal
        </Link>
      </header>

      <div className="max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row gap-6 flex-1">
        
        {/* Side Menu */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border h-fit">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Directory Menu</h2>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('kubota')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'kubota' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔴 Kubota Companies ({kubotaCompanies.length})
            </button>
            <button
              onClick={() => setActiveTab('others')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === 'others' ? 'bg-blue-800 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔵 Other Brand Companies ({otherCompanies.length})
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-6 rounded-xl shadow-sm border">
          {activeTab === 'kubota' ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-red-600 border-b pb-3">Kubota Companies Directory</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kubotaCompanies.map((comp: Company, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-bold text-lg text-gray-800">{comp['Company Name'] || comp.Name}</h3>
                      <p className="text-sm text-gray-600 mt-1">📍 {comp.Address || comp.address}</p>
                      <p className="text-sm text-gray-600 mt-1">📞 {comp.Phone || comp.phone}</p>
                      {comp['Google Map'] && (
                        <a href={comp['Google Map']} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-medium hover:underline inline-block mt-2">
                          View on Google Map →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-3">Other Brand Companies Directory</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherCompanies.map((comp: Company, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-bold text-lg text-gray-800">{comp['Company Name'] || comp.Name}</h3>
                      <p className="text-sm text-gray-600 mt-1">📍 {comp.Address || comp.address}</p>
                      <p className="text-sm text-gray-600 mt-1">📞 {comp.Phone || comp.phone}</p>
                      {comp['Google Map'] && (
                        <a href={comp['Google Map']} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-medium hover:underline inline-block mt-2">
                          View on Google Map →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}