import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: 'نکسوس (NEXUS) چیست و چه تفاوتی با پلتفرم‌های خارجی دارد؟',
    a: 'نکسوس یک پلتفرم ارتباطی بومی با سرورهای قدرتمند داخلی است که پینگ زیر ۲۰ میلی‌ثانیه، ارتباط بدون تحریم و قطعی، پشتیبانی کامل از چینش راست‌چین (RTL) و ابزارهای نوین اجتماعی مثل سیگنال رادار و مومنت‌ها را به رایگان در اختیار کاربران ایرانی قرار می‌دهد.',
  },
  {
    q: 'آیا برای استفاده از نکسوس نیاز به نصب نرم‌افزار خاصی است؟',
    a: 'خیر! نکسوس به عنوان یک وب‌اپلیکیشن پیشرو (PWA) طراحی شده و مستقیماً روی تمام مرورگرهای کامپیوتر و گوشی‌های هوشمند با سرعت و کیفیت حداکثری بدون نیاز به دانلود اجرا می‌شود.',
  },
  {
    q: 'رادار سیگنال (Nexus Signal) چگونه کار می‌کند؟',
    a: 'کافی است نیاز یا برنامه فعلی‌تان را (مثلاً تشکیل تیم کانتر، گفتگو پیرامون کدنویسی یا شنیدن موسیقی) به شکل یک سیگنال منتشر کنید؛ الگوریتم نکسوس در کسری از ثانیه شما را با سایر کاربران هم‌نیت متصل می‌کند.',
  },
  {
    q: 'آیا سرورهای صوتی و تصویری نکسوس امن و رایگان هستند؟',
    a: 'بله، تمامی ارتباطات در نکسوس با رمزنگاری مدرن محافظت می‌شوند و ایجاد سرور، کانال صوتی، اشتراک تصویر و شرکت در رویدادها کاملاً رایگان است.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden border-t border-white/10 select-none bg-[#05070e]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>راهنما و سوالات متداول</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-3">
            پرسش‌های متداول درباره{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              پلتفرم نکسوس
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            هر آنچه درباره نحوه فعالیت، امنیت، پینگ سرورها و ابزارهای ارتباطی نکسوس باید بدانید
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#090d18]/90 overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {faq.q}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* JSON-LD Structured Data script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};
