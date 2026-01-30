import ProductPage from '@/components/ProductPage'
import { productsData } from '@/data/productsData'

export default function BusinessLoanPage() {
  return <ProductPage data={productsData.business} />
}
