'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

const shareholders = [
    {
        name: 'С.ОТГОНБАТ',
        role: 'ТӨЛӨӨЛӨН УДИРДАХ ЗӨВЛӨЛИЙН ДАРГА',
        desc: 'Самдан овогтой Отгонбат нь Монгол Улсын Их Сургуулийн Олон Улсын эдийн засгийн харилцааны магистр, АНУ-ын Аризона мужийн Их сургуульд Бизнесийн удирдлагын чиглэлээр тус тус суралцсан.\n\nТэрээр ажлын гараагаа 2006 онд "Оргил хотхон" ХХК-аас эхлэн улмаар 2008 онд бичил зээлийн бүтээгдэхүүн үйлчилгээг анхлан санаачлан, иргэдийн бичил зээлийн хэрэгцээг хангах зорилттойгоор "Бичил Глобус Групп" ХХК-ийг үүсгэн байгуулж, өнөөдрийг хүртэл компанийн ТУЗ-ийн дарга, Ерөнхий захирлаар ажиллаж байна.',
        image: '/img/huvitsaa.jpg'
    },
    {
        name: 'Б.ХҮРЭЛХҮҮ',
        role: 'ТӨЛӨӨЛӨН УДИРДАХ ЗӨВЛӨЛИЙН ГИШҮҮН',
        desc: 'Бямбаа овогтой Хүрэлхүү нь Монгол Улсын Их Сургуулийн Хууль Зүйн сургуулийн магистрын зэрэгтэй ба Номин Констракшн Девелопмент Группийн Гүйцэтгэх Захирлын албан тушаалтай. "Бичил Глобус Групп" ХХК-ийг үүсгэн байгуулагч ба Төлөөлөн удирдах зөвлөлийн гишүүнээр ажиллаж байна.',
        image: '/img/huvitsa2.jpg'
    }
];

const management = [
    {
        name: 'Н.ГАНТУЛГА',
        role: 'ГҮЙЦЭТГЭХ ЗАХИРАЛ',
        desc: 'Математик загварчлал, бизнесийн удирдлагын мэргэжилтэй, банк санхүүгийн салбарт 10 жилийн туршлагатай.\n\n2016–2024 онд менежер, салбарын эрхлэгч, Зээлийн газрын захирлаар ажиллаж, 2025 оноос гүйцэтгэх захирлын албан тушаалыг хашиж байна.',
        image: '/img/guitsetgehzahiral.jpg'
    },
    {
        name: 'Б.ОТГОНБИЛЭГ',
        role: 'ДОТООД АУДИТЫН ГАЗРЫН ЗАХИРАЛ',
        desc: 'Санхүү менежментийн мэргэжилтэй банк санхүүгийн салбарт дотоод аудитын чиглэлээр 10 жил ажилласан ажлын туршлагатай.',
        image: '/img/dotoodiinauditzahiral.jpg'
    },
    {
        name: 'Б.ДАВААБАТ',
        role: 'БИЗНЕС ХӨГЖЛИЙН ГАЗРЫН ЗАХИРАЛ',
        desc: 'Соёлын арга зүйч, брэнд менежер мэргэжилтэй, "Бичил глобус" санхүүгийн байгууллагад 2016 оноос хойш 10 жил банк санхүүгийн салбарт, маркетинг, брэнд чиглэлээр 15 жил ажилласан ажлын туршлагатай.',
        image: '/img/bizneshugjilzahiral.jpg'
    },
    {
        name: 'Б. ТАМИР',
        role: 'САНХҮҮ БҮРТГЭЛИЙН ГАЗРЫН ЗАХИРАЛ',
        desc: 'Нягтлан бодогч мэргэжилтэй. Бичил Глобус санхүүгийн байгууллагад 2014 оноос хойш, Банк санхүүгийн салбарт 15 жил ажилласан туршлагатай.',
        image: '/img/sanhuuburtgeliinzahiral.jpg'
    },
    {
        name: 'Б. АЛТАНСУВД',
        role: 'ЗЭЭЛИЙН ГАЗРЫН ЗАХИРАЛ',
        desc: 'Нягтлан бодох бүртгэлийн мэргэжилтэй, 2018 оноос эхлэн менежер, салбарын захирал, Зээлийн газрын захирлаар ажиллаж байгаа, 10 жил банк санхүүгийн салбарт ажилласан ажлын туршлагатай.',
        image: '/img/zeeliinzahiral.jpg'
    },
    {
        name: 'Д.ЭНХЧИМЭГ',
        role: 'ХӨРӨНГӨ ЗОХИЦУУЛАЛТЫН ГАЗРЫН АХЛАХ ШИНЖЭЭЧ',
        desc: 'Банкны эдийн засагч, нягтлаг бодох бүртгэлийн мэргэжилтэй, банк санхүүгийн салбарт эрсдэл, зээл, санхүүгийн чиглэлээр 15 жил ажилласан ажлын туршлагатай.',
        image: '/img/hurunguzohitsuulaltzahiral.jpg'
    },
    {
        name: 'П. ХОНГОРЗУЛ',
        role: 'ХҮНИЙ НӨӨЦИЙН ГАЗРЫН ЗАХИРАЛ',
        desc: 'Санхүүгийн удирдлагын бакалавр, бизнесийн удирдлагын магистр зэрэгтэй. Банк, санхүүгийн салбарт 17 жил ажилласан туршлагатай.',
        image: '/img/huniinuutsiinzahiral.jpg'
    },
    {
        name: 'О.БАТЖАРГАЛ',
        role: 'МЭДЭЭЛЭЛ ТЕХНОЛОГИЙН ГАЗРЫН ХӨГЖҮҮЛЭЛТИЙН ИНЖЕНЕР',
        desc: 'Банк санхүүгийн салбарт програм хөгжүүлэлтийн инженерээр 10 жил ажилласан ажлын туршлагатай.',
        image: '/img/ithugjuulegch.jpg'
    }
];

const branches = [
    {
        name: 'С.ЦЭРЭНДУЛАМ',
        location: 'УЛААНБААТАР',
        position: 'АВТО ХУДАЛДАА 22 САЛБАРЫН ЗАХИРАЛ',
        district: 'Чингэлтэй дүүрэг',
        image: '/img/sxdzahiral.jpg'
    },
    {
        name: 'У.ДАВААЖАРГАЛ',
        location: 'УЛААНБААТАР',
        position: 'БҮРД САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянгол дүүрэг',
        image: '/img/chingelteizahiral.jpg'
    },
    {
        name: 'Б. ЗОЛЗАЯА',
        location: 'УЛААНБААТАР',
        position: 'ТӨМӨР ЗАМ САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянгол дүүрэг',
        image: '/img/tumurzamzahiral.jpg'
    },
    {
        name: 'М.ОКТЯБРЬ',
        location: 'УЛААНБААТАР',
        position: 'ХОРООЛОЛ САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянгол дүүрэг',
        image: '/img/horoololzahiral.jpg'
    },
    {
        name: 'Х.ГАНХӨЛӨГ',
        location: 'УЛААНБААТАР',
        position: 'МОСКВА САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянгол дүүрэг',
        image: '/img/ganhulug.jpg'
    },
    {
        name: 'Д.УЯНГА',
        location: 'УЛААНБААТАР',
        position: 'ХАРХОРИН САЛБАРЫН ЗАХИРАЛ',
        district: 'Хан-Уул дүүрэг',
        image: '/img/harhorinzahiral.jpg'
    },
    {
        name: 'Э.ТӨРХҮҮ',
        location: 'УЛААНБААТАР',
        position: 'ДӨЧИН МЯНГАТ САЛБАРЫН ЗАХИРАЛ',
        district: 'Хан-Уул дүүрэг',
        image: '/img/duchinmyngatzahiral.jpg'
    },
    {
        name: 'Э.ШИНЭ-ОД',
        location: 'УЛААНБААТАР',
        position: 'РИВЕР ГАРДЕН САЛБАРЫН ЗАХИРАЛ',
        district: 'Хан-Уул дүүрэг',
        image: '/img/rivergardenzahiral.png'
    },
    {
        name: 'Д. ЦЭНД-АЮУШ',
        location: 'УЛААНБААТАР',
        position: 'ЯАРМАГ САЛБАРЫН ЗАХИРАЛ',
        district: 'Хан-Уул дүүрэг',
        image: '/img/yarmagzahiral.jpg'
    },
    {
        name: 'Б.ДОЛГОРСҮРЭН',
        location: 'УЛААНБААТАР',
        position: 'ПРЕМИУМ САЛБАРЫН ЗАХИРАЛ',
        district: 'Сүхбаатар дүүрэг',
        image: '/img/Premiumzahiral.png'
    },
    {
        name: 'Ж.ХУЛАН',
        location: 'УЛААНБААТАР',
        position: 'ПРОВАН САЛБАРЫН ЗАХИРАЛ',
        district: 'Сүхбаатар дүүрэг',
        image: '/img/Provanzahiral.png'
    },
    {
        name: 'А. АРИУНЗУЛ',
        location: 'УЛААНБААТАР',
        position: 'ДА ХҮРЭЭ САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянзүрх дүүрэг',
        image: '/img/Dahureezahiral.jpg'
    },
    {
        name: 'Х.ОКТЯБРЬТУЯА',
        location: 'УЛААНБААТАР',
        position: 'ЖОБИ-72 САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянзүрх дүүрэг',
        image: '/img/jobi-72zahiral.png'
    },
    {
        name: 'О.ЗОРИГТБААТАР',
        location: 'УЛААНБААТАР',
        position: 'НАРАН /ДА ХҮРЭЭ ДАХь/ САЛБАРЫН ЗАХИРАЛ',
        district: 'Баянзүрх дүүрэг',
        image: '/img/narandazahiral.png'
    }
];

const tabs = [
    { id: 'shareholders', label: 'Хувьцаа эзэмшигчид' },
    { id: 'management', label: 'Менежментийн баг' },
    { id: 'branches', label: 'Салбар' }
];

type Person = 
  | (typeof shareholders)[0]
  | (typeof management)[0]
  | (typeof branches)[0];

// Reusable PersonCard component
interface PersonCardProps {
  image: string;
  name: string;
  subtitle: string;
  onClick: () => void;
  priority?: boolean;
}

function PersonCard({ image, name, subtitle, onClick, priority = false }: PersonCardProps) {
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-colors duration-200 outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <div className="relative w-full aspect-[3/4] max-h-[220px] sm:max-h-none mb-3 sm:mb-4 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top"
          onError={(e) => {
            e.currentTarget.src = '/img/avatar-placeholder.png';
          }}
        />
      </div>

      <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 transition-colors">
        {name}
      </h3>

      <p className="hidden sm:block text-[11px] text-gray-500 uppercase tracking-widest mt-2">
        {subtitle}
      </p>
    </div>
  );
}

function ShareholdersGrid({ onSelect }: { onSelect: (person: typeof shareholders[0]) => void }) {
  return (
    <>
      <h3 className="sr-only">Хувьцаа эзэмшигчид</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {shareholders.map((person, idx) => (
          <PersonCard
            key={idx}
            image={person.image}
            name={person.name}
            subtitle={person.role}
            onClick={() => onSelect(person)}
            priority={idx === 0}
          />
        ))}
      </div>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-24 text-center text-gray-500">
        <p className="text-sm">{text}</p>
    </div>
  );
}

function ManagementGrid({ onSelect }: { onSelect: (person: typeof management[0]) => void }) {
  return (
    <>
      <h3 className="sr-only">Менежментийн баг</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {management.map((person, idx) => (
          <PersonCard
            key={idx}
            image={person.image}
            name={person.name}
            subtitle={person.role}
            onClick={() => onSelect(person)}
            priority={idx === 0}
          />
        ))}
      </div>
    </>
  );
}

function BranchesGrid({ onSelect }: { onSelect: (person: typeof branches[0]) => void }) {
  return (
    <>
      <h3 className="sr-only">Салбар</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {branches.map((branch, idx) => (
          <PersonCard
            key={idx}
            image={branch.image}
            name={branch.name}
            subtitle={branch.position}
            onClick={() => onSelect(branch)}
            priority={idx === 0}
          />
        ))}
      </div>
    </>
  );
}

export default function GovernanceTab() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'shareholders';
  
  const [activeSubTab, setActiveSubTab] = useState(tabParam);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // 3) Body scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedPerson ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPerson]);

  // 2) ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPerson(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4) Content map for scalability
  const contentMap: Record<string, React.ReactNode> = {
    shareholders: <ShareholdersGrid onSelect={setSelectedPerson} />,
    management: <ManagementGrid onSelect={setSelectedPerson} />,
    branches: <BranchesGrid onSelect={setSelectedPerson} />
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="sr-only">Компанийн засаглал</h2>
      
       {/* Minimal Sub-navigation (Tabs) */}
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-12">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={clsx(
                        "pb-3 text-sm font-medium transition-colors duration-200 outline-none focus:ring-offset-2 focus:ring-2 focus:ring-teal-500",
                        activeSubTab === tab.id
                            ? "text-teal-600 border-b-2 border-teal-600"
                            : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>

       {/* Content Area */}
       <div>
            {contentMap[activeSubTab]}
       </div>

       {/* Minimal Modal */}
       {selectedPerson && (
           <div 
             className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-0 sm:items-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
             onClick={() => setSelectedPerson(null)}
             role="dialog"
             aria-modal="true"
             aria-labelledby="modal-title"
           >
               <div 
                 className="bg-white w-full max-w-4xl rounded-2xl p-8 relative shadow-2xl"
                 onClick={(e) => e.stopPropagation()}
               >
                   {/* Close Button */}
                   <button 
                     onClick={() => setSelectedPerson(null)}
                     aria-label="Хаах"
                     className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-teal-500"
                   >
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                   </button>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                        
                        {/* Image Side */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={selectedPerson.image}
                                    alt={selectedPerson.name}
                                    fill
                                    className="object-cover object-top"
                                    onError={(e) => {
                                      e.currentTarget.src = '/img/avatar-placeholder.png';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-2/3 flex flex-col justify-start">
                            <h3 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                                {selectedPerson.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-teal-600 uppercase tracking-wide mt-1 mb-4 sm:mb-6 md:mb-8">
                                {'role' in selectedPerson ? selectedPerson.role : selectedPerson.position}
                            </p>
                            
                            {'desc' in selectedPerson && (
                              <div className="space-y-3 sm:space-y-4 md:space-y-5 text-gray-600 leading-6 sm:leading-7 md:leading-7 text-xs sm:text-sm">
                                  {selectedPerson.desc.split('\n\n').map((paragraph: string, i: number) => (
                                      <p key={i}>{paragraph}</p>
                                  ))}
                              </div>
                            )}
                        </div>

                    </div>
               </div>
           </div>
       )}

    </div>
  );
}