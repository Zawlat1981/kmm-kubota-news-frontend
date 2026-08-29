import urllib.parse
import pandas as pd
from django.shortcuts import render
from django.core.paginator import Paginator

SHEET_ID = "1QqQvPKH7G0hqqhd_0V6cP40Htl8qdFEZ6nHBVe_53_g"
ALL_BRANDS = [
    "Kubota", "Yanmar", "Win-Shwe-Wah(2nd)", "John-Deere",
    "New-Holland", "YTO", "Mahindra", "Sonalika", "Yamabisi", "DongFeng"
]

def dashboard_view(request):
    search_query = request.GET.get('q', '').strip().lower()
    selected_brand = request.GET.get('brand', '').strip()
    selected_category = request.GET.get('category', '').strip()
    selected_date = request.GET.get('date', '').strip()

    is_brand_view = selected_brand in ALL_BRANDS
    tab_name = selected_brand if is_brand_view else "Competitor News Updates"

    encoded_tab = urllib.parse.quote(tab_name)
    base_url = (
        f"https://docs.google.com/spreadsheets/d/{SHEET_ID}"
        f"/gviz/tq?tqx=out:csv&sheet={encoded_tab}"
    )

    items_list = []
    all_categories = [] 

    try:
        df = pd.read_csv(base_url).fillna("")
        # Column နာမည်များကို စာလုံးအသေးနှင့် ဘေးက space များကို ဖြတ်ထုတ်ခြင်း
        df.columns = [str(col).strip().lower() for col in df.columns]

        # Category Dropdown အတွက် ရယူခြင်း
        if not is_brand_view and 'category' in df.columns:
            cats = df['category'].astype(str).str.strip()
            all_categories = sorted([c for c in cats.unique() if c])

            if selected_category:
                df = df[df['category'].astype(str).str.strip().str.lower() == selected_category.lower()]

        # Date ဖြင့် စစ်ထုတ်ခြင်း
        if selected_date and 'date' in df.columns:
            df = df[df['date'].astype(str).str.contains(selected_date, na=False)]

        # Search query ဖြင့် စစ်ထုတ်ခြင်း
        if search_query:
            mask = False
            for col in df.columns:
                mask = mask | df[col].astype(str).str.lower().str.contains(search_query, na=False)
            df = df[mask]

        # နောက်ဆုံးသတင်းကို ရှေ့ဆုံးမှပြရန် အပေါ်အောက်လှန်ခြင်း (Reverse)
        if not df.empty:
            df = df.iloc[::-1].reset_index(drop=True)

        items_list = df.to_dict(orient="records")

    except Exception as e:
        items_list = []

    paginator = Paginator(items_list, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        "news_list": page_obj,             
        "page_obj": page_obj,              
        "all_brands": ALL_BRANDS,        
        "selected_brand": selected_brand,  
        "search_query": search_query,
        "is_brand_view": is_brand_view,
        "all_categories": all_categories,      
        "selected_category": selected_category,
        "selected_date": selected_date,       
    }
    return render(request, "portal/dashboard.html", context)


def news_detail_view(request, index):
    selected_brand = request.GET.get('brand', '').strip()
    is_brand_view = selected_brand in ALL_BRANDS
    tab_name = selected_brand if is_brand_view else "Competitor News Updates"

    encoded_tab = urllib.parse.quote(tab_name)
    base_url = (
        f"https://docs.google.com/spreadsheets/d/{SHEET_ID}"
        f"/gviz/tq?tqx=out:csv&sheet={encoded_tab}"
    )

    item = None
    try:
        df = pd.read_csv(base_url).fillna("")
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        # အရေးကြီးသည် - Dashboard ကဲ့သို့ပင် အပေါ်အောက် အစဉ်ကို အတိအကျ တူညီစေရန် ပြောင်းခြင်း
        if not df.empty:
            df = df.iloc[::-1].reset_index(drop=True)

        items_list = df.to_dict(orient="records")
        
        if 0 <= index < len(items_list):
            raw_item = items_list[index]
            
            # ဒေတာများကို တိကျသေသပ်စွာ ယူဆောင်ရန်
            item = {
                'date': str(raw_item.get('date', '')).strip(),
                'company': str(raw_item.get('company', '')).strip(),
                'content_th': str(raw_item.get('content_th', '')).strip(),
                'promo': str(raw_item.get('promo', '')).strip(),
                'facebook': str(raw_item.get('facebook', '')).strip(),
                'tiktok': str(raw_item.get('tiktok', '')).strip(),
                'telegram': str(raw_item.get('telegram', '')).strip(),
                'image_url': str(raw_item.get('image_url', '')).strip(),
                'category': str(raw_item.get('category', '')).strip(),
            }

    except Exception as e:
        item = None

    context = {
        "item": item,
    }
    return render(request, "portal/news_detail.html", context)