'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('common');
  
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-6 border-t border-white/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center font-bold text-lg">M</div>
            <span className="font-bold text-xl">{t('title').split(' - ')[0]}</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs transition-opacity hover:opacity-80">
            {t('description')}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">الخدمات</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/services" className="hover:text-primary-400 transition-colors">إصدار رخصة جديدة</Link></li>
            <li><Link href="/services" className="hover:text-primary-400 transition-colors">تجديد رخصة</Link></li>
            <li><Link href="/services" className="hover:text-primary-400 transition-colors">بدل فاقد/تالف</Link></li>
            <li><Link href="/services" className="hover:text-primary-400 transition-colors">ترقية فئة الرخصة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">المنصة</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-primary-400 transition-colors">عن مُجاز</Link></li>
            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">اتصل بنا</Link></li>
            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">سياسة الخصوصية</Link></li>
            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">الشروط والأحكام</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">تواصل معنا</h4>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 transition-all cursor-pointer">
              X
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 transition-all cursor-pointer">
              FB
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 transition-all cursor-pointer">
              IN
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs">
        <p>© {new Date().getFullYear()} {t('title').split(' - ')[0]}. جميع الحقوق محفوظة لوزارة الداخلية.</p>
      </div>
    </footer>
  );
}
