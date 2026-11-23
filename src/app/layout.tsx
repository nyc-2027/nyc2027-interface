import type { Metadata } from 'next';
import '@fontsource/lora/400.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import './globals.css';
import { LocaleProvider } from '@/components/locale-provider';

export const metadata: Metadata = {
  icons: { icon: '/images/nyc2027-emblem.png', apple: '/images/nyc2027-emblem.png' },
  title: 'NYC 2027 · Ninh Bình — Leading for Impact',
  description: 'New Year Convention 2027 của JCI Vietnam. Khám phá lịch trình và đăng ký combo, lưu trú, di chuyển, tour tại Ninh Bình, 15–17.01.2027.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
