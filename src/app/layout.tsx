import type { Metadata } from 'next';
import '@fontsource/lora/400.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import './globals.css';
import './immersive.css';
import { LocaleProvider } from '@/components/locale-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://nyc2027.jci.vn'),
  openGraph: {
    type: 'website',
    siteName: 'NYC 2027 · JCI Vietnam',
    title: '2027 JCI Vietnam New Year Convention · Ninh Bình',
    description: '15–17.01.2027 · Wyndham Grand Vedana Ninh Bình. Leading for Impact.',
    locale: 'vi_VN',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/images/logo_LFI.png', apple: '/images/logo_LFI.png' },
  title: '2027 JCI Vietnam Newyear Convention · Ninh Bình',
  description: 'New Year Convention 2027 của JCI Vietnam. Khám phá lịch trình và đăng ký combo, lưu trú, di chuyển, tour tại Ninh Bình, 15–17.01.2027.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
