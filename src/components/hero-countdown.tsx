'use client';
import { useEffect, useState } from 'react';
import { useLocale } from './locale-provider';

const openingTime = Date.parse('2027-01-15T09:00:00+07:00');
const units = ['NGÀY', 'GIỜ', 'PHÚT', 'GIÂY'];

export default function HeroCountdown() {
  const { t } = useLocale();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.floor((openingTime - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const values = remaining === null ? ['--', '--', '--', '--'] : [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ].map(value => String(value).padStart(2, '0'));

  return (
    <div className="hero-countdown" role="group" aria-label={t("Đếm ngược đến NYC 2027, 09:00 ngày 15 tháng 1, giờ Việt Nam")}>
      {values.map((value, index) => (
        <div className="countdown-unit" key={units[index]}>
          <span className="countdown-number">{value}</span>
          <span className="countdown-label">{t(units[index])}</span>
        </div>
      ))}
      {remaining === 0 && <span className="countdown-started">{t("NYC 2027 đã bắt đầu!")}</span>}
    </div>
  );
}
