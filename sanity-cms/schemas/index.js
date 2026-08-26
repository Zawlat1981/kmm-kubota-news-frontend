// ရှိပြီးသား schema များကို တင်သွင်းခြင်း (ဥပမာ)
import { productMarketing } from './productMarketing'
import { products } from './products'
import { productSpec } from './productSpec'
import { newsPortal } from './newsPortal'
import { dealer } from './dealer'
import { manual } from './manual'
import { whoWeAre } from './whoWeAre'
import { company } from './company'

// ၁။ ဖန်တీలလိုက်တဲ့ companyType ကို import လုပ်ပါ
import companyType from './companyType'

export const schemaTypes = [
  productMarketing,
  products,
  productSpec,
  newsPortal,
  dealer,
  manual,
  whoWeAre,
  company,
  
  // ၂။ schemaTypes array ထဲသို့ ထည့်သွင်းပါ
  companyType,
]