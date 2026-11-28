'use client';

import { useRef, useState } from 'react';
import { program } from '@/lib/agenda';
import { LocalizedLink as Link, useLocale } from './locale-provider';
import { CalendarDays, Clock3 } from './icon';

export default function EventAgenda() {
  const { locale, t } = useLocale();
  const [activeDay, setActiveDay] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedDay = program[activeDay];

  function navigateTab(event: React.KeyboardEvent, index: number) {
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 };
    const offset = offsets[event.key];
    if (offset === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? program.length - 1 : (index + offset + program.length) % program.length;
    setActiveDay(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="section program-section" id="lich-trinh">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow mint">{locale === 'vi' ? 'LỊCH TRÌNH NYC 2027' : 'NYC 2027 PROGRAM'}</p>
            <h2>{locale === 'vi' ? <>Từ Cố đô —<br /><em>Mở lối tương lai.</em></> : <>From the Ancient Capital —<br /><em>Opening the Way Forward.</em></>}</h2>
          </div>
          <p className="program-introduction">{locale === 'vi' ? 'Ba ngày ở Ninh Bình, nơi di sản ngàn năm gặp thế hệ lãnh đạo trẻ đang kiến tạo tương lai.' : 'Three days in Ninh Binh, where a thousand years of heritage meet the young leaders shaping what comes next.'}</p>
        </div>
        <div className="program-layout">
          <figure className="program-visual">
            <img key={activeDay} src={['/images/trangan.jpg', '/images/times-97XoNChy.jpg', '/images/hang-mua.jpg'][activeDay]} alt={selectedDay.theme[locale]} loading="lazy" />
            <figcaption><span>{selectedDay.date}.01.2027</span><h3>{selectedDay.theme[locale]}</h3></figcaption>
          </figure>
          <div className="program-copy">
            <div className="program-days" role="tablist" aria-label={t('Lịch trình theo ngày')}>
              {program.map((day, index) => (
                <button key={day.date} ref={element => { tabs.current[index] = element; }} id={`program-tab-${index}`} role="tab"
                  aria-selected={index === activeDay} aria-controls="program-panel" tabIndex={index === activeDay ? 0 : -1}
                  className={index === activeDay ? 'program-day active' : 'program-day'}
                  onClick={() => setActiveDay(index)} onKeyDown={event => navigateTab(event, index)}>
                  <span className="program-date">{day.date}<small>/01</small></span>
                  <span><small>{day.weekday[locale]}</small><strong>{day.theme[locale]}</strong></span>
                </button>
              ))}
            </div>
            <div id="program-panel" role="tabpanel" aria-labelledby={`program-tab-${activeDay}`} tabIndex={0}>
              <div className="program-panel-heading"><CalendarDays size={18} /><span>{selectedDay.date}.01.2027</span><p>{t('Giờ dự kiến · Giờ Việt Nam (UTC+7)')}</p></div>
              <div className="program-timeline" key={activeDay}>
                {selectedDay.sessions.map(session => (
                  <article className="program-session" key={session.time}>
                    <time dateTime={session.time === 'PM' ? `2027-01-${selectedDay.date}` : `2027-01-${selectedDay.date}T${session.time}:00+07:00`}><Clock3 size={16} />{session.time === 'PM' ? (locale === 'en' ? 'Afternoon' : 'Chiều') : session.time}</time>
                    <div>
                      {session.module && <span className="program-module">{t('Đăng ký riêng')}</span>}
                      <h3>{session.name[locale]}</h3>
                      <p>{session.description[locale]}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="program-footer"><p>{t('Lịch trình dự kiến, có thể điều chỉnh theo thông báo từ BTC.')}</p><Link className="button gold" href="/dang-ky">{t('Đăng ký tham dự')}</Link></div>
      </div>
    </section>
  );
}
