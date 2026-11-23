import type { Metadata } from 'next';
import Link from 'next/link';
import Registration from '@/components/registration';

export const metadata: Metadata = {
  title: 'Đăng ký tham dự · NYC 2027',
  description: 'Chọn combo và dịch vụ cho hành trình NYC 2027 tại Ninh Bình, ngày 15–17/01/2027.',
};

export default function RegistrationPage() {
  return (
    <div className="registration-page">
      <header className="registration-page-header container">
        <Link className="brand" href="/" aria-label="Về trang sự kiện NYC 2027">
          <img src="/images/nyc-logo-BScNLGcR.webp" alt="NYC 2027" />
          <span>NEW YEAR<br /><strong>CONVENTION</strong><small>JCI VIETNAM · 2027</small></span>
        </Link>
        <Link className="event-return" href="/">Về trang sự kiện</Link>
      </header>
      <main className="registration-page-main container">
        <div className="registration-page-intro">
          <p className="eyebrow mint">15 – 17.01.2027 · NINH BÌNH</p>
          <h1>Đăng ký <em>tham dự.</em></h1>
          <p>Chọn combo và các dịch vụ phù hợp cho hành trình của bạn tại NYC 2027.</p>
        </div>
        <Registration />
      </main>
    </div>
  );
}
