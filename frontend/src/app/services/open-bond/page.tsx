import ServicePage from '@/components/ServicePage'
import { servicesData } from '@/data/servicesData'

export default function OpenBondPage() {
  return <ServicePage data={servicesData['open-bond']} />
}
