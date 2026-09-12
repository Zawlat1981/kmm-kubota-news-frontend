import { localeString } from './locale'
import { productMarketing } from './productMarketing'
import products from './products'
import { productSpec, productSeries } from './productSpec'
import newsPortal from './newsPortal' // ဒီနေရာမှာ ကွင်း `{}` မပါဘဲ ရေးပါ
import priceList from './priceList.js' // ဒီနေရာမှာလည်း ကွင်း `{}` မပါဘဲ ရေးပါ (newsPortal အတိုင်းပါပဲ)
import { dealer, kubotaStaff } from './dealer'
import { manual } from './manual'
import { manualCategory } from './manualCategory'
import whoWeAre from './whoWeAre'
import { company } from './company'
import companyType from './companyType'

export const schemaTypes = [
  localeString,
  productMarketing,
  products,
  productSpec,
  productSeries,
  newsPortal,
  priceList,
  dealer,
  kubotaStaff,
  manual,
  manualCategory,
  whoWeAre,
  company,
  companyType,
]