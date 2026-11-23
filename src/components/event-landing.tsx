'use client';

import { useState } from 'react';
import Link from 'next/link';
import { days } from '@/lib/event';
import { BusFront, CalendarDays, ChevronDown, Compass, Hotel, MapPin, Menu, MessageCircle, Plus, Sparkles, Ticket, Users, X } from './icon';
import HeroVideo from './hero-video';
import HeroCountdown from './hero-countdown';
import ScrollReveal from './scroll-reveal';
import EventActivities from './event-activities';
import EventExperiences from './event-experiences';

const faqs = [
  ['NYC 2027 diễn ra ở đâu và khi nào?', 'New Year Convention 2027 diễn ra từ ngày 15 đến 17/01/2027 tại Wyndham Grand Vedana, Ninh Bình. Lịch trình dự kiến có thể điều chỉnh theo thông báo của Ban tổ chức.'],
  ['Ai có thể tham dự NYC 2027?', 'Sự kiện chào đón hội viên JCI và khách chưa là hội viên. Các hạng đăng ký dành cho từng đối tượng được trình bày tại trang đăng ký tham dự.'],
  ['Những hoạt động nào có trong chương trình?', 'Hành trình gồm General Assembly 01, Welcome Night, chương trình kết nối JCI Vietnam – JCI Mông Cổ, lễ trao giải và Gala Night. Tour, Impactor Pickleball Cup và Impactor Golf Cup là các hoạt động trải nghiệm diễn ra theo lịch.'],
  ['Có xe đưa đón từ Hà Nội không?', 'Có dịch vụ xe khứ hồi Hà Nội – Ninh Bình. Đoàn khởi hành lúc 09:00 ngày 15/01 và trở về lúc 14:00 ngày 17/01. Điểm đón cụ thể sẽ được BTC thông báo.'],
  ['Tôi đăng ký tham dự như thế nào?', 'Nhấn Đăng ký tham dự để sang trang đăng ký riêng, chọn combo và các dịch vụ phù hợp, sau đó điền thông tin người tham dự.'],
];

export default function EventLanding() {
  const [day, setDay] = useState(0);
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [assistant, setAssistant] = useState(false);

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="NYC 2027 trang chủ"><img src="/images/nyc-logo-BScNLGcR.webp" alt="NYC 2027" /><span>NEW YEAR<br /><strong>CONVENTION</strong><small>JCI VIETNAM · 2027</small></span></a>
      <nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Điều hướng chính">
        { [['Về sự kiện', '#su-kien'], ['Lịch trình', '#lich-trinh'], ['Trải nghiệm', '#golf'], ['Lưu trú', '#luu-tru'], ['Không gian', '#khong-gian'], ['Hỏi đáp', '#hoi-dap']].map(([label, url]) => <a href={url} key={url} onClick={() => setMenu(false)}>{label}</a>) }
        <Link className="nav-register" href="/dang-ky">Đăng ký tham dự</Link>
      </nav>
      <div className="header-actions"><Link className="button gold small header-register" href="/dang-ky">Đăng ký tham dự</Link><button className="mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">{menu ? <X /> : <Menu />}</button></div>
    </header>

    <ScrollReveal />
    <main id="top" className="min-w-0">
      <section className="hero">
        <picture><source media="(max-width: 760px)" srcSet="/images/trang-an-mobile.jpg" /><img className="hero-photo" src="/images/trang-an.jpg" alt="Cảnh sông nước và núi đá vôi Tràng An, Ninh Bình" fetchPriority="high" /></picture>
        <HeroVideo />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="eyebrow hero-eyebrow"><span /> JCI VIETNAM TRÂN TRỌNG GIỚI THIỆU</div>
          <h1>New Year<br />Convention <em>2027</em></h1>
          <div className="hero-theme"><span className="fine-line" /><p>Leading for <i>Impact</i></p></div>
          <p className="hero-description">Hội ngộ giữa miền di sản.<br />Cùng khởi đầu một năm dẫn dắt và tạo tác động.</p>
          <div className="hero-buttons"><Link className="button gold" href="/dang-ky"><Ticket size={18} /> Đăng ký ngay</Link><a href="#lich-trinh" className="button glass"><CalendarDays size={18} /> Khám phá lịch trình</a></div>
          <div className="hero-meta"><span><CalendarDays size={18} />15 – 17.01.2027</span><span><MapPin size={18} />Wyndham Grand Vedana, Ninh Bình</span></div>
        <HeroCountdown />
        </div>
        <div className="hero-location"><span className="location-line" /><div><small>ĐIỂM HẸN CỦA NHỮNG KHỞI ĐẦU</small><p>Ninh Bình, Việt Nam</p><span>LEADING FOR IMPACT</span></div></div>
        <a href="#su-kien" className="scroll-cue">CUỘN ĐỂ KHÁM PHÁ <ChevronDown size={15} /></a>
      </section>

      <div className="event-strip"><div className="container strip-inner"><span><strong>03</strong> ngày trải nghiệm</span><span><strong>02</strong> đêm kết nối</span><span><strong>01</strong> tinh thần tạo tác động</span><p>GẶP GỠ. KẾT NỐI. CÙNG VƯƠN XA.<Sparkles size={20} /></p></div></div>

      <section className="section intro-section" id="su-kien"><div className="container intro-grid"><div><p className="eyebrow mint">NEW YEAR CONVENTION 2027</p><h2>Một điểm hẹn.<br />Ngàn kết nối.<br /><em>Vạn tác động.</em></h2></div><div className="intro-copy"><p className="lead">Một hành trình mới bắt đầu từ những cuộc gặp gỡ.</p><p>Giữa cảnh sắc Ninh Bình, NYC 2027 mang cộng đồng JCI Vietnam đến gần nhau hơn — cùng nhìn lại, tôn vinh những dấu ấn và tiếp thêm cảm hứng cho năm mới.</p><div className="intro-highlights"><span><Users size={22} />Kết nối cộng đồng</span><span><Sparkles size={22} />Vinh danh tác động</span><span><Compass size={22} />Khám phá di sản</span></div></div></div></section>

      <section className="section schedule-section" id="lich-trinh"><div className="container"><div className="section-heading"><div><p className="eyebrow mint">LỊCH TRÌNH DỰ KIẾN</p><h2>Ba ngày. <em>Một hành trình đáng nhớ.</em></h2></div><span className="outline-tag"><CalendarDays size={16} />15 – 17 THÁNG 01, 2027</span></div><div className="schedule-layout"><div className="day-tabs" role="tablist" aria-label="Ngày diễn ra">{days.map((item, index) => <button key={item.date} role="tab" aria-selected={day === index} aria-controls="day-panel" id={`day-tab-${index}`} className={day === index ? 'day-tab active' : 'day-tab'} onClick={() => setDay(index)}><span className="day-number">{item.date}<small>/01</small></span><div><small>{item.weekday}</small><strong>{item.title}</strong></div><Plus size={18} /></button>)}<p className="schedule-note">Lịch trình có thể điều chỉnh theo thông báo từ Ban tổ chức.</p></div><div id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${day}`} className="day-panel"><p className="day-subtitle">{days[day].subtitle}</p>{days[day].events.map(event => <div className="agenda-row" key={event.name}><time>{event.time}</time><div className="agenda-dot" /><div className="agenda-content"><span className={event.tag === 'Trong combo' ? 'agenda-tag included' : 'agenda-tag'}>{event.tag}</span><h3>{event.name}</h3><p>{event.detail}</p></div></div>)}</div></div></div></section>

      <EventActivities />

      <section className="destination-section" id="ninh-binh"><img src="/images/ninh-binh.jpg" alt="Cảnh sắc thiên nhiên Ninh Bình" loading="lazy" /><div className="destination-shade" /><div className="container destination-content"><p className="eyebrow">HƠN CẢ MỘT CHUYẾN ĐI</p><h2>Chạm miền di sản.<br /><em>Chạm những cảm hứng mới.</em></h2><p>Núi non, sông nước và những cuộc gặp gỡ.<br />Ninh Bình chờ bạn viết tiếp hành trình của riêng mình.</p><a href="#diem-den" className="button gold"><Compass size={18} />Khám phá điểm đến</a><span className="destination-caption"><MapPin size={15} />NINH BÌNH, VIỆT NAM</span></div></section>

      <EventExperiences />
      <section className="section handbook-section" id="cam-nang"><div className="container"><div className="section-heading"><div><p className="eyebrow blue">CẨM NANG THAM DỰ</p><h2>Sẵn sàng cho <em>điểm hẹn mới.</em></h2></div><span className="handbook-tag">THÔNG TIN THIẾT YẾU</span></div><div className="handbook-grid"><article className="stay-card"><img src="/images/vedana.jpg" alt="Sảnh đón khách tại Wyndham Grand Vedana Ninh Bình" loading="lazy" /><div><span className="eyebrow">ĐỊA ĐIỂM & LƯU TRÚ</span><h3>Wyndham Grand Vedana<br />Ninh Bình</h3><p>Nghỉ giữa thiên nhiên. Hội ngộ trong cảm hứng.</p><a href="https://www.google.com/maps/search/?api=1&query=Wyndham+Grand+Vedana+Ninh+Binh" target="_blank" rel="noreferrer" className="map-link"><MapPin size={17} />Xem vị trí trên bản đồ</a></div></article><div className="handbook-articles"><article><span className="guide-icon"><BusFront size={24} /></span><div><h3>Di chuyển thật dễ dàng</h3><p>Xe khứ hồi Hà Nội – Ninh Bình. Khởi hành 09:00 ngày 15/01, trở về 14:00 ngày 17/01. Điểm đón sẽ được BTC thông báo.</p><Link href="/dang-ky">Đăng ký dịch vụ di chuyển</Link></div></article><article><span className="guide-icon"><Hotel size={24} /></span><div><h3>Một nơi nghỉ, trọn hành trình</h3><p>Phòng ghép 2 người, đã bao gồm ăn sáng. Thông tin các đêm lưu trú được cung cấp tại trang đăng ký.</p><Link href="/dang-ky">Xem các đêm lưu trú</Link></div></article><article><span className="guide-icon"><MessageCircle size={24} /></span><div><h3>Luôn có người đồng hành</h3><p>Câu hỏi về đăng ký, dịch vụ hay lịch trình? Xem các giải đáp nhanh bên dưới. Kênh hỗ trợ chính thức sẽ được BTC cập nhật.</p><a href="#hoi-dap">Xem câu hỏi thường gặp</a></div></article></div></div><div className="coming-features"><Sparkles size={20} /><p><strong>Hành trình sẽ còn nhiều điều thú vị.</strong> Handbook đầy đủ, trợ lý AI và NYC Quest sẽ được bổ sung ở các giai đoạn tiếp theo.</p><span>SẮP RA MẮT</span></div></div></section>

      <section className="section faq-section" id="hoi-dap"><div className="container faq-layout"><div><p className="eyebrow mint">BẠN HỎI, NYC GIẢI ĐÁP</p><h2>Mọi điều bạn<br /><em>cần biết.</em></h2><p className="faq-intro">Một chút chuẩn bị để sẵn sàng<br />cho một hành trình thật trọn vẹn.</p><button className="text-button" onClick={() => setAssistant(true)}><Sparkles size={17} />Khám phá trợ lý NYC</button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div key={question} className="faq-item"><button aria-expanded={faq === index} aria-controls={`faq-${index}`} onClick={() => setFaq(faq === index ? null : index)}>{question}<Plus size={19} className={faq === index ? 'rotate' : ''} /></button>{faq === index && <p id={`faq-${index}`}>{answer}</p>}</div>)}</div></div></section>

      <section className="closing-section"><div className="container"><p className="eyebrow">15 – 17.01.2027 · NINH BÌNH</p><h2>Hẹn bạn ở <em>khởi đầu mới.</em></h2><Link className="button navy" href="/dang-ky"><Ticket size={18} />Trở thành một phần của NYC 2027</Link></div></section>
    </main>
    <footer><div className="container footer-top"><a className="brand" href="#top"><img src="/images/nyc-logo-BScNLGcR.webp" alt="NYC 2027" /><span>NEW YEAR<br /><strong>CONVENTION</strong><small>LEADING FOR IMPACT</small></span></a><p>Được tổ chức bởi <strong>JCI Vietnam</strong><br />Ninh Bình · Việt Nam</p><div><a href="#lich-trinh">Lịch trình</a><Link href="/dang-ky">Đăng ký tham dự</Link><a href="#hoi-dap">Hỗ trợ</a></div></div><div className="container footer-bottom"><span>© 2027 New Year Convention · JCI Vietnam</span><span>Gặp gỡ hôm nay. Tạo tác động ngày mai.</span></div></footer>
    <button className="assistant-fab" onClick={() => setAssistant(!assistant)} aria-label="Mở trợ lý NYC"><Sparkles size={20} /><span>Hỏi NYC</span><span className="soon-dot" /></button>
    {assistant && <div className="assistant-popover" role="dialog" aria-label="Trợ lý NYC"><div className="assistant-header"><Sparkles size={21} /><strong>Người bạn đồng hành NYC</strong><button aria-label="Đóng trợ lý" onClick={() => setAssistant(false)}><X size={18} /></button></div><div className="assistant-body"><span className="handbook-tag">AI · SẮP RA MẮT</span><h3>Chào bạn, hẹn gặp tại NYC!</h3><p>Trợ lý AI đang được chuẩn bị. Trong lúc chờ, bạn có thể tìm nhanh các thông tin đã có:</p>{[['Lịch trình 3 ngày', '#lich-trinh'], ['Các hoạt động sự kiện', '#hoat-dong'], ['Địa điểm & di chuyển', '#cam-nang'], ['Câu hỏi thường gặp', '#hoi-dap']].map(([label, href]) => <a key={href} href={href} onClick={() => setAssistant(false)}>{label}<ChevronDown size={15} /></a>)}</div></div>}
  </>;
}
