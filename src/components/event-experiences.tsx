import Link from 'next/link';
import { CalendarDays, MapPin } from './icon';

type Photo = { image: string; title: string; description: string };

function PhotoCard({ image, title, description }: Photo) {
  return (
    <figure className="experience-photo">
      <img src={`/images/${image}`} alt={title} loading="lazy" />
      <figcaption>
        <h3>{title}</h3>
        <p>{description}</p>
      </figcaption>
    </figure>
  );
}

export default function EventExperiences() {
  return <>
    <section className="section experience-section" id="golf">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow mint">GOLF TOURNAMENT</p>
          <h2>Giữa đồi xanh Tràng An,<br /><em>kết nối qua từng cú đánh.</em></h2>
          <p>Gặp gỡ những người bạn đồng hành trên sân golf, giữa hồ nước và những dải đồi xanh của Ninh Bình.</p>
          <div className="experience-meta">
            <span><CalendarDays size={17} />Sáng 17/01/2027 · Dự kiến</span>
            <span><MapPin size={17} />Tràng An Golf &amp; Resort</span>
          </div>
        </div>
        <div className="experience-grid two-columns">
          <PhotoCard image="golf-champion.jpg" title="Sân Champion" description="Không gian giao hữu giữa thiên nhiên Tràng An." />
          <PhotoCard image="golf-panorama.jpg" title="Toàn cảnh Tràng An Golf" description="Hồ nước, đồi xanh và những đường fairway." />
        </div>
        <div className="experience-action"><Link href="/dang-ky" className="button gold">Đăng ký Golf Tournament</Link></div>
      </div>
    </section>

    <section className="section pickleball-section">
      <div className="container pickleball-layout">
        <img src="/images/pickleball-C57ik3Q2.webp" alt="Minh họa sân và vợt pickleball" loading="lazy" />
        <div>
          <p className="eyebrow mint">IMPACTOR PICKLEBALL CUP</p>
          <h2>Mỗi cú đánh,<br /><em>một kết nối mới.</em></h2>
          <p>Khép lại hành trình NYC 2027 bằng những trận đấu giao hữu và tinh thần gắn kết của cộng đồng JCI.</p>
          <dl className="experience-details">
            <div><dt>Thời gian</dt><dd>Sáng Chủ Nhật, 17/01/2027</dd></div>
            <div><dt>Địa điểm</dt><dd>Khu Wyndham Grand Vedana</dd></div>
            <div><dt>Thông tin tham gia</dt><dd>Thể thức và hướng dẫn đăng ký sẽ được BTC cập nhật.</dd></div>
          </dl>
          <a href="#lich-trinh" className="button glass">Xem lịch trình hoạt động</a>
        </div>
      </div>
    </section>

    <section className="section stay-showcase" id="luu-tru">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow blue">PHÒNG NGHỈ &amp; TIỆN ÍCH</p>
          <h2>Ngủ giữa hồ,<br /><em>thức dậy giữa núi.</em></h2>
          <p>Wyndham Grand Vedana Ninh Bình — điểm dừng chân cho những ngày hội ngộ, giữa cảnh quan hồ nước và núi rừng.</p>
        </div>
        <div className="experience-grid stay-mosaic">
          <PhotoCard image="bungalow-CkxKzQBm.webp" title="Bungalow mặt hồ" description="Mái tre soi bóng xuống nước, gần gũi với thiên nhiên." />
          <PhotoCard image="hotel-FrC3zrvc.webp" title="Phòng khách sạn" description="Các khối phòng bên hồ trong khu nghỉ dưỡng." />
          <PhotoCard image="villa-BKF-K3Ur.webp" title="Villa" description="Không gian nghỉ ngơi và kết nối cho nhóm bạn." />
        </div>
        <p className="showcase-note">Gói lưu trú đăng ký theo phòng ghép 2 người, bao gồm ăn sáng. Hình ảnh giới thiệu các không gian của khu nghỉ dưỡng, hạng phòng cụ thể được BTC xác nhận.</p>
        <div className="experience-action"><Link href="/dang-ky" className="button navy">Xem lựa chọn tham dự &amp; lưu trú</Link></div>
      </div>
    </section>

    <section className="section experience-section" id="khong-gian">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow mint">KHÔNG GIAN TỔ CHỨC</p>
          <h2>Hội trường, phòng họp<br /><em>và nhà hàng.</em></h2>
          <p>Tất cả nằm trong cùng khu Wyndham Grand Vedana, thuận tiện di chuyển giữa chương trình và thời gian nghỉ ngơi.</p>
        </div>
        <div className="experience-grid three-columns">
          <PhotoCard image="times-97XoNChy.webp" title="Times Hall" description="Hội trường không cột, không gian cho lễ vinh danh và Gala." />
          <PhotoCard image="tre-BGLebB0k.webp" title="Nhà hàng Tre" description="Kiến trúc mái tre và không gian mở bên hồ cho những bữa tiệc kết nối." />
          <PhotoCard image="warriors-BaE__94o.webp" title="Warriors" description="Phòng họp trang bị màn hình LED, phục vụ các phiên làm việc." />
        </div>
      </div>
    </section>

    <section className="section heritage-section" id="diem-den">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow blue">ĐỊA ĐIỂM THAM QUAN</p><h2>Ninh Bình,<br /><em>chạm miền di sản.</em></h2></div><p className="heading-description">Gợi ý khám phá trong chuyến đi.<br />Tuyến tour cụ thể sẽ được BTC thông báo.</p></div>
        <div className="experience-grid three-columns">
          {[
            { image: 'trang-an.jpg', title: 'Tràng An', description: 'Lên thuyền giữa núi đá vôi và dòng nước xanh.' },
            { image: 'tam-coc.jpg', title: 'Tam Cốc', description: 'Sông nước, ruộng lúa và những dãy núi đá.' },
            { image: 'bai-dinh.jpg', title: 'Bái Đính', description: 'Khám phá không gian kiến trúc và văn hóa tâm linh.' },
            { image: 'hang-mua.jpg', title: 'Hang Múa', description: 'Ngắm cảnh núi non Ninh Bình từ trên cao.' },
            { image: 'hoa-lu.jpg', title: 'Cố đô Hoa Lư', description: 'Tìm về những dấu tích thời Đinh – Tiền Lê.' },
            { image: 'cuc-phuong.jpg', title: 'Cúc Phương', description: 'Đi giữa màu xanh của rừng quốc gia.' },
          ].map(photo => <PhotoCard key={photo.title} {...photo} />)}
        </div>
      </div>
    </section>
  </>;
}
