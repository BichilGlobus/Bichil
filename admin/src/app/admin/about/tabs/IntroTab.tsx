'use client'
import { useEffect, useRef, useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import Modal from '@/components/Modal'
import clsx from 'clsx'

interface TabContent {
  title_mn: string
  title_en: string
  content_mn: string
  content_en: string
  image_url?: string
  image_height?: string
  // Origin Story
  origin_title_mn: string
  origin_title_en: string
  origin_p1_mn: string
  origin_p1_en: string
  origin_p2_mn: string
  origin_p2_en: string
  origin_p3_mn: string
  origin_p3_en: string
  // What We Do
  whatWeDo_title_mn: string
  whatWeDo_title_en: string
  whatWeDo_content_mn: string
  whatWeDo_content_en: string
  // SME Section
  sme_title_mn: string
  sme_title_en: string
  sme_p1_mn: string
  sme_p1_en: string
  sme_p2_mn: string
  sme_p2_en: string
  // Citizen Section
  citizen_title_mn: string
  citizen_title_en: string
  citizen_p1_mn: string
  citizen_p1_en: string
  citizen_p2_mn: string
  citizen_p2_en: string
  // Font Styling - 12 хэсэг тус бүрийнх
  // Origin Story (4 хэсэг)
  origin_title_color: string
  origin_title_size: number
  origin_title_weight: string
  origin_title_family: string
  origin_p1_color: string
  origin_p1_size: number
  origin_p1_weight: string
  origin_p1_family: string
  origin_p2_color: string
  origin_p2_size: number
  origin_p2_weight: string
  origin_p2_family: string
  origin_p3_color: string
  origin_p3_size: number
  origin_p3_weight: string
  origin_p3_family: string
  // What We Do (2 хэсэг)
  whatWeDo_title_color: string
  whatWeDo_title_size: number
  whatWeDo_title_weight: string
  whatWeDo_title_family: string
  whatWeDo_content_color: string
  whatWeDo_content_size: number
  whatWeDo_content_weight: string
  whatWeDo_content_family: string
  // SME (3 хэсэг)
  sme_title_color: string
  sme_title_size: number
  sme_title_weight: string
  sme_title_family: string
  sme_p1_color: string
  sme_p1_size: number
  sme_p1_weight: string
  sme_p1_family: string
  sme_p2_color: string
  sme_p2_size: number
  sme_p2_weight: string
  sme_p2_family: string
  // Citizen (3 хэсэг)
  citizen_title_color: string
  citizen_title_size: number
  citizen_title_weight: string
  citizen_title_family: string
  citizen_p1_color: string
  citizen_p1_size: number
  citizen_p1_weight: string
  citizen_p1_family: string
  citizen_p2_color: string
  citizen_p2_size: number
  citizen_p2_weight: string
  citizen_p2_family: string
  // Visibility toggles for 12 sections
  origin_title_visible: boolean
  origin_p1_visible: boolean
  origin_p2_visible: boolean
  origin_p3_visible: boolean
  whatWeDo_title_visible: boolean
  whatWeDo_content_visible: boolean
  sme_title_visible: boolean
  sme_p1_visible: boolean
  sme_p2_visible: boolean
  citizen_title_visible: boolean
  citizen_p1_visible: boolean
  citizen_p2_visible: boolean
  // Timeline Events
  timeline_events: Array<{
    year: string
    title_mn: string
    title_en: string
    short_mn: string
    short_en: string
    desc_mn: string
    desc_en: string
    year_color: string
    title_color: string
    short_color: string
    desc_color: string
    visible: boolean
  }>
}

interface IntroTabProps {
  onSave: (data: TabContent) => void
  loading?: boolean
}

// Reusable IntersectionObserver hook for animations
function useInViewAnimation() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold: 0.35,
        rootMargin: '0px 0px -80px 0px',
      }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

const historyEvents = [
  { 
    year: '2008', 
    title_mn: 'АВТОМАШИН БАРЬЦААТ ЗЭЭЛ',
    title_en: 'CAR COLLATERAL LOAN',
    short_mn: 'Монголд анх удаа банкны шалгуурт тэнцэхгүй иргэдэд зориулсан шийдэл болох автомашин барьцаалсан зээлийн үйлчилгээг нэвтрүүлсэн.',
    short_en: 'Introduced car collateral loan service for citizens who do not meet bank criteria.',
    desc_mn: 'Энэхүү барьцаагүй зээлийн үйлчилгээг 2008 оны 8-р сарын 8-ны өдрөөс анх олгож эхэлсэн бөгөөд 2009 онд уг зээлийн үйлчилгээ маань хүчин төгөлдөр болж, харилцагчдадаа зээлийн үйлчилгээ олгож эхэлсэн. Анх автомашин барьцаалан банкны шалгуурт тэнцэхгүй байгаа иргэдийн нийгмийн чиг хандлагыг өөрчлөхөд хувь нэмэр оруулах үүднээс "Автомашин барьцаагүй зээл"-ийг нэвтрүүлэн хэрэглэгчдээ татаж эхэлсэн.',
    desc_en: 'Started offering this loan service on August 8, 2008, and in 2009 the service became effective, providing loan services to customers.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2009', 
    title_mn: 'АВТОМАШИН УНАХ НӨХЦӨЛТ ЗЭЭЛ',
    title_en: 'CAR DRIVING CONDITION LOAN',
    short_mn: 'Автомашиныг барьцаалахдаа унах нөхцөлтэй зээлийг санал болгосон анхны санхүүгийн байгууллага болсон.',
    short_en: 'Became the first financial institution to offer loans with car driving conditions.',
    desc_mn: 'Бүтээгдэхүүнээ иргэдэд санал болгохын хажуугаар өрсөлдөгчид улам нэмэгдсээр зах зээлээ алдаж эхэлсэн энэ үед удирдах зөвлөл маш том шийдвэрийг гаргаж ажиллахаар болсон. Энэ нь та бидний одоогийн сайн мэдэх автомашиныг барьцаалахдаа унах нөхцөлтэй зээлийг санал болгох эрсдэлтэй шийдвэрийг гаргасан анхны санхүүгийн байгууллага. Энэ үеэс эхлэн зах зээл дээр байр сууриа бат барьж иргэдийнхээ санхүүгийн тулгамдсан хэрэгцээг шийдвэрлэж банкнаас татгалзаад байгаа иргэдийг улам их дэмжин ажиллаж байсан. Мөн түүнчлэн шинэ бүтээгдэхүүн болох 9911-тэй дугаарт анхны зээлийг олгож эхэлсэн.',
    desc_en: 'Made a major decision to offer loans with car driving conditions, becoming the first financial institution to do so.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2011', 
    title_mn: 'ХӨРӨНГӨ ОРУУЛАЛТ ТАТСАН',
    title_en: 'ATTRACTED INVESTMENT',
    short_mn: 'Австрали улсаас 1 сая долларын хөрөнгө оруулалтыг татаж, зах зээлийн дундаж хүүг бууруулах боломжийг бүрдүүлсэн.',
    short_en: 'Attracted $1 million investment from Australia, enabling reduction of market average interest rates.',
    desc_mn: 'Санхүүгийн хүртээмжийг нэмэгдүүлэхийн хэрээр олон улстай түнш байгууллага тогтоон Австрали улсаас 1 сая долларын хөрөнгө оруулалтыг оруулж эхэлсэн. Энэ нь бидний хувьд маш том гарц маш том өөрчлөлтийг дахин авчирсан. Зах зээл дээр байгаа дундаж хүүг эргэлтийн хөрөнгө оруулалтаар буулгаж ажиллагсад болон зээлийн иргэдийнхээ төлөлт болоод цалингийн асуудал дээр анхаарч ажилласан.',
    desc_en: 'Established partnerships with international organizations and started receiving $1 million investment from Australia.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2012', 
    title_mn: 'САЛБАР НЭГЖИЙН ӨРГӨЖИЛТ',
    title_en: 'BRANCH EXPANSION',
    short_mn: 'Орон нутагт 10 салбар, нийслэлд 8 салбар, 150 гаруй ажиллагсадтайгаар үйл ажиллагаагаа өргөжүүлэв.',
    short_en: 'Expanded operations with 10 branches in rural areas, 8 in the capital, and over 150 employees.',
    desc_mn: '2009-2012 он бидний хувьд санхүүгийн хүртээмжийг иргэдэд илүү ойртуулахын төлөө хичээн, орон нутагт 10 салбар, нийслэлд 8 салбар, 150 гаруй ажиллагсадтайгаар үйл ажиллагаагаа явуулж, иргэдийн тулгамдаж буй санхүүгийн асуудлыг хурдан шийдвэрлэж ажилласан он жил байсан юм.',
    desc_en: 'From 2009-2012, worked to bring financial accessibility closer to citizens.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2015', 
    title_mn: 'ҮЙЛ АЖИЛЛАГААГАА ӨРГӨТГӨСӨН',
    title_en: 'EXPANDED OPERATIONS',
    short_mn: 'ББСБ-ын статустай болж, зээлийн хүү болон шимтгэлийг бууруулан, шимтгэлийг 0% болгож харилцагчдадаа бэлэг барьсан.',
    short_en: 'Obtained NBFI status, reduced interest rates and fees, making fees 0% as a gift to customers.',
    desc_mn: 'Зээлийн бүтээгдэхүүнийг нэмэгдэхийн хирээр иргэдийнхээ зээлжих боломжийг харилцагчдынхаа амьдралын өөрчлөлтөд өөрчлөлт оруулахын тулд Санхүүгийн зохицуулах хороотой хамтран ажилласны үр дүнд Монголын банк бус санхүүгийн байгууллагын нэр томъеог аван иргэдийнхээ зээлийн бүтээгдэхүүн дээр хүүний болоод шимтгэлийн хувьд асар том өөрчлөлтийг оруулж харилцагчдадаа бэлэг барьсан. Шимтгэлийг 0% болгож хүүг банк бусийн журмын дагуу өөрчлөлт оруулж ажилласны хэрээр зээл авах хугацаа дагаад уртассан сайхан мэдээг харилцагчид таатай хүлээж аван итгэлцлийн холбоо улам батжиж бид 30,000 гаруй итгэл нь дүүрсэн харилцагчидтай болж чадсан.',
    desc_en: 'Worked with the Financial Regulatory Commission to obtain NBFI status and made significant changes to loan products.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2017', 
    title_mn: 'NISSAN LEAF ЦАХИЛГААН МАШИН',
    title_en: 'NISSAN LEAF ELECTRIC CAR',
    short_mn: 'Эко зээлийг нэвтрүүлж, Ниссан маркийн цахилгаан автомашиныг Монголын нөхцөлд туршин нэвтрүүлсэн.',
    short_en: 'Introduced eco loans and tested Nissan electric cars in Mongolian conditions.',
    desc_mn: 'Ниссан маркийн 4 цахилгаан автомашиныг Монголын уур амьсгалд тохиромжтой эсэхийг нэг жилийн хугацаанд туршин, олон нийтэд таниулсан. Мөн эко зээлийг нэвтрүүлсэн анхны санхүүгийн байгууллага болсон юм.',
    desc_en: 'Tested 4 Nissan electric cars for one year to see if they are suitable for Mongolian climate.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2018', 
    title_mn: 'СОНО ФИНТЕК ТӨСӨЛ',
    title_en: 'SONO FINTECH PROJECT',
    short_mn: 'Технологийн дэвшилд суурилсан "Соно Монголиа" зээлийн аппликэйшнийг амжилттай нэвтрүүлэн зах зээлд гаргасан.',
    short_en: 'Successfully introduced and launched the Sono Mongolia loan application based on technological advancement.',
    desc_mn: 'Монголын зах зээл дээр технологийн дэвшилтэд хурдыг ашиглах зорилгоор Соно Монголиа зээлийн аппликэйшнийг амжилттай нэвтрүүлэн ажиллаж чадсан.',
    desc_en: 'Successfully implemented and operated the Sono Mongolia loan application to leverage technological advancement in the Mongolian market.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2019', 
    title_mn: 'ТӨГРӨГ МАТ - ЗЭЭЛИЙН АТМ',
    title_en: 'TUGRUG MAT - LOAN ATM',
    short_mn: 'Банкны АТМ ойлголтыг эвдэж, зээл олгодог Т-мат төслийг амжилттай эхлүүлсэн.',
    short_en: 'Successfully launched the T-mat project that breaks the traditional bank ATM concept by providing loans.',
    desc_mn: 'Монголын зах зээл дээр Банкны АТМ гэх нэршил томьёог эвдэж чадсан Т-мат зээлийн АТМ ын төслийг эхлүүлсэн.',
    desc_en: 'Launched the T-mat loan ATM project that successfully broke the traditional bank ATM terminology in the Mongolian market.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2020', 
    title_mn: 'АНУ ДАХЬ САЛБАР & ӨРГӨЖИЛТ',
    title_en: 'US BRANCH & EXPANSION',
    short_mn: 'АНУ-ын Лос Анжелес хотод шинэ салбар нээх төсөл болон дотоодын Төгрөг Мат сүлжээг эрчимтэй тэлсэн.',
    short_en: 'Intensively expanded the domestic Tugrug Mat network and opened a new branch project in Los Angeles, USA.',
    desc_mn: 'Бид бичил санхүүгийн зах зээл дээрээс анхны салбар болох Чикаго хотод Моннимакс нэршлээр нээгээд удаагүй ч бидний гадны хөрөнгийг Монголын зах зээл дээр оруулж ирэх зорилгодоо хөтлөгдөн дахин нэг салбарыг Лос анджелес мужид нээхээр ажиллаад байна. Мөн Т-мат зээлийн АТМ-ыг маш амжилттай нэврүүлж, орон нутаг Улаанбаатар хот нийлээд 50 гаруй АТМ-ээр дамжуулан үйлчилгээ үзүүлж байна.',
    desc_en: 'Shortly after opening our first branch in the microfinance market in Chicago under the name Monnimax, we are working to open another branch in Los Angeles to bring foreign investment to the Mongolian market. We have also successfully implemented the T-mat loan ATM, providing services through over 50 ATMs in rural areas and Ulaanbaatar.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2020', 
    title_mn: 'ОЛОН УЛСЫН ТӨСӨЛ - ФИЛИППИН',
    title_en: 'INTERNATIONAL PROJECT - PHILIPPINES',
    short_mn: 'Филиппин улсад зээлийн АТМ сүлжээг нэвтрүүлж, гадны хөрөнгө оруулалт татах төслийг эхлүүлсэн.',
    short_en: 'Introduced loan ATM network in the Philippines and launched a project to attract foreign investment.',
    desc_mn: 'Төгрөг Мат буюу зээлийн АТМ ийн сүлжээг тэлэх зорилготой мөн гадны хөрөнгийг Монголын эдийн засагт дэмжлэг болгох гүүрэн гарц хэмээн нэрийдэж удаах сүлжээ улсаа Филиппин улсыг сонгон төслийн ажилдаа орсон.',
    desc_en: 'Selected the Philippines as the target country for expanding the Tugrug Mat loan ATM network and started project work to serve as a bridge for bringing foreign investment to support the Mongolian economy.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  },
  { 
    year: '2021', 
    title_mn: 'ХӨРӨНГӨ ОРУУЛАЛТ ТАТСАН',
    title_en: 'ATTRACTED INVESTMENT',
    short_mn: '12 тэрбум төгрөгийн хөрөнгө оруулалтыг амжилттай босгож, үйл ажиллагаагаа дахин шат ахиулсан.',
    short_en: 'Successfully raised 12 billion tugrug investment and advanced operations to the next level.',
    desc_mn: '12 тэрбум төгрөгийн хөрөнгө оруулалтын амжилттай босгож чадсан.',
    desc_en: 'Successfully raised 12 billion tugrug investment.',
    year_color: '#0d9488',
    title_color: '#0f172a',
    short_color: '#475569',
    desc_color: '#475569'
  }
]

export default function IntroTab({ onSave, loading = false }: IntroTabProps) {
  const [intro, setIntro] = useState<TabContent>({
    title_mn: 'Бидний тухай',
    title_en: 'About Us',
    content_mn: 'Манай компани нь үйл ажиллагаандаа тусгай анхаарал өгдөг. Бид үйлчлүүлэгчдийн эрүүл мэндийн төлөөл, орлого, төлөлтийн чадвартай төлөвлөлтийг хүчдэлж ажиллана.',
    content_en: 'Our company pays special attention to its operations. We support customers health, income, and payment capacity planning.',
    image_url: '',
    image_height: 'aspect-video',
    // Origin Story
    origin_title_mn: 'Анх санхүүгийн зах зээлд Бичил Глобус-г үүсгэн байгуулах болсон шалтгаан',
    origin_title_en: 'Why we founded Bichil Globus in the financial market',
    origin_p1_mn: '2008 онд Банк санхүүгийн салбаруудад бичил зээлийн бүтээгдэхүүн гэж байхгүй байсан ба зээлийн үйлчилгээ нь дунд түвшиний амжиргаатай иргэдэд чиглэсэн зээлийн үйлчилгээнүүд түлхүү байдаг байсан. Мөн бичил зээлийн төвүүдийн тоо маш цөөхөн байсан. Энэ үед өрхийн зээл гэж байгаагүй.',
    origin_p1_en: 'In 2008, there were no microfinance products in the banking and financial sectors...',
    origin_p2_mn: 'Наймаачдад ашиг орлоготой, эх үүсвэр эргэлтийн хөрөнгөө нэмэгдүүлье гэхэд Банкны зээлийн шаардлагад тэнцэхгүй тогтвортой орлогогүй, барьцаагүй учир зээл авах боломжгүй байсан. Зарим нэг ББСБ болон Банкны зүгээс тогтмол орлоготой иргэдэд зээлийн үйлчилгээг санал болгодог тул наймаачид зээл огт авч чаддаггүй байсан.',
    origin_p2_en: 'Traders could not get loans due to lack of stable income and collateral...',
    origin_p3_mn: 'Энэхүү зах зээлийг олж хараад эдгээр хүмүүст яагаад зээл олгож болохгүй гэж санхүүгийн үйлчилгээг хүргэж болохгүй гэсэн санаа гараад үүний дагуу анх барьцаагүй зээлийн үйлчилгээг иргэдэд олгож ирсэн.',
    origin_p3_en: 'We decided to provide financial services to these people...',
    // What We Do
    whatWeDo_title_mn: 'Юу хийдэг вэ?',
    whatWeDo_title_en: 'What We Do?',
    whatWeDo_content_mn: 'Манай нийт харилцагчдын дийлэнх хувийг жижиг дунд бизнес эрхлэгчид болон хувиараа хөдөлмөр эрхлэгчид эзэлдэг. Эдгээр иргэд нь нийгмийн даатгалын хураамж тогтмол төлдөггүй, банкны дансны хуулгаар орлогоо баталгаажуулах боломжгүй зэрэг шалтгаанаас улбаалан банкны зээлийн үйлчилгээг төдийлөн авч чаддаггүй юм. Харин бид тус нийгмийн бүлгүүдийн санхүүгийн чадамж, хэрэгцээ, шаардлагад нийцсэн 5 төрлийн зээлийн бүтээгдэхүүнийг санал болгон ажиллаж байна.',
    whatWeDo_content_en: 'Most of our customers are small and medium business owners and self-employed individuals...',
    // SME
    sme_title_mn: 'Жижгээс дунд, дундаас томд',
    sme_title_en: 'From Small to Medium to Large',
    sme_p1_mn: 'Аль ч улс орон, цаг үед жижиг дунд бизнесүүд эдийн засгийг хөдөлгөгч гол хүч байдаг. Энэ утгаараа бид жижиг дунд бизнес эрхлэгчдийн эрэлт хэрэгцээнд нийцүүлэн бизнесийн зориулалттай зээлийн үйлчилгээг байгуулагдсан цагаасаа хойш голлон үзүүлж ирсэн.',
    sme_p1_en: 'Small and medium enterprises are the main driving force of the economy...',
    sme_p2_mn: 'Өнөөдрийн байдлаар "Бичил Глобус" Санхүүгийн нэгдэлд бүртгэлтэй нийт харилцагчдын 40 орчим хувийг жижиг дунд бизнес эрхлэгчид эзэлж байна. Үүнд худалдаа, үйлдвэрлэл, үйлчилгээ, барилгын салбарынхан зонхилдог.',
    sme_p2_en: 'Currently, small and medium business owners make up about 40% of our registered customers...',
    // Citizen
    citizen_title_mn: 'Иргэн баян бол улс баян',
    citizen_title_en: 'Wealthy Citizens, Wealthy Nation',
    citizen_p1_mn: 'Зээлийн үйлчилгээ бол иргэдийг эдийн засгийн амьдралд идэвхтэй оролцох боломжийг олгож өгдөг. Эдийн засгийн идэвхтэй иргэнд ая тухтай амьдралыг бий болгож, амьжиргааны түвшингөө сайжруулах, цаашлаад нийгэмд баялгийг бүтээх нөхцөл бүрдэнэ.',
    citizen_p1_en: 'Loan services enable citizens to participate actively in economic life...',
    citizen_p2_mn: 'Өнгөрсөн 10 жилийн хугацаанд давхардсан тоогоор хот, хөдөөгийн 37,900 орчим өрхөд зээлийн үйлчилгээг шуурхай хүргэж үйлчилсэн байна. 2018 оны жилийн эцсийн байдлаар нийт зээлийн багцын 60%-ийг өрхийн санхүүжилтийн зориулалттай зээл эзэлж байна.',
    citizen_p2_en: 'Over the past 10 years, we have provided loan services to approximately 37,900 households...',
    // Font Styling - 12 хэсэг тус бүрийнх
    // Origin Story
    origin_title_color: '#0f172a',
    origin_title_size: 24,
    origin_title_weight: '700',
    origin_title_family: 'inherit',
    origin_p1_color: '#475569',
    origin_p1_size: 14,
    origin_p1_weight: '400',
    origin_p1_family: 'inherit',
    origin_p2_color: '#475569',
    origin_p2_size: 14,
    origin_p2_weight: '400',
    origin_p2_family: 'inherit',
    origin_p3_color: '#0f172a',
    origin_p3_size: 14,
    origin_p3_weight: '600',
    origin_p3_family: 'inherit',
    // What We Do
    whatWeDo_title_color: '#0f172a',
    whatWeDo_title_size: 18,
    whatWeDo_title_weight: '700',
    whatWeDo_title_family: 'inherit',
    whatWeDo_content_color: '#475569',
    whatWeDo_content_size: 14,
    whatWeDo_content_weight: '400',
    whatWeDo_content_family: 'inherit',
    // SME
    sme_title_color: '#0f172a',
    sme_title_size: 18,
    sme_title_weight: '700',
    sme_title_family: 'inherit',
    sme_p1_color: '#475569',
    sme_p1_size: 14,
    sme_p1_weight: '400',
    sme_p1_family: 'inherit',
    sme_p2_color: '#475569',
    sme_p2_size: 14,
    sme_p2_weight: '400',
    sme_p2_family: 'inherit',
    // Citizen
    citizen_title_color: '#0f172a',
    citizen_title_size: 18,
    citizen_title_weight: '700',
    citizen_title_family: 'inherit',
    citizen_p1_color: '#475569',
    citizen_p1_size: 14,
    citizen_p1_weight: '400',
    citizen_p1_family: 'inherit',
    citizen_p2_color: '#475569',
    citizen_p2_size: 14,
    citizen_p2_weight: '400',
    citizen_p2_family: 'inherit',
    // Visibility defaults - all sections visible by default
    origin_title_visible: true,
    origin_p1_visible: true,
    origin_p2_visible: true,
    origin_p3_visible: true,
    whatWeDo_title_visible: true,
    whatWeDo_content_visible: true,
    sme_title_visible: true,
    sme_p1_visible: true,
    sme_p2_visible: true,
    citizen_title_visible: true,
    citizen_p1_visible: true,
    citizen_p2_visible: true,
    // Timeline Events
    timeline_events: historyEvents.map(event => ({ ...event, visible: true }))
  })

  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(new Set())
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set())
  const [showPreview, setShowPreview] = useState(true)
  const [showTimelinePreview, setShowTimelinePreview] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<'demo' | 'timeline' | null>(null)
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const whatWeDo = useInViewAnimation()
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // IntersectionObserver for timeline items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible: number[] = []
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            newlyVisible.push(index)
          }
        })

        if (newlyVisible.length) {
          setActiveIndex(newlyVisible[newlyVisible.length - 1])
          setRevealedIndexes(prev => {
            const next = new Set(prev)
            newlyVisible.forEach(i => next.add(i))
            return next
          })
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0.1 }
    )

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Track What We Do section reveal
  useEffect(() => {
    if (whatWeDo.visible && !revealedSections.has('whatWeDo')) {
      setRevealedSections(prev => {
        const next = new Set(prev)
        next.add('whatWeDo')
        return next
      })
    }
  }, [whatWeDo.visible, revealedSections])

  const handleSave = () => {
    onSave(intro)
  }

  const handleOpenEditModal = (section: 'demo' | 'timeline') => {
    setEditingSection(section)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditingSection(null)
  }

  const toggleYear = (index: number) => {
    setExpandedYear(expandedYear === index ? null : index)
  }

  return (
    <div className="grid md:grid-cols-1 gap-6">
      {/* Preview - Frontend Style */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-6 py-3 z-10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Demo</h3>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-slate-200/80 p-1 rounded-lg">
              <button 
                onClick={() => setPreviewLang('mn')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'mn' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                MN
              </button>
              <button 
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => handleOpenEditModal('demo')}
              className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
              title="Засах"
            >
              Засах
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              title={showPreview ? 'Нуух' : 'Харуулах'}
            >
              {showPreview ? (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {showPreview && (
          <div className="overflow-y-auto max-h-[75vh] p-6">
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              {/* Origin Story */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
                <div className="space-y-4">
                  <div className="inline-block bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-xs font-medium">
                    Бидний түүх
                  </div>
                  {intro.origin_title_visible && (
                    <h2 
                      className="leading-tight"
                      style={{
                        color: intro.origin_title_color,
                        fontSize: `${intro.origin_title_size}px`,
                        fontWeight: intro.origin_title_weight,
                        fontFamily: intro.origin_title_family,
                      }}
                    >
                      {previewLang === 'mn' ? intro.origin_title_mn : intro.origin_title_en}
                    </h2>
                  )}
                  <div className="space-y-3 leading-relaxed text-justify">
                    {intro.origin_p1_visible && (
                      <p style={{
                        color: intro.origin_p1_color,
                        fontSize: `${intro.origin_p1_size}px`,
                        fontWeight: intro.origin_p1_weight,
                        fontFamily: intro.origin_p1_family,
                      }}>{previewLang === 'mn' ? intro.origin_p1_mn : intro.origin_p1_en}</p>
                    )}
                    {intro.origin_p2_visible && (
                      <p style={{
                        color: intro.origin_p2_color,
                        fontSize: `${intro.origin_p2_size}px`,
                        fontWeight: intro.origin_p2_weight,
                        fontFamily: intro.origin_p2_family,
                      }}>{previewLang === 'mn' ? intro.origin_p2_mn : intro.origin_p2_en}</p>
                    )}
                    {intro.origin_p3_visible && (
                      <p style={{
                        color: intro.origin_p3_color,
                        fontSize: `${intro.origin_p3_size}px`,
                        fontWeight: intro.origin_p3_weight,
                        fontFamily: intro.origin_p3_family,
                      }}>{previewLang === 'mn' ? intro.origin_p3_mn : intro.origin_p3_en}</p>
                    )}
                  </div>
                </div>
                <div className={`rounded-lg overflow-hidden bg-slate-100 ${intro.image_height || 'aspect-video'}`}>
                  {intro.image_url ? (
                    <img 
                      src={intro.image_url} 
                      alt="About Us Team" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Зураг сонгогдоогүй
                    </div>
                  )}
                </div>
              </div>

              {/* What We Do Section */}
              <div className="bg-slate-50 p-6 rounded-lg hover:shadow-md transition-all">
                {intro.whatWeDo_title_visible && (
                  <h3 className="mb-3 flex items-center gap-2" style={{
                    color: intro.whatWeDo_title_color,
                    fontSize: `${intro.whatWeDo_title_size}px`,
                    fontWeight: intro.whatWeDo_title_weight,
                    fontFamily: intro.whatWeDo_title_family,
                  }}>
                    <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs">
                      ℹ
                    </span>
                    {previewLang === 'mn' ? intro.whatWeDo_title_mn : intro.whatWeDo_title_en}
                  </h3>
                )}
                {intro.whatWeDo_content_visible && (
                  <p className="leading-relaxed text-justify" style={{
                    color: intro.whatWeDo_content_color,
                    fontSize: `${intro.whatWeDo_content_size}px`,
                    fontWeight: intro.whatWeDo_content_weight,
                    fontFamily: intro.whatWeDo_content_family,
                  }}>
                    {previewLang === 'mn' ? intro.whatWeDo_content_mn : intro.whatWeDo_content_en}
                  </p>
                )}
              </div>

              {/* SME and Citizen Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SME */}
                <div className="space-y-3">
                  {intro.sme_title_visible && (
                    <h3 className="border-b-2 border-teal-500 pb-2 inline-block" style={{
                      color: intro.sme_title_color,
                      fontSize: `${intro.sme_title_size}px`,
                      fontWeight: intro.sme_title_weight,
                      fontFamily: intro.sme_title_family,
                    }}>{previewLang === 'mn' ? intro.sme_title_mn : intro.sme_title_en}</h3>
                  )}
                  <div className="text-justify leading-relaxed space-y-3">
                    {intro.sme_p1_visible && (
                      <p style={{
                        color: intro.sme_p1_color,
                        fontSize: `${intro.sme_p1_size}px`,
                        fontWeight: intro.sme_p1_weight,
                        fontFamily: intro.sme_p1_family,
                      }}>{previewLang === 'mn' ? intro.sme_p1_mn : intro.sme_p1_en}</p>
                    )}
                    {intro.sme_p2_visible && (
                      <p style={{
                        color: intro.sme_p2_color,
                        fontSize: `${intro.sme_p2_size}px`,
                        fontWeight: intro.sme_p2_weight,
                        fontFamily: intro.sme_p2_family,
                      }}>{previewLang === 'mn' ? intro.sme_p2_mn : intro.sme_p2_en}</p>
                    )}
                  </div>
                </div>

                {/* Citizen Wealth */}
                <div className="space-y-3">
                  {intro.citizen_title_visible && (
                    <h3 className="border-b-2 border-teal-500 pb-2 inline-block" style={{
                      color: intro.citizen_title_color,
                      fontSize: `${intro.citizen_title_size}px`,
                      fontWeight: intro.citizen_title_weight,
                      fontFamily: intro.citizen_title_family,
                    }}>{previewLang === 'mn' ? intro.citizen_title_mn : intro.citizen_title_en}</h3>
                  )}
                  <div className="text-justify leading-relaxed space-y-3">
                    {intro.citizen_p1_visible && (
                      <p style={{
                        color: intro.citizen_p1_color,
                        fontSize: `${intro.citizen_p1_size}px`,
                        fontWeight: intro.citizen_p1_weight,
                        fontFamily: intro.citizen_p1_family,
                      }}>{previewLang === 'mn' ? intro.citizen_p1_mn : intro.citizen_p1_en}</p>
                    )}
                    {intro.citizen_p2_visible && (
                      <p style={{
                        color: intro.citizen_p2_color,
                        fontSize: `${intro.citizen_p2_size}px`,
                        fontWeight: intro.citizen_p2_weight,
                        fontFamily: intro.citizen_p2_family,
                      }}>{previewLang === 'mn' ? intro.citizen_p2_mn : intro.citizen_p2_en}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Preview - Separate */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-6 py-3 z-10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Түүхэн замнал</h3>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-slate-200/80 p-1 rounded-lg">
              <button 
                onClick={() => setPreviewLang('mn')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'mn' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                MN
              </button>
              <button 
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => handleOpenEditModal('timeline')}
              className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
              title="Засах"
            >
              Засах
            </button>
            <button
              onClick={() => setShowTimelinePreview(!showTimelinePreview)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              title={showTimelinePreview ? 'Нуух' : 'Харуулах'}
            >
              {showTimelinePreview ? (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {showTimelinePreview && (
          <div className="overflow-y-auto max-h-[75vh] p-6">
            <div ref={timelineRef} className="py-12 relative overflow-hidden">
              <h3 className="text-3xl font-bold text-center mb-16 text-slate-900">
                Түүхэн замнал
              </h3>
              
              {/* Vertical Line */}
              <div className="absolute left-[27px] md:left-1/2 top-32 bottom-12 w-0.5 bg-teal-200 transform md:-translate-x-1/2"></div>

              <div className="space-y-12">
                  {intro.timeline_events.filter(e => e.visible).map((event, index) => {
                    const isExpanded = expandedYear === index
                    const isEven = index % 2 === 0

                    // Content Card Component
                    const ContentCard = (
                      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative z-10">
                        <div className="md:hidden flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold" style={{ color: event.year_color }}>{event.year}</span>
                          <div className="h-px bg-teal-100 flex-1"></div>
                        </div>

                        <h4 className="text-lg font-bold mb-2 group-hover:text-teal-600 transition-colors" style={{ color: event.title_color }}>{previewLang === 'mn' ? event.title_mn : event.title_en}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: event.short_color }}>
                          {previewLang === 'mn' ? event.short_mn : event.short_en}
                        </p>
                        
                        <div className={clsx(
                          "grid transition-all duration-300 ease-in-out",
                          isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                        )}>
                          <div className="overflow-hidden min-h-0">
                            <div className="pt-4 border-t border-gray-100 text-sm leading-relaxed text-justify" style={{ color: event.desc_color }}>
                              {previewLang === 'mn' ? event.desc_mn : event.desc_en}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleYear(index)}
                          className="flex items-center gap-2 text-sm font-medium text-teal-600 mt-4 hover:bg-teal-50 px-3 py-1.5 rounded-lg -ml-3 w-fit transition-colors"
                        >
                          {isExpanded ? 'Хураангуйлах' : 'Дэлгэрэнгүй'}
                          <svg 
                            className={clsx("w-4 h-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )

                    return (
                      <div
                        key={index}
                        ref={(el) => { if (el) itemRefs.current[index] = el; }}
                        data-index={index}
                        className="relative flex flex-col md:flex-row items-center md:items-start group"
                      >
                        {/* Mobile/Desktop Dot */}
                        <div className="absolute left-[18px] md:left-1/2 w-5 h-5 rounded-full border-4 border-white bg-teal-600 shadow-sm z-20 top-0 md:top-8 transform md:-translate-x-1/2"></div>
                        
                        {/* Left Side (Desktop) */}
                        <div className={clsx(
                          "w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right flex md:block",
                          isEven ? "" : "md:flex md:justify-end" 
                        )}>
                          {/* Mobile: Always Show Card */}
                          <div className="md:hidden w-full">
                            {ContentCard}
                          </div>

                          {/* Desktop: Show Card if Even, Year if Odd */}
                          <div className="hidden md:block w-full">
                            {isEven ? ContentCard : (
                              <span className="text-5xl font-bold sticky top-32 transition-colors duration-300" style={{ color: event.year_color, opacity: activeIndex === index ? 1 : 0.5 }}>
                                {event.year}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Side (Desktop) */}
                        <div className="hidden md:block w-full md:w-1/2 md:pl-12 text-left">
                          {/* Desktop: Show Year if Even, Card if Odd */}
                          {isEven ? (
                            <span className="text-5xl font-bold sticky top-32 transition-colors duration-300" style={{ color: event.year_color, opacity: activeIndex === index ? 1 : 0.5 }}>
                              {event.year}
                            </span>
                          ) : ContentCard}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={handleCloseEditModal} 
        title={editingSection === 'demo' ? 'Demo хэсгийг засах (12 хэсэг)' : 'Түүхэн замналыг засах'}
        size="xl"
      >
        {editingSection === 'demo' && (
          <div className="space-y-5 pb-4">
            {/* IMAGE UPLOAD - Зураг оруулах */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">Бидний түүхэн зургийг сонгох</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4">Зураг сонгосны дараа уг зургийн URL хаяг дээр дарж өөр зургаар солих боломжтой</p>
              <div className="space-y-4">
                <ImageUpload 
                  value={intro.image_url}
                  onChange={(url: string) => setIntro({ ...intro, image_url: url })}
                  label="Зургийг оруулах"
                />
                
                {/* Image Height/Aspect Ratio Controls */}
                <div className="bg-purple-100/40 rounded-lg p-3 border border-purple-200">
                  <label className="block text-sm font-medium text-gray-800 mb-3">Зургийн хэмжээ/харьцаа</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'aspect-square', label: '1:1 (Дөрвөлжин)' },
                      { value: 'aspect-video', label: '16:9 (Видео)' },
                      { value: 'aspect-[3/2]', label: '3:2' },
                      { value: 'aspect-[4/3]', label: '4:3' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setIntro({ ...intro, image_height: option.value })}
                        className={clsx(
                          'px-3 py-2 text-xs font-medium rounded-md transition-colors border',
                          intro.image_height === option.value
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 1/12: Origin Title - Гарчиг */}
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">1. Бидний түүх - Гарчиг</h4>
                <button
                  onClick={() => setIntro({ ...intro, origin_title_visible: !intro.origin_title_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.origin_title_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.origin_title_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн гарчгийн текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (Монгол)</label>
                    <input
                      type="text"
                      value={intro.origin_title_mn}
                      onChange={(e) => setIntro({ ...intro, origin_title_mn: e.target.value })}
                      placeholder="Гарчиг"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (English)</label>
                    <input
                      type="text"
                      value={intro.origin_title_en}
                      onChange={(e) => setIntro({ ...intro, origin_title_en: e.target.value })}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                {/* Font Controls for Origin Title */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-teal-100/40 rounded-lg p-3 border border-teal-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.origin_title_color}
                      onChange={(e) => setIntro({ ...intro, origin_title_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="48"
                      value={intro.origin_title_size}
                      onChange={(e) => setIntro({ ...intro, origin_title_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.origin_title_weight}
                      onChange={(e) => setIntro({ ...intro, origin_title_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.origin_title_family}
                      onChange={(e) => setIntro({ ...intro, origin_title_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                      <option value="'Georgia', serif">Georgia</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.origin_title_color,
                        fontSize: `${intro.origin_title_size}px`,
                        fontWeight: intro.origin_title_weight,
                        fontFamily: intro.origin_title_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 2/12: Origin P1 - Параграф 1 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">2. Бидний түүх - Параграф 1</h4>
                <button
                  onClick={() => setIntro({ ...intro, origin_p1_visible: !intro.origin_p1_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.origin_p1_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.origin_p1_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн эхний параграфын текст болон фонтыг засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (Монгол)</label>
                    <textarea
                      value={intro.origin_p1_mn}
                      onChange={(e) => setIntro({ ...intro, origin_p1_mn: e.target.value })}
                      placeholder="Эхний догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (English)</label>
                    <textarea
                      value={intro.origin_p1_en}
                      onChange={(e) => setIntro({ ...intro, origin_p1_en: e.target.value })}
                      placeholder="First paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                {/* Font Controls for Paragraph 1 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.origin_p1_color}
                      onChange={(e) => setIntro({ ...intro, origin_p1_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.origin_p1_size}
                      onChange={(e) => setIntro({ ...intro, origin_p1_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.origin_p1_weight}
                      onChange={(e) => setIntro({ ...intro, origin_p1_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.origin_p1_family}
                      onChange={(e) => setIntro({ ...intro, origin_p1_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.origin_p1_color,
                        fontSize: `${intro.origin_p1_size}px`,
                        fontWeight: intro.origin_p1_weight,
                        fontFamily: intro.origin_p1_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 3/12: Origin P2 - Параграф 2 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">3. Бидний түүх - Параграф 2</h4>
                <button
                  onClick={() => setIntro({ ...intro, origin_p2_visible: !intro.origin_p2_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.origin_p2_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.origin_p2_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн хоёрдугаар параграфын текст болон фонтыг засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (Монгол)</label>
                    <textarea
                      value={intro.origin_p2_mn}
                      onChange={(e) => setIntro({ ...intro, origin_p2_mn: e.target.value })}
                      placeholder="Хоёрдугаар догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (English)</label>
                    <textarea
                      value={intro.origin_p2_en}
                      onChange={(e) => setIntro({ ...intro, origin_p2_en: e.target.value })}
                      placeholder="Second paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                {/* Font Controls for Paragraph 2 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.origin_p2_color}
                      onChange={(e) => setIntro({ ...intro, origin_p2_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.origin_p2_size}
                      onChange={(e) => setIntro({ ...intro, origin_p2_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.origin_p2_weight}
                      onChange={(e) => setIntro({ ...intro, origin_p2_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.origin_p2_family}
                      onChange={(e) => setIntro({ ...intro, origin_p2_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.origin_p2_color,
                        fontSize: `${intro.origin_p2_size}px`,
                        fontWeight: intro.origin_p2_weight,
                        fontFamily: intro.origin_p2_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 4/12: Origin P3 - Параграф 3 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">4. Бидний түүх - Параграф 3 (Тодотгол)</h4>
                <button
                  onClick={() => setIntro({ ...intro, origin_p3_visible: !intro.origin_p3_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.origin_p3_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.origin_p3_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн гуравдугаар параграфын (тодотгол) текст болон фонтыг засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 3 (Монгол - Тодотгол)</label>
                    <textarea
                      value={intro.origin_p3_mn}
                      onChange={(e) => setIntro({ ...intro, origin_p3_mn: e.target.value })}
                      placeholder="Гуравдугаар догол мөр"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 3 (English - Highlight)</label>
                    <textarea
                      value={intro.origin_p3_en}
                      onChange={(e) => setIntro({ ...intro, origin_p3_en: e.target.value })}
                      placeholder="Third paragraph"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                {/* Font Controls for Paragraph 3 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.origin_p3_color}
                      onChange={(e) => setIntro({ ...intro, origin_p3_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.origin_p3_size}
                      onChange={(e) => setIntro({ ...intro, origin_p3_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.origin_p3_weight}
                      onChange={(e) => setIntro({ ...intro, origin_p3_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.origin_p3_family}
                      onChange={(e) => setIntro({ ...intro, origin_p3_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.origin_p3_color,
                        fontSize: `${intro.origin_p3_size}px`,
                        fontWeight: intro.origin_p3_weight,
                        fontFamily: intro.origin_p3_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 5/12: What We Do Title */}
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">5. Юу хийдэг вэ? - Гарчиг</h4>
                <button
                  onClick={() => setIntro({ ...intro, whatWeDo_title_visible: !intro.whatWeDo_title_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.whatWeDo_title_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.whatWeDo_title_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн "Юу хийдэг вэ?" гарчгийн текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (Монгол)</label>
                    <input
                      type="text"
                      value={intro.whatWeDo_title_mn}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_mn: e.target.value })}
                      placeholder="Гарчиг"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (English)</label>
                    <input
                      type="text"
                      value={intro.whatWeDo_title_en}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_en: e.target.value })}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                {/* Font Controls for What We Do Title */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-teal-100/40 rounded-lg p-3 border border-teal-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.whatWeDo_title_color}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="16"
                      max="48"
                      value={intro.whatWeDo_title_size}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.whatWeDo_title_weight}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.whatWeDo_title_family}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_title_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.whatWeDo_title_color,
                        fontSize: `${intro.whatWeDo_title_size}px`,
                        fontWeight: intro.whatWeDo_title_weight,
                        fontFamily: intro.whatWeDo_title_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 6/12: What We Do Content */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">6. Юу хийдэг вэ? - Агуулга</h4>
                <button
                  onClick={() => setIntro({ ...intro, whatWeDo_content_visible: !intro.whatWeDo_content_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.whatWeDo_content_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.whatWeDo_content_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн "Юу хийдэг вэ?" агуулгын текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Агуулга (Монгол)</label>
                    <textarea
                      value={intro.whatWeDo_content_mn}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_mn: e.target.value })}
                      placeholder="Агуулга"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Агуулга (English)</label>
                    <textarea
                      value={intro.whatWeDo_content_en}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_en: e.target.value })}
                      placeholder="Content"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for What We Do Content */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.whatWeDo_content_color}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.whatWeDo_content_size}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.whatWeDo_content_weight}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.whatWeDo_content_family}
                      onChange={(e) => setIntro({ ...intro, whatWeDo_content_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.whatWeDo_content_color,
                        fontSize: `${intro.whatWeDo_content_size}px`,
                        fontWeight: intro.whatWeDo_content_weight,
                        fontFamily: intro.whatWeDo_content_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 7/12: SME Title */}
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">7. Жижиг дунд бизнес - Гарчиг</h4>
                <button
                  onClick={() => setIntro({ ...intro, sme_title_visible: !intro.sme_title_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.sme_title_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.sme_title_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн SME гарчгийн текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (Монгол)</label>
                    <input
                      type="text"
                      value={intro.sme_title_mn}
                      onChange={(e) => setIntro({ ...intro, sme_title_mn: e.target.value })}
                      placeholder="Гарчиг"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (English)</label>
                    <input
                      type="text"
                      value={intro.sme_title_en}
                      onChange={(e) => setIntro({ ...intro, sme_title_en: e.target.value })}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for SME Title */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-teal-100/40 rounded-lg p-3 border border-teal-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.sme_title_color}
                      onChange={(e) => setIntro({ ...intro, sme_title_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="16"
                      max="48"
                      value={intro.sme_title_size}
                      onChange={(e) => setIntro({ ...intro, sme_title_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.sme_title_weight}
                      onChange={(e) => setIntro({ ...intro, sme_title_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.sme_title_family}
                      onChange={(e) => setIntro({ ...intro, sme_title_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.sme_title_color,
                        fontSize: `${intro.sme_title_size}px`,
                        fontWeight: intro.sme_title_weight,
                        fontFamily: intro.sme_title_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 8/12: SME P1 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">8. Жижиг дунд бизнес - Параграф 1</h4>
                <button
                  onClick={() => setIntro({ ...intro, sme_p1_visible: !intro.sme_p1_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.sme_p1_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.sme_p1_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн SME эхний параграфын текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (Монгол)</label>
                    <textarea
                      value={intro.sme_p1_mn}
                      onChange={(e) => setIntro({ ...intro, sme_p1_mn: e.target.value })}
                      placeholder="Эхний догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (English)</label>
                    <textarea
                      value={intro.sme_p1_en}
                      onChange={(e) => setIntro({ ...intro, sme_p1_en: e.target.value })}
                      placeholder="First paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for SME P1 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.sme_p1_color}
                      onChange={(e) => setIntro({ ...intro, sme_p1_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.sme_p1_size}
                      onChange={(e) => setIntro({ ...intro, sme_p1_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.sme_p1_weight}
                      onChange={(e) => setIntro({ ...intro, sme_p1_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.sme_p1_family}
                      onChange={(e) => setIntro({ ...intro, sme_p1_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.sme_p1_color,
                        fontSize: `${intro.sme_p1_size}px`,
                        fontWeight: intro.sme_p1_weight,
                        fontFamily: intro.sme_p1_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 9/12: SME P2 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">9. Жижиг дунд бизнес - Параграф 2</h4>
                <button
                  onClick={() => setIntro({ ...intro, sme_p2_visible: !intro.sme_p2_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.sme_p2_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.sme_p2_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн SME хоёрдугаар параграфын текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (Монгол)</label>
                    <textarea
                      value={intro.sme_p2_mn}
                      onChange={(e) => setIntro({ ...intro, sme_p2_mn: e.target.value })}
                      placeholder="Хоёрдугаар догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (English)</label>
                    <textarea
                      value={intro.sme_p2_en}
                      onChange={(e) => setIntro({ ...intro, sme_p2_en: e.target.value })}
                      placeholder="Second paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for SME P2 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.sme_p2_color}
                      onChange={(e) => setIntro({ ...intro, sme_p2_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.sme_p2_size}
                      onChange={(e) => setIntro({ ...intro, sme_p2_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.sme_p2_weight}
                      onChange={(e) => setIntro({ ...intro, sme_p2_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.sme_p2_family}
                      onChange={(e) => setIntro({ ...intro, sme_p2_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.sme_p2_color,
                        fontSize: `${intro.sme_p2_size}px`,
                        fontWeight: intro.sme_p2_weight,
                        fontFamily: intro.sme_p2_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 10/12: Citizen Title */}
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">10. Иргэн баян бол улс баян - Гарчиг</h4>
                <button
                  onClick={() => setIntro({ ...intro, citizen_title_visible: !intro.citizen_title_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.citizen_title_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.citizen_title_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн Citizen гарчгийн текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (Монгол)</label>
                    <input
                      type="text"
                      value={intro.citizen_title_mn}
                      onChange={(e) => setIntro({ ...intro, citizen_title_mn: e.target.value })}
                      placeholder="Гарчиг"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Гарчиг (English)</label>
                    <input
                      type="text"
                      value={intro.citizen_title_en}
                      onChange={(e) => setIntro({ ...intro, citizen_title_en: e.target.value })}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for Citizen Title */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-teal-100/40 rounded-lg p-3 border border-teal-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.citizen_title_color}
                      onChange={(e) => setIntro({ ...intro, citizen_title_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="16"
                      max="48"
                      value={intro.citizen_title_size}
                      onChange={(e) => setIntro({ ...intro, citizen_title_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.citizen_title_weight}
                      onChange={(e) => setIntro({ ...intro, citizen_title_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.citizen_title_family}
                      onChange={(e) => setIntro({ ...intro, citizen_title_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.citizen_title_color,
                        fontSize: `${intro.citizen_title_size}px`,
                        fontWeight: intro.citizen_title_weight,
                        fontFamily: intro.citizen_title_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 11/12: Citizen P1 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">11. Иргэн баян - Параграф 1</h4>
                <button
                  onClick={() => setIntro({ ...intro, citizen_p1_visible: !intro.citizen_p1_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.citizen_p1_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.citizen_p1_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн Citizen эхний параграфын текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (Монгол)</label>
                    <textarea
                      value={intro.citizen_p1_mn}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_mn: e.target.value })}
                      placeholder="Эхний догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 1 (English)</label>
                    <textarea
                      value={intro.citizen_p1_en}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_en: e.target.value })}
                      placeholder="First paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for Citizen P1 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.citizen_p1_color}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.citizen_p1_size}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.citizen_p1_weight}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.citizen_p1_family}
                      onChange={(e) => setIntro({ ...intro, citizen_p1_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.citizen_p1_color,
                        fontSize: `${intro.citizen_p1_size}px`,
                        fontWeight: intro.citizen_p1_weight,
                        fontFamily: intro.citizen_p1_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ХЭСЭГ 12/12: Citizen P2 */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">12. Иргэн баян - Параграф 2</h4>
                <button
                  onClick={() => setIntro({ ...intro, citizen_p2_visible: !intro.citizen_p2_visible })}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    intro.citizen_p2_visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  )}
                >
                  {intro.citizen_p2_visible ? ' Харагдана' : ' Нуугдсан'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Энэ хэсэг зөвхөн Citizen хоёрдугаар параграфын текст болон фонт тохиргоог засна</p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (Монгол)</label>
                    <textarea
                      value={intro.citizen_p2_mn}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_mn: e.target.value })}
                      placeholder="Хоёрдугаар догол мөр"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Параграф 2 (English)</label>
                    <textarea
                      value={intro.citizen_p2_en}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_en: e.target.value })}
                      placeholder="Second paragraph"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Font Controls for Citizen P2 */}
                <div className="grid md:grid-cols-4 gap-3 pt-2 pb-2 bg-blue-100/40 rounded-lg p-3 border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Өнгө</label>
                    <input
                      type="color"
                      value={intro.citizen_p2_color}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_color: e.target.value })}
                      className="w-full h-9 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={intro.citizen_p2_size}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_size: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Жин</label>
                    <select
                      value={intro.citizen_p2_weight}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_weight: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Фонт</label>
                    <select
                      value={intro.citizen_p2_family}
                      onChange={(e) => setIntro({ ...intro, citizen_p2_family: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                    >
                      <option value="inherit">Default</option>
                      <option value="'Arial', sans-serif">Arial</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Preview:</span>
                      <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={{
                        color: intro.citizen_p2_color,
                        fontSize: `${intro.citizen_p2_size}px`,
                        fontWeight: intro.citizen_p2_weight,
                        fontFamily: intro.citizen_p2_family,
                      }}>Aa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Болих
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSave()
                  handleCloseEditModal()
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Хадгалах
              </button>
            </div>
          </div>
        )}

        {editingSection === 'timeline' && (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Түүхэн замнал ({intro.timeline_events.length} үйл явдал)</h3>
              <button
                type="button"
                onClick={() => {
                  const newEvent = {
                    year: new Date().getFullYear().toString(),
                    year_color: '#0d9488',
                    title_mn: 'Шинэ үйл явдал',
                    title_en: 'New Event',
                    title_color: '#111827',
                    short_mn: 'Товч тайлбар',
                    short_en: 'Short description',
                    short_color: '#4b5563',
                    desc_mn: 'Дэлгэрэнгүй тайлбар',
                    desc_en: 'Detailed description',
                    desc_color: '#4b5563',
                    visible: true
                  }
                  setIntro({ ...intro, timeline_events: [...intro.timeline_events, newEvent] })
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Үйл явдал нэмэх
              </button>
            </div>

            <div className="space-y-4">
              {intro.timeline_events.map((event, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-teal-600">{index + 1}.</span>
                      <button
                        onClick={() => {
                          const updated = [...intro.timeline_events]
                          updated[index] = { ...updated[index], visible: !updated[index].visible }
                          setIntro({ ...intro, timeline_events: updated })
                        }}
                        className={clsx(
                          'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                          event.visible
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        )}
                      >
                        {event.visible ? ' Харагдана' : ' Нуугдсан'}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Энэ үйл явдлыг устгах уу?')) {
                          setIntro({ ...intro, timeline_events: intro.timeline_events.filter((_, i) => i !== index) })
                        }
                      }}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Устгах"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Year and Year Color */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Он
                        </label>
                        <input
                          type="text"
                          value={event.year}
                          onChange={(e) => {
                            const updated = [...intro.timeline_events]
                            updated[index] = { ...updated[index], year: e.target.value }
                            setIntro({ ...intro, timeline_events: updated })
                          }}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Оны өнгө
                        </label>
                        <input
                          type="color"
                          value={event.year_color || '#0d9488'}
                          onChange={(e) => {
                            const updated = [...intro.timeline_events]
                            updated[index] = { ...updated[index], year_color: e.target.value }
                            setIntro({ ...intro, timeline_events: updated })
                          }}
                          className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Title - Mongolian and English */}
                    <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-3">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Гарчиг</label>
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> Монгол</label>
                          <input
                            type="text"
                            value={event.title_mn || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], title_mn: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Үйл явдлын нэр (монголоор)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> English</label>
                          <input
                            type="text"
                            value={event.title_en || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], title_en: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Event name (in English)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Гарчгийн өнгө</label>
                          <input
                            type="color"
                            value={event.title_color || '#111827'}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], title_color: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Short Description - Mongolian and English */}
                    <div className="border border-green-200 bg-green-50/30 rounded-lg p-3">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Товч тайлбар</label>
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> Монгол</label>
                          <textarea
                            value={event.short_mn || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], short_mn: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Товч тайлбар (монголоор)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> English</label>
                          <textarea
                            value={event.short_en || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], short_en: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Short description (in English)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Товч тайлбарын өнгө</label>
                          <input
                            type="color"
                            value={event.short_color || '#4b5563'}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], short_color: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detailed Description - Mongolian and English */}
                    <div className="border border-purple-200 bg-purple-50/30 rounded-lg p-3">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Дэлгэрэнгүй тайлбар</label>
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> Монгол</label>
                          <textarea
                            value={event.desc_mn || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], desc_mn: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Дэлгэрэнгүй тайлбар (монголоор)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1"> English</label>
                          <textarea
                            value={event.desc_en || ''}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], desc_en: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Detailed description (in English)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Дэлгэрэнгүй тайлбарын өнгө</label>
                          <input
                            type="color"
                            value={event.desc_color || '#4b5563'}
                            onChange={(e) => {
                              const updated = [...intro.timeline_events]
                              updated[index] = { ...updated[index], desc_color: e.target.value }
                              setIntro({ ...intro, timeline_events: updated })
                            }}
                            className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-3 sticky bottom-0 bg-white pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Хаах
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSave()
                  handleCloseEditModal()
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Хадгалах
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
