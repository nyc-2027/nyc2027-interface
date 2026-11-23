import { CalendarDays, Compass, Sparkles, Users } from './icon';

const activities = [
  {
    icon: Users,
    name: 'General Assembly 01',
    time: '15/01 · 14:00 – 17:00',
    description: 'Đại hội đồng JCI Vietnam, cùng hội ngộ và mở đầu hành trình hoạt động của năm mới.',
  },
  {
    icon: Sparkles,
    name: 'Welcome Night & Gala Night',
    time: '15 & 16/01 · 18:30 – 22:00',
    description: 'Hai đêm gặp gỡ cộng đồng JCI, chia sẻ cảm hứng và mở rộng những kết nối.',
  },
  {
    icon: CalendarDays,
    name: 'Vinh danh & kết nối',
    time: '16/01',
    description: 'Chương trình gặp gỡ JCI Vietnam với JCI Mông Cổ và lễ trao giải ghi nhận những dấu ấn cống hiến.',
  },
  {
    icon: Compass,
    name: 'Trải nghiệm Ninh Bình',
    time: '15 – 17/01 · Theo lịch từng hoạt động',
    description: 'Khám phá miền di sản qua tour tự chọn, cùng các hoạt động Impactor Pickleball Cup và Impactor Golf Cup sáng 17/01.',
  },
];

export default function EventActivities() {
  return (
    <section className="section activities-section" id="hoat-dong">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow blue">HOẠT ĐỘNG NỔI BẬT</p>
            <h2>Những cuộc gặp gỡ. <em>Những dấu ấn mới.</em></h2>
          </div>
        </div>
        <div className="activities-grid">
          {activities.map(({ icon: Icon, name, time, description }) => (
            <article className="activity-item" key={name}>
              <Icon size={28} aria-hidden="true" />
              <h3>{name}</h3>
              <p className="activity-time">{time}</p>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <p className="activities-note">Lịch trình dự kiến. Tour và các hoạt động thể thao đăng ký theo nhu cầu.</p>
      </div>
    </section>
  );
}
