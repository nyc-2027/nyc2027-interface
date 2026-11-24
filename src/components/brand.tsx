'use client';

import { LocalizedLink, useLocale } from './locale-provider';

export default function Brand({ href = '/', variant = 'event' }: { href?: string; variant?: 'event' | 'lfi' }) {
  const { t } = useLocale();

  return (
    <LocalizedLink href={href} className={`brand identity ${variant === 'lfi' ? 'brand-lfi' : ''}`} aria-label={t('Về trang sự kiện NYC 2027')}>
      <img className="brand-emblem" src={variant === 'lfi' ? '/images/logo_LFI.png' : '/images/nyc2027-emblem.png'} alt={variant === 'lfi' ? 'Leading for Impact' : ''} width={variant === 'lfi' ? 2519 : 1280} height={variant === 'lfi' ? 2700 : 1280} />
      <span className="brand-caption">
        <strong>NYC <span>2027</span></strong>
        <small>NEW YEAR<br />CONVENTION</small>
      </span>
    </LocalizedLink>
  );
}
