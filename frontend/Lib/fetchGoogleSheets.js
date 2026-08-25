export async function getGoogleSheetsData() {
  const SHEET_ID = "1QqQvPKH7G0hqqhd_0V6cP40Htl8qdFEZ6nHBVe_53_g"; // သင့် Sheet ID
  const SHEET_NAME = "Price_List"; // စျေးနှုန်းစာရင်းရှိသည့် Sheet နာမည်
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    // Google Sheets gviz response ကို JSON အဖြစ်ပြောင်းလဲခြင်း
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const rows = json.table.rows.map((row) => {
      return row.c.map((cell) => (cell ? cell.v : ""));
    });
    
    const headers = json.table.cols.map((col) => col.label);
    
    // Array of Objects ပုံစံပြောင်းခြင်း
    const formattedData = rows.map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header || `col_${index}`] = row[index];
      });
      return obj;
    });

    return formattedData;
  } catch (error) {
    console.error("Google Sheets fetching error:", error);
    return [];
  }
}