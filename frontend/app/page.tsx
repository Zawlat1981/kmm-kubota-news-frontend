'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NewsContainer from '@/components/NewsContainer';

// Google Sheet CSV parse လုပ်ရန် helper function
function parseCSV(csvText: string) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentline = lines[i].split(',');
    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
    }
    result.push(obj);
  }
  return result;
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('news'); // 'news', 'kubota', 'others'
  const [newsList, setNewsList] = useState([]);
  const [kubotaCompanies, setKubotaCompanies] = useState([]);
  const [otherCompanies, setOtherCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sanity News နဲ့ Google Sheet Data တွေကို တစ်ပြိုင်တည်း ဆွဲထုတ်ရန်
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Google Sheet Data ဆွဲထုတ်ခြင်း
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCvsg3Aqd74s4VZKgZhU3Qv-2DQhi3vxmDKHciWcrcv7hz-m75W-t9ssZhB4y4MAGy5JzpMHSw/pub?gid=61187645&single=true&output=csv';
        const sheetRes = await fetch(csvUrl);
        const csvText = await sheetRes.text();
        const sheetData = parseCSV(csvText);

        const kubota = sheetData.filter((item: any) => 
          item.Brand?.toLowerCase().includes('kubota') || 
          item.Category?.toLowerCase().includes('kubota')
        );
        const others = sheetData.filter((item: any) => 
          !item.Brand?.toLowerCase().includes('kubota') && 
          !item.Category?.toLowerCase().includes('kubota')
        );

        setKubotaCompanies(kubota as any);
        setOtherCompanies(others as any);

        // 2. Sanity News များကို API ကနေ ဆွဲထုတ်ခြင်း (သို့မဟုတ် Mock Data ထည့်ရန်)
        // ဒီနေရာမှာ သင့်ရဲ့ API endpoint သို့မဟုတ် Sanity client ကို သုံးနိုင်ပါတယ်
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* --- Header with Animated Logo --- */}
      <Header />

      {/* --- Main Container with Side Menu --- */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* ဘယ်ဘက်ခြမ်း Side Menu */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border h-fit">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu Navigation</h2>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveMenu('news')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeMenu === 'news' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📰 News Portal
            </button>
            <button
              onClick={() => setActiveMenu('kubota')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeMenu === 'kubota' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔴 Kubota Companies ({kubotaCompanies.length})
            </button>
            <button
              onClick={() => setActiveMenu('others')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeMenu === 'others' ? 'bg-blue-800 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔵 Other Brand Companies ({otherCompanies.length})
            </button>
          </nav>
        </aside>

        {/* ညာဘက်ခြမ်း Content Area */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border">
          
          {/* ၁။ News Portal Tab */}
          {activeMenu === 'news' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-600 pb-2 text-gray-800">
                KMM Kubota News Portal
              </h2>
              {/* သတင်းများပြသသည့် Component */}
              <NewsContainer newsList={newsList} />
            </div>
          )}

          {/* ၂။ Kubota Companies Tab */}
          {activeMenu === 'kubota' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-red-600 border-b pb-3">Kubota Companies Directory</h2>
              {loading ? (
                <p className="text-gray-500">Loading companies...</p>
              ) : kubotaCompanies.length === 0 ? (
                <p className="text-gray-500">No Kubota companies found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kubotaCompanies.map((comp: any, idx: number) => (
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

          {/* ၃. Other Brands Tab */}
          {activeMenu === 'others' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-3">Other Brand Companies Directory</h2>
              {loading ? (
                <p className="text-gray-500">Loading companies...</p>
              ) : otherCompanies.length === 0 ? (
                <p className="text-gray-500">No other brand companies found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherCompanies.map((comp: any, idx: number) => (
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

        </div>
      </div>
    </main>
  );
} 