'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Brand from './brand';
export default function AdminLogin() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const router = useRouter();
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget); setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      router.replace('/admin'); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Không đăng nhập được.'); }
    finally { setBusy(false); }
  }
  return <main className="admin-login"><div className="admin-login-card"><Brand /><h1>Đăng nhập quản trị</h1><p>Dành cho Ban tổ chức NYC 2027.</p><form onSubmit={login}><label className="field">Email admin<input name="email" type="email" autoComplete="username" required maxLength={180} /></label><label className="field">Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={512} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></form><a className="back-link" href="/">Về trang sự kiện</a></div></main>;
}
