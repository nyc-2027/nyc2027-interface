'use client';

import { useState } from 'react';
import { LanguageSwitcher, LocalizedLink as Link, useLocale } from './locale-provider';
import EventAgenda from './event-agenda';
import { BusFront, CalendarDays, ChevronDown, Compass, Hotel, MapPin, Menu, MessageCircle, Plus, Sparkles, Ticket, X } from './icon';
import HeroVideo from './hero-video';
import HeroPartners from './hero-partners';
import Brand from './brand';
import HeroCountdown from './hero-countdown';
import ScrollReveal from './scroll-reveal';
import StoryChapters from './story-chapters';
import EventExperiences from './event-experiences';

const faqs = [
  ['NYC 2027 diễn ra ở đâu và khi nào?', 'New Year Convention 2027 diễn ra từ ngày 15 đến 17/01/2027 tại Wyndham Grand Vedana, Ninh Bình. Lịch trình dự kiến có thể điều chỉnh theo thông báo của Ban tổ chức.'],
  ['Ai có thể tham dự NYC 2027?', 'Sự kiện chào đón hội viên JCI và khách chưa là hội viên. Các hạng đăng ký dành cho từng đối tượng được trình bày tại trang đăng ký tham dự.'],
  ['Những hoạt động nào có trong chương trình?', 'Hành trình gồm Đại hội thường niên JCI Vietnam, Culture Night, các lễ nhậm chức JCI Thăng Long và JCI Vietnam, JCI Vietnam Awards, giải golf, pickleball và tour di sản.'],
  ['Có xe đưa đón từ Hà Nội không?', 'Có dịch vụ xe khứ hồi Hà Nội – Ninh Bình. Đoàn khởi hành lúc 09:00 ngày 15/01 và trở về lúc 14:00 ngày 17/01. Điểm đón cụ thể sẽ được BTC thông báo.'],
  ['Tôi đăng ký tham dự như thế nào?', 'Nhấn Đăng ký tham dự để sang trang đăng ký riêng, chọn combo và các dịch vụ phù hợp, sau đó điền thông tin người tham dự.'],
];

export default function EventLanding() {
  const { t } = useLocale();
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [assistant, setAssistant] = useState(false);

  return <div className="immersive-site">
    <header className="site-header">
      <Brand href="#top" variant="lfi" />
      <nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label={t("Điều hướng chính")}>
        { [[t("Về sự kiện"), '#su-kien'], [t("Lịch trình"), '#lich-trinh'], [t("Trải nghiệm"), '#golf'], [t("Lưu trú"), '#luu-tru'], [t("Không gian"), '#khong-gian'], [t("Hỏi đáp"), '#hoi-dap']].map(([label, url]) => <a href={url} key={url} onClick={() => setMenu(false)}>{t(label)}</a>) }
        <Link className="nav-register" href="/dang-ky">{t("Đăng ký tham dự")}</Link>
      </nav>
      <div className="header-actions"><LanguageSwitcher /><Link className="button gold small header-register" href="/dang-ky">{t("Đăng ký tham dự")}</Link><button className="mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">{menu ? <X /> : <Menu />}</button></div>
    </header>

    <ScrollReveal />
    <main id="top" className="min-w-0">
      <section className="hero">
        <picture><source media="(max-width: 760px)" srcSet="/images/trang-an-mobile.jpg" /><img className="hero-photo" src="/images/trang-an.jpg" alt={t("Cảnh sông nước và núi đá vôi Tràng An, Ninh Bình")} fetchPriority="high" /></picture>
        <HeroVideo />
        <div className="hero-shade" />

        <div className="container hero-content">
          <HeroPartners />
          <h1 className="hero-event-title"><span>2027 JCI Vietnam</span><img className="hero-title-artwork" src="/images/Text_NYC.png" alt="New Year Convention" width={1962} height={196} fetchPriority="high" /></h1>
          <div className="hero-theme"><p aria-label="Leading for Impact"><span className="theme-leading">Leading</span>{' '}<span className="theme-for">for</span>{' '}<span className="theme-impact">Impact</span></p></div>
          <p className="hero-description">{t("Hội ngộ giữa miền di sản.")}<br />{t("Cùng khởi đầu một năm dẫn dắt và tạo tác động.")}</p>
          <div className="hero-buttons"><Link className="button gold" href="/dang-ky"><Ticket size={18} /> {t("Đăng ký ngay")}</Link><a href="#lich-trinh" className="button glass"><CalendarDays size={18} /> {t("Khám phá lịch trình")}</a></div>
          <div className="hero-meta"><span><CalendarDays size={18} />15–17.01.2027</span><span><MapPin size={18} />{t("Wyndham Grand Vedana, Ninh Bình")}</span></div>
        <HeroCountdown />
        </div>
        <div className="hero-location"><span className="location-line" /><div><small>{t("ĐIỂM HẸN CỦA NHỮNG KHỞI ĐẦU")}</small><p>{t("Ninh Bình, Việt Nam")}</p><span>LEADING FOR IMPACT</span></div></div>
        <a href="#su-kien" className="scroll-cue">{t("CUỘN ĐỂ KHÁM PHÁ")} <ChevronDown size={15} /></a>
      </section>

      <StoryChapters />

      <EventAgenda />



      <section className="destination-section" id="ninh-binh"><img src="/images/ninh-binh.jpg" alt={t("Cảnh sắc thiên nhiên Ninh Bình")} loading="lazy" /><div className="destination-shade" /><div className="container destination-content"><p className="eyebrow">{t("HƠN CẢ MỘT CHUYẾN ĐI")}</p><h2>{t("Chạm miền di sản.")}<br /><em>{t("Chạm những cảm hứng mới.")}</em></h2><p>{t("Núi non, sông nước và những cuộc gặp gỡ.")}<br />{t("Ninh Bình chờ bạn viết tiếp hành trình của riêng mình.")}</p><a href="#diem-den" className="button gold"><Compass size={18} />{t("Khám phá điểm đến")}</a><span className="destination-caption"><MapPin size={15} />{t("NINH BÌNH, VIỆT NAM")}</span></div></section>

      <EventExperiences />
      <section className="section handbook-section" id="cam-nang"><div className="container"><div className="section-heading"><div><p className="eyebrow blue">{t("CẨM NANG THAM DỰ")}</p><h2>{t("Sẵn sàng cho")} <em>{t("điểm hẹn mới.")}</em></h2></div><span className="handbook-tag">{t("THÔNG TIN THIẾT YẾU")}</span></div><div className="handbook-grid"><article className="stay-card"><img src="/images/vedana.jpg" alt={t("Sảnh đón khách tại Wyndham Grand Vedana Ninh Bình")} loading="lazy" /><div><span className="eyebrow">{t("ĐỊA ĐIỂM & LƯU TRÚ")}</span><h3>Wyndham Grand Vedana<br />{t("Ninh Bình")}</h3><p>{t("Nghỉ giữa thiên nhiên. Hội ngộ trong cảm hứng.")}</p><a href="https://www.google.com/maps/search/?api=1&query=Wyndham+Grand+Vedana+Ninh+Binh" target="_blank" rel="noreferrer" className="map-link"><MapPin size={17} />{t("Xem vị trí trên bản đồ")}</a></div></article><div className="handbook-articles"><article><span className="guide-icon"><BusFront size={24} /></span><div><h3>{t("Di chuyển thật dễ dàng")}</h3><p>{t("Xe khứ hồi Hà Nội – Ninh Bình. Khởi hành 09:00 ngày 15/01, trở về 14:00 ngày 17/01. Điểm đón sẽ được BTC thông báo.")}</p><Link href="/dang-ky">{t("Đăng ký dịch vụ di chuyển")}</Link></div></article><article><span className="guide-icon"><Hotel size={24} /></span><div><h3>{t("Một nơi nghỉ, trọn hành trình")}</h3><p>{t("Phòng ghép 2 người, đã bao gồm ăn sáng. Thông tin các đêm lưu trú được cung cấp tại trang đăng ký.")}</p><Link href="/dang-ky">{t("Xem các đêm lưu trú")}</Link></div></article><article><span className="guide-icon"><MessageCircle size={24} /></span><div><h3>{t("Luôn có người đồng hành")}</h3><p>{t("Câu hỏi về đăng ký, dịch vụ hay lịch trình? Xem các giải đáp nhanh bên dưới. Kênh hỗ trợ chính thức sẽ được BTC cập nhật.")}</p><a href="#hoi-dap">{t("Xem câu hỏi thường gặp")}</a></div></article></div></div><div className="coming-features"><Sparkles size={20} /><p><strong>{t("Hành trình sẽ còn nhiều điều thú vị.")}</strong> {t("Handbook đầy đủ, trợ lý AI và NYC Quest sẽ được bổ sung ở các giai đoạn tiếp theo.")}</p><span>{t("SẮP RA MẮT")}</span></div></div></section>

      <section className="section faq-section" id="hoi-dap"><div className="container faq-layout"><div><p className="eyebrow mint">{t("BẠN HỎI, NYC GIẢI ĐÁP")}</p><h2>{t("Mọi điều bạn")}<br /><em>{t("cần biết.")}</em></h2><p className="faq-intro">{t("Một chút chuẩn bị để sẵn sàng")}<br />{t("cho một hành trình thật trọn vẹn.")}</p><button className="text-button" onClick={() => setAssistant(true)}><Sparkles size={17} />{t("Khám phá trợ lý NYC")}</button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div key={t(question)} className="faq-item"><button aria-expanded={faq === index} aria-controls={`faq-${index}`} onClick={() => setFaq(faq === index ? null : index)}>{t(question)}<Plus size={19} className={faq === index ? 'rotate' : ''} /></button>{faq === index && <p id={`faq-${index}`}>{t(answer)}</p>}</div>)}</div></div></section>

      <section className="closing-section"><div className="container"><p className="eyebrow">{t("15 – 17.01.2027 · NINH BÌNH")}</p><h2>{t("Hẹn bạn ở")} <em>{t("khởi đầu mới.")}</em></h2><Link className="button navy" href="/dang-ky"><Ticket size={18} />{t("Trở thành một phần của NYC 2027")}</Link></div></section>
    </main>
    <footer><div className="container footer-top"><Brand href="#top" /><p>{t("Được tổ chức bởi")} <strong>JCI Vietnam</strong><br />{t("Ninh Bình · Việt Nam")}</p><div><a href="#lich-trinh">{t("Lịch trình")}</a><Link href="/dang-ky">{t("Đăng ký tham dự")}</Link><a href="#hoi-dap">{t("Hỗ trợ")}</a></div></div><div className="container footer-bottom"><span>© 2027 JCI Vietnam Newyear Convention</span><span>{t("Gặp gỡ hôm nay. Tạo tác động ngày mai.")}</span></div></footer>
    <button className="assistant-fab" onClick={() => setAssistant(!assistant)} aria-label={t("Mở trợ lý NYC")}><Sparkles size={20} /><span>{t("Hỏi NYC")}</span><span className="soon-dot" /></button>
    {assistant && <div className="assistant-popover" role="dialog" aria-label={t("Trợ lý NYC")}><div className="assistant-header"><Sparkles size={21} /><strong>{t("Người bạn đồng hành NYC")}</strong><button aria-label={t("Đóng trợ lý")} onClick={() => setAssistant(false)}><X size={18} /></button></div><div className="assistant-body"><span className="handbook-tag">{t("AI · SẮP RA MẮT")}</span><h3>{t("Chào bạn, hẹn gặp tại NYC!")}</h3><p>{t("Trợ lý AI đang được chuẩn bị. Trong lúc chờ, bạn có thể tìm nhanh các thông tin đã có:")}</p>{[[t("Lịch trình 3 ngày"), '#lich-trinh'], [t("Các hoạt động sự kiện"), '#su-kien'], [t("Địa điểm & di chuyển"), '#cam-nang'], [t("Câu hỏi thường gặp"), '#hoi-dap']].map(([label, href]) => <a key={href} href={href} onClick={() => setAssistant(false)}>{label}<ChevronDown size={15} /></a>)}</div></div>}
  </div>;
}
