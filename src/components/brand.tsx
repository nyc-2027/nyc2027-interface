'use client';

import { LocalizedLink, useLocale } from './locale-provider';

export default function Brand({ href = '/' }: { href?: string }) {
  const { t } = useLocale();

  return (
    <LocalizedLink href={href} className="brand identity" aria-label={t('Về trang sự kiện NYC 2027')}>
      <img className="brand-emblem" src="/images/nyc2027-emblem.png" alt="" width={1280} height={1280} />
      <span className="brand-caption">
        <strong>NYC <span>2027</span></strong>
        <small>NEW YEAR<br />CONVENTION</small>
      </span>
    </LocalizedLink>
  );
}
