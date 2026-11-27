import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin-dashboard';
export const metadata = { title: 'Quản trị NYC 2027', robots: { index: false, follow: false } };
export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  return <AdminDashboard email={admin.email} />;
}
