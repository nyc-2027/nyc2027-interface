'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { english } from '@/lib/english';

export type Locale = 'vi' | 'en';
const LocaleContext = createContext<Locale>('vi');

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale: Locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'vi';
  const previousNavigation = useRef({ pathname, locale });

  useLayoutEffect(() => {
    const isLanding = pathname === '/' || pathname === '/en';
    const languageChanged = previousNavigation.current.locale !== locale;
    const enteredLanding = isLanding && previousNavigation.current.pathname !== pathname;
    if (languageChanged || enteredLanding) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    previousNavigation.current = { pathname, locale };
  }, [locale, pathname]);

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  const t = (text: string) => locale === 'en' ? english[text] ?? text : text;
  const localPath = (path: string) => locale === 'en' && path.startsWith('/') && !path.startsWith('/en')
    ? `/en${path === '/' ? '' : path}` : path;
  return { locale, t, localPath };
}

export function LocalizedLink({ href, scroll, ...props }: ComponentProps<typeof NextLink>) {
  const { localPath } = useLocale();
  const destination = typeof href === 'string' ? localPath(href) : href;
  const isLanding = destination === '/' || destination === '/en';
  return <NextLink href={destination} scroll={isLanding ? false : scroll} {...props} />;
}

export function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const vietnamesePath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const englishPath = `/en${vietnamesePath === '/' ? '' : vietnamesePath}`;
  return (
    <nav className="language-switcher" aria-label={t('Ngôn ngữ')}>
      <NextLink href={vietnamesePath} scroll={false} lang="vi" aria-current={locale === 'vi' ? 'page' : undefined}>VI</NextLink>
      <span aria-hidden="true">/</span>
      <NextLink href={englishPath} scroll={false} lang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</NextLink>
    </nav>
  );
}
