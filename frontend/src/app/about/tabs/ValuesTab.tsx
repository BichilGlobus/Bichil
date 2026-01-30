'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Reusable IntersectionObserver hook for animations
function useInViewAnimation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const values = [
  {
      icon: (
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
      ),
      title: 'Эрсдэлгүй ирээдүй',
      desc: 'Гадаад болон дотоод хүчин зүйлээс шалтгаалсан эрсдэлийг тооцоолж, эрсдэлийн удирдлагыг сайжруулна.'
  },
  {
      icon: (
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
      ),
      title: 'Хамтын өгөөж',
      desc: 'Хувьцаа эзэмшигчдийн эрх ашгийг дээдэлж, харилцагч болон түншүүддээ харилцан үр өгөөжтэй бизнесийн сонгодог загварыг хэрэгжүүлнэ.'
  },
  {
      icon: (
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
      ),
      title: 'Нэгдмэл зорилго',
      desc: 'Байгууллагын хэтийн зорилго, ажилтны хүсэл тэмүүллийн нэгдлийг тэнцвэржүүлэн ажиллана.'
  },
  {
      icon: (
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
      ),
      title: 'Ёс зүй, итгэл',
      desc: 'Санхүүгийн салбарын ёс зүйн хэм хэмжээг баримтлан, харилцагчийн итгэл, нууцлалын аюулгүй байдлыг хангаж ажиллана.'
  },
  {
      icon: (
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
      ),
      title: 'Харилцагчийн хөгжил',
      desc: 'Харилцагчийн хөгжил нь байгууллагын бизнес хөгжлийн салшгүй хэсэг байж, харилцан үнэ цэнийг нэмэгдүүлнэ.'
  }
];

export default function ValuesTab() {
  const vision = useInViewAnimation();
  const mission = useInViewAnimation();
  const valuesSection = useInViewAnimation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
        
        {/* 1. VISION */}
        <section 
          ref={vision.ref}
          className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform will-change-opacity
            ${vision.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
          `}
        >
            <div className="space-y-6">
                <span className="text-sm font-semibold tracking-wider text-teal-600 uppercase">
                    Алсын хараа
                </span>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    Харилцагчийн хөгжлийг бизнесийн үнэ цэн болгосон хамт олон бүхий, <span className="text-teal-600">зохистой засаглалтай хүчирхэг нэгдэл байна.</span>
                </h2>
            </div>
            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-gray-100">
                <Image
                    src="/images/news1.jpg" 
                    alt="Vision"
                    fill
                    className={`object-cover transition-transform duration-1000 ease-out
                      ${vision.visible ? 'scale-100' : 'scale-105'}
                    `}
                />
            </div>
        </section>

        {/* Divider */}
        <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* 2. MISSION */}
        <section 
          ref={mission.ref}
          className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform will-change-opacity
            ${mission.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
          `}
        >
             <div className="order-2 md:order-1 relative h-[360px] w-full overflow-hidden rounded-2xl border border-gray-100">
                 <Image
                    src="/images/news2.jpg" 
                    alt="Mission"
                    fill
                    className={`object-cover transition-transform duration-1000 ease-out
                      ${mission.visible ? 'scale-100' : 'scale-105'}
                    `}
                />
            </div>

            <div className="order-1 md:order-2 space-y-6">
                 <span className="text-sm font-semibold tracking-wider text-teal-600 uppercase">
                    Эрхэм зорилго
                </span>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    Санхүүгийн салбарт шаталсан хэлбэрээр хөгжиж, дэмжих бизнесийг өргөжүүлэн, <span className="text-teal-600">дэлхийн баялгийг Монгол улсдаа бий болгох</span> эх оронч хүчирхэг нэгдэл байна.
                </h2>
            </div>
        </section>

        {/* 3. CORE VALUES */}
        <section
          ref={valuesSection.ref}
          className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform will-change-opacity
            ${valuesSection.visible
              ? 'motion-safe:opacity-100 motion-safe:translate-y-0 motion-reduce:opacity-100'
              : 'motion-safe:opacity-0 motion-safe:translate-y-10 motion-reduce:opacity-0'}
          `}
        >
             <div className="max-w-3xl mb-16">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4 font-serif">Бидний үнэт зүйлс</h2>
                <div className="w-12 h-px bg-gray-300 mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                    <div 
                        key={index}
                        role="article"
                        aria-label={value.title}
                        className={`bg-white border border-gray-200 rounded-lg p-6
                          transition-all duration-1000 sm:duration-700
                          hover:border-gray-300 hover:bg-gray-50
                          ${valuesSection.visible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-6'}
                        `}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <h3 className="text-base font-semibold text-gray-600 mb-1">
                          {value.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {value.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>

    </div>
  );
}