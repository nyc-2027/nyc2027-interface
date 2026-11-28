'use client';

import { program } from '@/lib/agenda';
import { LocalizedLink as Link, useLocale } from './locale-provider';

export default function StoryChapters() {
  const { locale } = useLocale();
  const chapters = [
    { session: program[0].sessions[0], day: '15.01', photo: 'warriors-BaE__94o.jpg', detail: 'trang-an.jpg' },
    { session: program[0].sessions[2], day: '15.01', photo: 'nhahangtre.jpg', detail: 'tam-coc.jpg' },
    { session: program[1].sessions[1], day: '16.01', photo: 'times-97XoNChy.jpg', detail: 'bai-dinh.jpg' },
    { session: program[1].sessions[2], day: '16.01', photo: 'lenhamchuc.jpg', detail: 'hoa-lu.jpg' },
    { session: program[1].sessions[3], day: '16.01', photo: 'times.jpg', detail: 'nhahangtre.jpg' },
    { session: program[2].sessions[1], day: '17.01', photo: 'hang-mua-7.webp', detail: 'cuc-phuong.jpg' },
  ];

  return (
    <section className="story-chapters" id="su-kien">
      <div className="container">
        <div className="story-opening">
          <p>{locale === 'vi' ? 'Ninh Bình · Leading for Impact' : 'Ninh Binh · Leading for Impact'}</p>
          <h2>{locale === 'vi' ? 'Từ miền di sản, cùng mở lối tương lai.' : 'From a land of heritage, a new way forward.'}</h2>
          <p>{locale === 'vi' ? 'Ba ngày hội ngộ. Những cuộc gặp gỡ trở thành kết nối, những ý tưởng tiếp nối thành hành động.' : 'Three days together. Encounters become connections, and shared ideas become action.'}</p>
        </div>
        <div className="story-thread">
          {chapters.map(({ session, day, photo, detail }, index) => (
            <article className={`story-chapter ${index % 2 ? 'story-chapter-reverse' : ''}`} key={session.name.en}>
              <div className="chapter-photographs">
                <div className="chapter-diamond"><img src={`/images/${photo}`} alt={session.name[locale]} loading="lazy" /></div>
                <div className="chapter-detail" aria-hidden="true"><img src={`/images/${detail}`} alt="" loading="lazy" /></div>
              </div>
              <span className="chapter-point relative" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-inherit motion-reduce:animate-none" />
              </span>
              <div className="chapter-copy">
                <time>{day}.2027 · {session.time}</time>
                <h3>{session.name[locale]}</h3>
                <p>{session.description[locale]}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="story-invitation"><Link href="/dang-ky" className="button gold">{locale === 'vi' ? 'Đăng ký tham dự' : 'Register for NYC 2027'}</Link></div>
      </div>
    </section>
  );
}
