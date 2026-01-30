'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

// Reusable IntersectionObserver hook for animations
function useInViewAnimation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold: 0.35,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const historyEvents = [
  { 
    year: '2008', 
    title: 'АВТОМАШИН БАРЬЦААТ ЗЭЭЛ', 
    short: 'Монголд анх удаа банкны шалгуурт тэнцэхгүй иргэдэд зориулсан шийдэл болох автомашин барьцаалсан зээлийн үйлчилгээг нэвтрүүлсэн.',
    desc: 'Энэхүү барьцаагүй зээлийн үйлчилгээг 2008 оны 8-р сарын 8-ны өдрөөс анх олгож эхэлсэн бөгөөд 2009 онд уг зээлийн үйлчилгээ маань хүчин төгөлдөр болж, харилцагчдадаа зээлийн үйлчилгээ олгож эхэлсэн. Анх автомашин барьцаалан банкны шалгуурт тэнцэхгүй байгаа иргэдийн нийгмийн чиг хандлагыг өөрчлөхөд хувь нэмэр оруулах үүднээс "Автомашин барьцаагүй зээл"-ийг нэвтрүүлэн хэрэглэгчдээ татаж эхэлсэн.' 
  },
  { 
    year: '2009', 
    title: 'АВТОМАШИН УНАХ НӨХЦӨЛТ ЗЭЭЛ', 
    short: 'Автомашиныг барьцаалахдаа унах нөхцөлтэй зээлийг санал болгосон анхны санхүүгийн байгууллага болсон.',
    desc: 'Бүтээгдэхүүнээ иргэдэд санал болгохын хажуугаар өрсөлдөгчид улам нэмэгдсээр зах зээлээ алдаж эхэлсэн энэ үед удирдах зөвлөл маш том шийдвэрийг гаргаж ажиллахаар болсон. Энэ нь та бидний одоогийн сайн мэдэх автомашиныг барьцаалахдаа унах нөхцөлтэй зээлийг санал болгох эрсдэлтэй шийдвэрийг гаргасан анхны санхүүгийн байгууллага. Энэ үеэс эхлэн зах зээл дээр байр сууриа бат барьж иргэдийнхээ санхүүгийн тулгамдсан хэрэгцээг шийдвэрлэж банкнаас татгалзаад байгаа иргэдийг улам их дэмжин ажиллаж байсан. Мөн түүнчлэн шинэ бүтээгдэхүүн болох 9911-тэй дугаарт анхны зээлийг олгож эхэлсэн.' 
  },
  { 
    year: '2011', 
    title: 'ХӨРӨНГӨ ОРУУЛАЛТ ТАТСАН', 
    short: 'Австрали улсаас 1 сая долларын хөрөнгө оруулалтыг татаж, зах зээлийн дундаж хүүг бууруулах боломжийг бүрдүүлсэн.',
    desc: 'Санхүүгийн хүртээмжийг нэмэгдүүлэхийн хэрээр олон улстай түнш байгууллага тогтоон Австрали улсаас 1 сая долларын хөрөнгө оруулалтыг оруулж эхэлсэн. Энэ нь бидний хувьд маш том гарц маш том өөрчлөлтийг дахин авчирсан. Зах зээл дээр байгаа дундаж хүүг эргэлтийн хөрөнгө оруулалтаар буулгаж ажиллагсад болон зээлийн иргэдийнхээ төлөлт болоод цалингийн асуудал дээр анхаарч ажилласан.' 
  },
  { 
    year: '2012', 
    title: 'САЛБАР НЭГЖИЙН ӨРГӨЖИЛТ', 
    short: 'Орон нутагт 10 салбар, нийслэлд 8 салбар, 150 гаруй ажиллагсадтайгаар үйл ажиллагаагаа өргөжүүлэв.',
    desc: '2009-2012 он бидний хувьд санхүүгийн хүртээмжийг иргэдэд илүү ойртуулахын төлөө хичээн, орон нутагт 10 салбар, нийслэлд 8 салбар, 150 гаруй ажиллагсадтайгаар үйл ажиллагаагаа явуулж, иргэдийн тулгамдаж буй санхүүгийн асуудлыг хурдан шийдвэрлэж ажилласан он жил байсан юм.' 
  },
  { 
    year: '2015', 
    title: 'ҮЙЛ АЖИЛЛАГААГАА ӨРГӨТГӨСӨН', 
    short: 'ББСБ-ын статустай болж, зээлийн хүү болон шимтгэлийг бууруулан, шимтгэлийг 0% болгож харилцагчдадаа бэлэг барьсан.',
    desc: 'Зээлийн бүтээгдэхүүнийг нэмэгдэхийн хирээр иргэдийнхээ зээлжих боломжийг харилцагчдынхаа амьдралын өөрчлөлтөд өөрчлөлт оруулахын тулд Санхүүгийн зохицуулах хороотой хамтран ажилласны үр дүнд Монголын банк бус санхүүгийн байгууллагын нэр томъеог аван иргэдийнхээ зээлийн бүтээгдэхүүн дээр хүүний болоод шимтгэлийн хувьд асар том өөрчлөлтийг оруулж харилцагчдадаа бэлэг барьсан. Шимтгэлийг 0% болгож хүүг банк бусийн журмын дагуу өөрчлөлт оруулж ажилласны хэрээр зээл авах хугацаа дагаад уртассан сайхан мэдээг харилцагчид таатай хүлээж аван итгэлцлийн холбоо улам батжиж бид 30,000 гаруй итгэл нь дүүрсэн харилцагчидтай болж чадсан.' 
  },
  { 
    year: '2017', 
    title: 'NISSAN LEAF ЦАХИЛГААН МАШИН', 
    short: 'Эко зээлийг нэвтрүүлж, Ниссан маркийн цахилгаан автомашиныг Монголын нөхцөлд туршин нэвтрүүлсэн.',
    desc: 'Ниссан маркийн 4 цахилгаан автомашиныг Монголын уур амьсгалд тохиромжтой эсэхийг нэг жилийн хугацаанд туршин, олон нийтэд таниулсан. Мөн эко зээлийг нэвтрүүлсэн анхны санхүүгийн байгууллага болсон юм.' 
  },
  { 
    year: '2018', 
    title: 'СОНО ФИНТЕК ТӨСӨЛ', 
    short: 'Технологийн дэвшилд суурилсан "Соно Монголиа" зээлийн аппликэйшнийг амжилттай нэвтрүүлэн зах зээлд гаргасан.',
    desc: 'Монголын зах зээл дээр технологийн дэвшилтэд хурдыг ашиглах зорилгоор фентик зах зээлрүү орон Монгол улсдаа удаах компани болж Соно Монголиа зээлийн аппликэйшнийг амжилттай нэвтрүүлэн ажиллаж чадсан.' 
  },
  { 
    year: '2019', 
    title: 'ТӨГРӨГ МАТ - ЗЭЭЛИЙН АТМ', 
    short: 'Банкны АТМ ойлголтыг эвдэж, зээл олгодог Т-мат төслийг амжилттай эхлүүлсэн.',
    desc: 'Монголын зах зээл дээр Банкны АТМ гэх нэршил томьёог эвдэж чадсан Т-мат зээлийн АТМ ын төслийг эхлүүлсэн.' 
  },
  { 
    year: '2020', 
    title: 'АНУ ДАХЬ САЛБАР & ӨРГӨЖИЛТ', 
    short: 'АНУ-ын Лос Анжелес хотод шинэ салбар нээх төсөл болон дотоодын Төгрөг Мат сүлжээг эрчимтэй тэлсэн.',
    desc: 'Бид бичил санхүүгийн зах зээл дээрээс анхны салбар болох Чикаго хотод Моннимакс нэршлээр нээгээд удаагүй ч бидний гадны хөрөнгийг Монголын зах зээл дээр оруулж ирэх зорилгодоо хөтлөгдөн дахин нэг салбарыг Лос анджелес мужид нээхээр ажиллаад байна. Мөн Т-мат зээлийн АТМ-ыг маш амжилттай нэврүүлж, орон нутаг Улаанбаатар хот нийлээд 50 гаруй АТМ-ээр дамжуулан үйлчилгээ үзүүлж байна.' 
  },
  { 
    year: '2020', 
    title: 'ОЛОН УЛСЫН ТӨСӨЛ - ФИЛИППИН', 
    short: 'Филиппин улсад зээлийн АТМ сүлжээг нэвтрүүлж, гадны хөрөнгө оруулалт татах төслийг эхлүүлсэн.',
    desc: 'Төгрөг Мат буюу зээлийн АТМ ийн сүлжээг тэлэх зорилготой мөн гадны хөрөнгийг Монголын эдийн засагт дэмжлэг болгох гүүрэн гарц хэмээн нэрийдэж удаах сүлжээ улсаа Филиппин улсыг сонгон төслийн ажилдаа орсон.' 
  },
  { 
    year: '2021', 
    title: 'ХӨРӨНГӨ ОРУУЛАЛТ ТАТСАН', 
    short: '12 тэрбум төгрөгийн хөрөнгө оруулалтыг амжилттай босгож, үйл ажиллагаагаа дахин шат ахиулсан.',
    desc: '12 тэрбум төгрөгийн хөрөнгө оруулалтын амжилттай босгож чадсан.' 
  }
];

export default function IntroTab() {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(new Set());
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());
  const [timelineTitleRevealed, setTimelineTitleRevealed] = useState(false);
  const whatWeDo = useInViewAnimation();
  const smeSection = useInViewAnimation();
  const citizenSection = useInViewAnimation();
  const timelineTitle = useInViewAnimation();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver for timeline items (viewport band reveal)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible: number[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            newlyVisible.push(index);
          }
        });

        if (newlyVisible.length) {
          setActiveIndex(newlyVisible[newlyVisible.length - 1]);

          setRevealedIndexes(prev => {
            const next = new Set(prev);
            newlyVisible.forEach(i => next.add(i));
            return next;
          });
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1,
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const isTimelineEnd = activeIndex !== null && activeIndex >= historyEvents.length - 2;

  // Track SME and Citizen section reveals (one-time animation)
  useEffect(() => {
    if (smeSection.visible && !revealedSections.has('sme')) {
      setRevealedSections(prev => {
        const next = new Set(prev);
        next.add('sme');
        return next;
      });
    }
  }, [smeSection.visible, revealedSections]);

  useEffect(() => {
    if (citizenSection.visible && !revealedSections.has('citizen')) {
      setRevealedSections(prev => {
        const next = new Set(prev);
        next.add('citizen');
        return next;
      });
    }
  }, [citizenSection.visible, revealedSections]);

  useEffect(() => {
    if (whatWeDo.visible && !revealedSections.has('whatWeDo')) {
      setRevealedSections(prev => {
        const next = new Set(prev);
        next.add('whatWeDo');
        return next;
      });
    }
  }, [whatWeDo.visible, revealedSections]);

  useEffect(() => {
    if (timelineTitle.visible && !timelineTitleRevealed) {
      setTimelineTitleRevealed(true);
    }
  }, [timelineTitle.visible, timelineTitleRevealed]);

  const toggleYear = (index: number) => {
    setExpandedYear(expandedYear === index ? null : index);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Origin Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6"> 
          <div className="inline-block bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium">
             Бидний түүх
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            Анх санхүүгийн зах зээлд <span className="text-teal-600">Бичил Глобус ХХК</span>-г үүсгэн байгуулах болсон шалтгаан
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-lg text-justify">
            <p>
                2008 онд Банк санхүүгийн салбаруудад бичил зээлийн бүтээгдэхүүн гэж байхгүй байсан ба зээлийн үйлчилгээ нь дунд түвшиний амжиргаатай иргэдэд чиглэсэн зээлийн үйлчилгээнүүд түлхүү байдаг байсан. Мөн бичил зээлийн төвүүдийн тоо маш цөөхөн байсан. Энэ үед өрхийн зээл гэж байгаагүй.
            </p>
            <p>
                Наймаачдад ашиг орлоготой, эх үүсвэр эргэлтийн хөрөнгөө нэмэгдүүлье гэхэд Банкны зээлийн шаардлагад тэнцэхгүй тогтвортой орлогогүй, барьцаагүй учир зээл авах боломжгүй байсан. Зарим нэг ББСБ болон Банкны зүгээс тогтмол орлоготой иргэдэд зээлийн үйлчилгээг санал болгодог тул наймаачид зээл огт авч чаддаггүй байсан.
            </p>
             <p className="font-semibold text-teal-800">
                Энэхүү зах зээлийг олж хараад эдгээр хүмүүст яагаад зээл олгож болохгүй гэж санхүүгийн үйлчилгээг хүргэж болохгүй гэсэн санаа гараад үүний дагуу анх барьцаагүй зээлийн үйлчилгээг иргэдэд олгож ирсэн.
            </p>
          </div>
        </div>
        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/images/news5.jpg" 
            alt="About Us"
            fill
            className="object-cover"
          />
        </div>
      </div>

       {/* What We Do Section */}
       <div 
         ref={whatWeDo.ref}
         className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
           ${revealedSections.has('whatWeDo')
             ? 'opacity-100 translate-y-0'
             : 'opacity-0 translate-y-12'}
         `}
       >
           <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </span>
               Юу хийдэг вэ?
           </h3>
           <p className="text-gray-600 leading-relaxed text-justify">
               Манай нийт харилцагчдын дийлэнх хувийг жижиг дунд бизнес эрхлэгчид болон хувиараа хөдөлмөр эрхлэгчид эзэлдэг. Эдгээр иргэд нь нийгмийн даатгалын хураамж тогтмол төлдөггүй, банкны дансны хуулгаар орлогоо баталгаажуулах боломжгүй зэрэг шалтгаанаас улбаалан банкны зээлийн үйлчилгээг төдийлөн авч чаддаггүй юм. Харин бид тус нийгмийн бүлгүүдийн санхүүгийн чадамж, хэрэгцээ, шаардлагад нийцсэн 5 төрлийн зээлийн бүтээгдэхүүнийг санал болгон ажиллаж байна.
           </p>
       </div>

       {/* SME and Citizen Wealth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* SME */}
            <div 
              ref={smeSection.ref}
              className={`space-y-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${revealedSections.has('sme')
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'}
              `}
            >
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 pb-2 inline-block">Жижгээс дунд, дундаас томд</h3>
                <div className="text-gray-600 text-justify leading-relaxed space-y-4">
                    <p>Аль ч улс орон, цаг үед жижиг дунд бизнесүүд эдийн засгийг хөдөлгөгч гол хүч байдаг. Энэ утгаараа бид жижиг дунд бизнес эрхлэгчдийн эрэлт хэрэгцээнд нийцүүлэн бизнесийн зориулалттай зээлийн үйлчилгээг байгуулагдсан цагаасаа хойш голлон үзүүлж ирсэн.</p>
                    <p>Өнөөдрийн байдлаар “Бичил Глобус” Санхүүгийн нэгдэлд бүртгэлтэй нийт харилцагчдын 40 орчим хувийг жижиг дунд бизнес эрхлэгчид эзэлж байна. Үүнд худалдаа, үйлдвэрлэл, үйлчилгээ, барилгын салбарынхан зонхилдог. Улс төр, эдийн засгийн орчны өөрчлөлт, улирлын болон бизнесийн онцлогоос шалтгаалан аль ч бизнест санхүүгээ зөв удирдах, зөв цагт нь зөв хөрөнгө оруулалт хийх шаардлага тулгардаг. Бидний хувьд харилцагчдадаа хэрэгцээт зээлийн үйлчилгээг үзүүлэхээс гадна тухайн бизнесийн болон салбарын онцлогт тохируулан санхүүгийн зөвлөх үйлчилгээг үзүүлж харилцагчийн амжилтыг байгууллага, хамт олны амжилт болгон ажиллаж байна.</p>
                </div>
            </div>
             {/* Citizen Wealth */}
            <div 
              ref={citizenSection.ref}
              className={`space-y-4 transition-all duration-900 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${revealedSections.has('citizen')
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'}
              `}
            >
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 pb-2 inline-block">Иргэн баян бол улс баян</h3>
                 <div className="text-gray-600 text-justify leading-relaxed space-y-4">
                    <p>Зээлийн үйлчилгээ бол иргэдийг эдийн засгийн амьдралд идэвхтэй оролцох боломжийг олгож өгдөг. Эдийн засгийн идэвхтэй иргэнд ая тухтай амьдралыг бий болгож, амьжиргааны түвшингөө сайжруулах, цаашлаад нийгэмд баялгийг бүтээх нөхцөл бүрдэнэ. Өнгөрсөн 10 жилийн хугацаанд давхардсан тоогоор хот, хөдөөгийн 37,900 орчим өрхөд зээлийн үйлчилгээг шуурхай хүргэж үйлчилсэн байна. 2018 оны жилийн эцсийн байдлаар нийт зээлийн багцын 60%-ийг өрхийн санхүүжилтийн зориулалттай зээл эзэлж байна.</p>
                    <p>Үүнд, сургалтын төлбөр, тавилга, эд хогшил худалдан авах, засвар хийх гэх мэтчилэн өнөөгийн нийгэмд айл өрхөд шаардлагатай бүхий л санхүүгийн хэрэгцээг бид шийдвэрлэн өгдөг. Мөн сүүлийн 2 жилд бид “Автомашинжуулах аян”-г зарлаж автомашин худалдан авах лизингийн зээлийн үйлчилгээг иргэдэд идэвхтэй олгож эхэлсэн. Энэхүү зээлийн үйлчилгээ нь нийт зээлийн багцын 30%-г эзэлж байна. Бусад зээлийн үйлчилгээнүүдтэй харьцуулахад өндөр дүнтэйд тооцогддог бөгөөд охин компани болох "Эко Кар Центр" ХХК-тай харилцан хамтран ажилладаг.</p>
                </div>
            </div>
        </div>


        {/* Timeline Section */}
        <div ref={timelineRef} className="py-12 relative overflow-hidden">
            <h3 
              ref={timelineTitle.ref}
              className={`text-3xl font-bold text-center mb-16
                transition-all duration-600 ease-out
                ${timelineTitleRevealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'}
              `}
            >
              Түүхэн замнал
            </h3>
            
            {/* Vertical Line */}
            <div className="absolute left-[27px] md:left-1/2 top-32 bottom-12 w-0.5 bg-teal-200 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
                {historyEvents.map((event, index) => {
                     const isExpanded = expandedYear === index;
                     const isEven = index % 2 === 0;

                     // Content Card Component
                     const ContentCard = (
                        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative z-10">
                            <div className="md:hidden flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-teal-600">{event.year}</span>
                                <div className="h-px bg-teal-100 flex-1"></div>
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{event.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {event.short}
                            </p>
                            
                            <div className={clsx(
                                "grid transition-all duration-300 ease-in-out",
                                isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                            )}>
                                <div className="overflow-hidden min-h-0">
                                    <div className="pt-4 border-t border-gray-100 text-gray-600 text-sm leading-relaxed text-justify">
                                        {event.desc}
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
                     );

                     return (
                        <div 
                          key={index}
                          ref={(el) => (itemRefs.current[index] = el)}
                          data-index={index}
                          className={clsx(
                            "relative flex flex-col md:flex-row items-center md:items-start group",
                            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            revealedIndexes.has(index)
                              ? "opacity-100 translate-x-0"
                              : isEven
                                ? "opacity-0 -translate-x-8"
                                : "opacity-0 translate-x-8",
                            activeIndex === index && "z-10"
                          )}
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
                                         <span className={clsx(
                                           "text-5xl font-bold sticky top-32 transition-colors duration-300",
                                           activeIndex === index ? "text-teal-600" : "text-teal-300"
                                         )}>
                                           {event.year}
                                         </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Side (Desktop) */}
                            <div className="hidden md:block w-full md:w-1/2 md:pl-12 text-left">
                                 {/* Desktop: Show Year if Even, Card if Odd */}
                                 {isEven ? (
                                      <span className={clsx(
                                        "text-5xl font-bold sticky top-32 transition-colors duration-300",
                                        activeIndex === index ? "text-teal-600" : "text-teal-300"
                                      )}>
                                        {event.year}
                                      </span>
                                 ) : ContentCard}
                            </div>
                        </div>
                     );
                })}
            </div>

            {/* Bottom Blur Overlay */}
            <div
              className={clsx(
                "pointer-events-none absolute bottom-0 left-0 w-full h-32 transition-all duration-700",
                isTimelineEnd
                  ? "backdrop-blur-0 opacity-0"
                  : "backdrop-blur-sm opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
        </div>

    </div>
  );
}