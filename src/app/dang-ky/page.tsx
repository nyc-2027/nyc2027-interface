import type { Metadata } from 'next';
import RegistrationPageContent from '@/components/registration-page';

export const metadata: Metadata = {
  title: 'Đăng ký tham dự · NYC 2027',
  description: 'Chọn combo và dịch vụ cho hành trình NYC 2027 tại Ninh Bình, ngày 15–17/01/2027.',
};
export default function RegistrationPage() { return <RegistrationPageContent />; }