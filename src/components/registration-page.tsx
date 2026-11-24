'use client';

import Registration from './registration';
import Brand from './brand';
import InternationalRegistration from './international-registration';
import { LanguageSwitcher, LocalizedLink as Link, useLocale } from './locale-provider';

export default function RegistrationPageContent() {
  const { locale, t } = useLocale();
  return (
    <div className="registration-page">
      <header className="registration-page-header container">
        <Brand variant="lfi" />
        <div className="registration-page-links"><LanguageSwitcher /><Link className="event-return" href="/">{t('Về trang sự kiện')}</Link></div>
      </header>
      <main className="registration-page-main container">
        <div className="registration-page-intro">
          <p className="eyebrow mint">15 – 17.01.2027 · NINH BINH</p>
          <h1>{locale === 'vi' ? <>Đăng ký <em>tham dự.</em></> : <>Join the <em>journey.</em></>}</h1>
          <p>{locale === 'vi' ? 'Chọn combo và các dịch vụ phù hợp cho hành trình của bạn tại NYC 2027.' : 'Two curated packages for international delegates. Choose your NYC 2027 experience.'}</p>
        </div>
        {locale === 'en' ? <InternationalRegistration /> : <Registration />}
      </main>
    </div>
  );
}
