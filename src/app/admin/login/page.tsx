import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/admin-auth';
import AdminLogin from '@/components/admin-login';
export const metadata = { title: 'Đăng nhập quản trị · NYC 2027', robots: { index: false, follow: false } };
export default async function Page() { if (await currentAdmin()) redirect('/admin'); return <AdminLogin />; }
