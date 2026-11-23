'use client';

import { program } from '@/lib/agenda';
import { Sparkles } from './icon';
import { useLocale } from './locale-provider';

export default function EventActivities() {
  const { locale, t } = useLocale();
  const activities = [
    { day: '15/01', session: program[0].sessions[0] },
    { day: '15/01', session: program[0].sessions[1] },
    { day: '16/01', session: program[1].sessions[2] },
    { day: '16/01', session: program[1].sessions[3] },
  ];
  return (
    <section className="section activities-section" id="hoat-dong">
      <div className="container">
        <div className="section-heading"><div>
          <p className="eyebrow blue">{t('HOẠT ĐỘNG NỔI BẬT')}</p>
          <h2>{t('Những cuộc gặp gỡ.')} <em>{t('Những dấu ấn mới.')}</em></h2>
        </div></div>
        <div className="activities-grid">
          {activities.map(({ day, session }) => (
            <article className="activity-item" key={session.name.en}>
              <Sparkles size={28} aria-hidden="true" />
              <h3>{session.name[locale]}</h3>
              <p className="activity-time">{day} · {session.time}</p>
              <p>{session.description[locale]}</p>
            </article>
          ))}
        </div>
        <p className="activities-note">{t('Lịch trình dự kiến. Tour và golf đăng ký riêng.')}</p>
      </div>
    </section>
  );
}