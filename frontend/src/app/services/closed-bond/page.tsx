import ServicePage from '@/components/ServicePage'
import { servicesData } from '@/data/servicesData'

export default function ClosedBondPage() {
  return <ServicePage data={servicesData['closed-bond']} />
}
