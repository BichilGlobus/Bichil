"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white border-t mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold text-teal-600 tracking-tight hover:text-teal-700 transition">
              BichilGlobus
            </Link>

            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {t(
                'Таны бизнесийг дэлхийд холбох финтек шийдлүүд. Бид хурдан, найдвартай, ил тод үйлчилгээг эрхэмлэнэ.',
                'Fintech solutions connecting your business to the world. We prioritize fast, reliable, and transparent service.'
              )}
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mt-5">
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-teal-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.7l-.4 3h-2.3v7A10 10 0 0022 12z"/>
                </svg>
              </Link>

              <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-teal-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="18" height="18" x="3" y="3" rx="5" strokeWidth="2" />
                  <path strokeWidth="2" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </Link>

              <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-teal-600 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.1 1 5.4 5.4 0 002.4-3 10.9 10.9 0 01-3.4 1.3A5.4 5.4 0 0016.1 2a5.4 5.4 0 00-5.4 5.3c0 .4 0 .9.1 1.2-4.4-.2-8.3-2.3-10.9-5.5A5.4 5.4 0 002 9.3a5.2 5.2 0 01-2.4-.7v.1a5.4 5.4 0 004.3 5.3 5.4 5.4 0 01-2.4.1 5.4 5.4 0 005 3.7A10.9 10.9 0 010 19.5a15.3 15.3 0 008.3 2.4c10 0 15.5-8.1 15.5-15.1V5A11 11 0 0023 3z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">{t('Холбоосууд', 'Quick Links')}</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/about" className="hover:text-teal-600 transition">{t('Бидний тухай', 'About Us')}</Link>
              <Link href="/products" className="hover:text-teal-600 transition">{t('Бүтээгдэхүүн', 'Products')}</Link>
              <Link href="/services" className="hover:text-teal-600 transition">{t('Үйлчилгээ', 'Services')}</Link>
              <Link href="/news" className="hover:text-teal-600 transition">{t('Мэдээ мэдээлэл', 'News')}</Link>
              <Link href="/branches" className="hover:text-teal-600 transition">{t('Салбарууд', 'Branches')}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">{t('Холбоо барих', 'Contact Us')}</h3>
            <div className="text-sm text-gray-600 space-y-2">

              <p className="flex items-center gap-2">
                <span className="text-teal-600"></span>
                {t('Улаанбаатар хот', 'Ulaanbaatar City')}
              </p>

              <p className="flex items-center gap-2">
                <span className="text-teal-600"></span>
                info@bichilglobus.mn
              </p>

              <p className="flex items-center gap-2">
                <span className="text-teal-600"></span>
                +976 9999-9999
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} BichilGlobus. {t('Бүх эрх хуулиар хамгаалагдсан.', 'All rights reserved.')}
          </div>
        </div>
      </div>
    </footer>
  );
}
