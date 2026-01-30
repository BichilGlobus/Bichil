import ProductPage from '@/components/ProductPage'
import { productsData } from '@/data/productsData'

export default function CarPurchasePage() {
  return <ProductPage data={productsData['car-purchase']} />
}
