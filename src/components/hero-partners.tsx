export default function HeroPartners() {
  return (
    <div className="hero-partners partner-ribbon" aria-label="Governance, project and host organisations">
      <div className="hero-partner">
        <span className="partner-role">Governed by</span>
        <div className="partner-logo-surface"><img className="partner-yba" src="/images/logo_yba.png" alt="YBA — Hội Doanh nhân trẻ Thành phố Hồ Chí Minh" /></div>
      </div>
      <div className="hero-partner hero-partner-project">
        <span className="partner-role">Project of</span>
        <div className="partner-logo-surface">
          <img className="partner-jci" src="/images/logo_VN.png" alt="JCI Vietnam" />
          <img className="partner-lfi" src="/images/logo_LFI.png" alt="Leading for Impact — JCI Vietnam 2027" />
        </div>
      </div>
      <div className="hero-partner">
        <span className="partner-role">Hosted by</span>
        <div className="partner-logo-surface"><img className="partner-jci" src="/images/logo_ThangLong.png" alt="JCI Thanglong" /></div>
      </div>
    </div>
  );
}
