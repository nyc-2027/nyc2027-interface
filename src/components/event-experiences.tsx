'use client';
import { LocalizedLink as Link } from './locale-provider';
import { useLocale } from './locale-provider';
import { CalendarDays, MapPin } from './icon';

type Photo = { image: string; title: string; description: string };

function PhotoCard({ image, title, description }: Photo) {
  const { t } = useLocale();
  return (
    <figure className="experience-photo">
      <img src={`/images/${image}`} alt={t(title)} loading="lazy" />
      <figcaption>
        <h3>{title}</h3>
        <p>{t(description)}</p>
      </figcaption>
    </figure>
  );
}

export default function EventExperiences() {
  const { t, locale } = useLocale();
  return <>
    <section className="section experience-section" id="golf">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow mint">GOLF TOURNAMENT</p>
          <h2>{t("Giữa đồi xanh Tràng An,")}<br /><em>{t("kết nối qua từng cú đánh.")}</em></h2>
          <p>{t("Gặp gỡ những người bạn đồng hành trên sân golf, giữa hồ nước và những dải đồi xanh của Ninh Bình.")}</p>
          <div className="experience-meta">
            <span><CalendarDays size={17} />{t("07:00 · 16/01/2027 · Dự kiến")}</span>
            <span><MapPin size={17} />{t("Tràng An Golf & Resort")}</span>
          </div>
        </div>
        <div className="experience-grid two-columns">
          <PhotoCard image="golf-champion.jpg" title={t("Sân Champion")} description={t("Không gian giao hữu giữa thiên nhiên Tràng An.")} />
          <PhotoCard image="golf-panorama.jpg" title={t("Toàn cảnh Tràng An Golf")} description={t("Hồ nước, đồi xanh và những đường fairway.")} />
        </div>
        <div className="experience-action"><Link href="/dang-ky" className="button gold">{t("Đăng ký Golf Tournament")}</Link></div>
      </div>
    </section>

    <section className="section pickleball-section">
      <div className="container pickleball-layout">
        <img src="/images/pickleball-C57ik3Q2.webp" alt={t("Minh họa sân và vợt pickleball")} loading="lazy" />
        <div>
          <p className="eyebrow mint">IMPACTOR PICKLEBALL CUP</p>
          <h2>{t("Mỗi cú đánh,")}<br /><em>{t("một kết nối mới.")}</em></h2>
          <p>{t("Khép lại hành trình NYC 2027 bằng những trận đấu giao hữu và tinh thần gắn kết của cộng đồng JCI.")}</p>
          <dl className="experience-details">
            <div><dt>{t("Thời gian")}</dt><dd>{t("07:30 · Chủ Nhật, 17/01/2027")}</dd></div>
            <div><dt>{t("Địa điểm")}</dt><dd>{t('Khu Wyndham Grand Vedana')}</dd></div>
            <div><dt>{t("Thông tin tham gia")}</dt><dd>{t("Thể thức và hướng dẫn đăng ký sẽ được BTC cập nhật.")}</dd></div>
          </dl>
          <a href="#lich-trinh" className="button glass">{t("Xem lịch trình hoạt động")}</a>
        </div>
      </div>
    </section>

    <section className="section stay-showcase" id="luu-tru">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow blue">{t("PHÒNG NGHỈ & TIỆN ÍCH")}</p>
          <h2>{t("Ngủ giữa hồ,")}<br /><em>{t("thức dậy giữa núi.")}</em></h2>
          <p>{t("Wyndham Grand Vedana Ninh Bình — điểm dừng chân cho những ngày hội ngộ, giữa cảnh quan hồ nước và núi rừng.")}</p>
        </div>
        <div className="experience-grid stay-mosaic">
          <PhotoCard image="vedana-bungalow.jpg" title={t("Bungalow mặt hồ")} description={locale === 'en' ? 'An intimate bamboo retreat overlooking the lake.' : 'Không gian mái tre ấm cúng, mở tầm nhìn ra mặt hồ.'} />
          <PhotoCard image="vedana-deluxe.jpg" title={t("Phòng khách sạn")} description={locale === 'en' ? 'A restful room with a balcony and mountain views.' : 'Phòng nghỉ có ban công, đón ánh sáng và cảnh núi xanh.'} />
          <PhotoCard image="vedana-villa.jpg" title="Villa" description={t("Không gian nghỉ ngơi và kết nối cho nhóm bạn.")} />
        </div>
        <p className="showcase-note">{t("Gói lưu trú đăng ký theo phòng ghép 2 người, bao gồm ăn sáng. Hình ảnh giới thiệu các không gian của khu nghỉ dưỡng, hạng phòng cụ thể được BTC xác nhận.")}</p>
        <div className="experience-action"><Link href="/dang-ky" className="button navy">{t("Xem lựa chọn tham dự & lưu trú")}</Link></div>
      </div>
    </section>

    <section className="section experience-section" id="khong-gian">
      <div className="container">
        <div className="experience-heading">
          <p className="eyebrow mint">{t("KHÔNG GIAN TỔ CHỨC")}</p>
          <h2>{t("Hội trường, phòng họp")}<br /><em>{t("và nhà hàng.")}</em></h2>
          <p>{t("Tất cả nằm trong cùng khu Wyndham Grand Vedana, thuận tiện di chuyển giữa chương trình và thời gian nghỉ ngơi.")}</p>
        </div>
        <div className="experience-grid three-columns">
          <PhotoCard image="times-97XoNChy.webp" title="Times Hall" description={t("Hội trường không cột, không gian cho lễ vinh danh và Gala.")} />
          <PhotoCard image="tre-BGLebB0k.webp" title={t("Nhà hàng Tre")} description={t("Kiến trúc mái tre và không gian mở bên hồ cho những bữa tiệc kết nối.")} />
          <PhotoCard image="warriors-BaE__94o.webp" title="Warriors" description={t("Phòng họp trang bị màn hình LED, phục vụ các phiên làm việc.")} />
        </div>
      </div>
    </section>

    <section className="section heritage-section" id="diem-den">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow blue">{t("ĐỊA ĐIỂM THAM QUAN")}</p><h2>{t("Ninh Bình,")}<br /><em>{t("chạm miền di sản.")}</em></h2></div><p className="heading-description">{t("Gợi ý khám phá trong chuyến đi.")}<br />{t("Tuyến tour cụ thể sẽ được BTC thông báo.")}</p></div>
        <div className="experience-grid three-columns">
          {[
            { image: 'trang-an.jpg', title: t("Tràng An"), description: t("Lên thuyền giữa núi đá vôi và dòng nước xanh.") },
            { image: 'tam-coc.jpg', title: t("Tam Cốc"), description: t("Sông nước, ruộng lúa và những dãy núi đá.") },
            { image: 'bai-dinh.jpg', title: t("Bái Đính"), description: t("Khám phá không gian kiến trúc và văn hóa tâm linh.") },
            { image: 'hang-mua.jpg', title: t("Hang Múa"), description: t("Ngắm cảnh núi non Ninh Bình từ trên cao.") },
            { image: 'hoa-lu.jpg', title: t("Cố đô Hoa Lư"), description: t("Tìm về những dấu tích thời Đinh – Tiền Lê.") },
            { image: 'cuc-phuong.jpg', title: t("Cúc Phương"), description: t("Đi giữa màu xanh của rừng quốc gia.") },
          ].map(photo => <PhotoCard key={photo.title} {...photo} />)}
        </div>
      </div>
    </section>
  </>;
}
