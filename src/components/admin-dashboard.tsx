'use client';
import { useEffect, useState } from 'react';
import Brand from './brand';
import { addons, money, orderMoney } from '@/lib/event';
import type { AdminRegistration } from '@/lib/admin-registrations';
const statusText = { pending: 'Chờ thanh toán', reported: 'Chờ đối soát', confirmed: 'Đã xác nhận' };
export default function AdminDashboard({ email }: { email: string }) {
  const [reminding, setReminding] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  async function remind(id?: string) {
    if (reminding) return;
    if (!id && !window.confirm('Tạo email nhắc cho tất cả đơn chờ thanh toán? Mỗi đơn tối đa một lần/ngày. Không áp dụng bộ lọc hiện tại.')) return;
    setReminding(true); setReminderMessage('');
    try {
      const response = await fetch('/api/admin/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id } : {}) });
      if (response.status === 401) { location.assign('/admin/login'); return; }
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setReminderMessage(result.queued ? `Đã đưa ${result.queued} email nhắc vào hàng đợi gửi.` : 'Không có đơn phù hợp hoặc các đơn đã được nhắc trong hôm nay.');
    } catch (e) { setReminderMessage(e instanceof Error ? e.message : 'Không tạo được email nhắc.'); }
    finally { setReminding(false); }
  }
  const [rows, setRows] = useState<AdminRegistration[]>([]); const [total, setTotal] = useState(0);
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('all'); const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); const [exporting, setExporting] = useState(false); const [error, setError] = useState('');
  const [detail, setDetail] = useState<AdminRegistration | null>(null); const [revision, refresh] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [verified, setVerified] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  useEffect(() => { setVerified(false); setConfirmError(''); setConfirmMessage(''); }, [detail?.id]);
  async function confirmPayment() {
    if (!detail || !verified || confirming) return;
    const id = detail.id; setConfirming(true); setConfirmError('');
    try {
      const response = await fetch(`/api/admin/registrations/${id}/confirm`, { method: 'POST' });
      if (response.status === 401) { location.assign('/admin/login'); return; }
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setDetail(previous => previous?.id === id ? result.registration : previous);
      setRows(previous => previous.map(row => row.id === id ? result.registration : row));
      setConfirmMessage(result.changed ? (result.emailStatus === 'sent' ? 'Đã xác nhận thanh toán. Dịch vụ email đã tiếp nhận email xác nhận.' : 'Đã xác nhận thanh toán. Email đang chờ gửi trong hàng đợi.') : 'Đơn này đã được xác nhận trước đó.');
      refresh(value => value + 1);
    } catch (e) { setConfirmError(e instanceof Error ? e.message : 'Không xác nhận được. Vui lòng thử lại.'); }
    finally { setConfirming(false); }
  }
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/admin/registrations?${new URLSearchParams({ q: query, status: filter, page: String(page) })}`, { signal: controller.signal });
        if (response.status === 401) { location.assign('/admin/login'); return; }
        const result = await response.json(); if (!response.ok) throw new Error(result.error);
        setRows(result.rows); setTotal(result.total);
      } catch (e) { if (!controller.signal.aborted) { setRows([]); setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.'); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, filter, page, revision]);
  async function exportExcel() {
    setExporting(true); setError('');
    try {
      const response = await fetch(`/api/admin/export?${new URLSearchParams({ q: query, status: filter })}`);
      if (response.status === 401) { location.assign('/admin/login'); return; }
      if (!response.ok) throw new Error('Không xuất được file. Vui lòng thử lại.');
      const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a');
      link.href = url; link.download = `NYC2027-dang-ky-${new Date().toISOString().slice(0,10)}.xlsx`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Không xuất được Excel.'); }
    finally { setExporting(false); }
  }
  async function logout() { const response = await fetch('/api/admin/logout', { method: 'POST' }); if (response.ok) location.assign('/admin/login'); else setError('Không đăng xuất được, vui lòng thử lại.'); }
  return <main className="admin-page"><aside className="admin-sidebar"><Brand /><span className="admin-label">BAN TỔ CHỨC</span><p className="admin-account">{email}</p><a href="/admin" className="admin-nav-item">Đơn đăng ký</a><a className="admin-home" href="/">Về trang sự kiện</a><button className="button glass" onClick={logout}>Đăng xuất</button></aside><div className="admin-main"><div className="admin-heading"><div><p className="eyebrow blue">QUẢN LÝ NYC 2027</p><h1>Danh sách đăng ký</h1><p>{loading ? 'Đang tải…' : `${total} đơn khớp bộ lọc`} · Dữ liệu từ Supabase</p></div><button className="button navy" disabled={exporting || loading} onClick={exportExcel}>{exporting ? 'Đang xuất…' : 'Xuất Excel'}</button></div><div className="admin-reminders"><button className="button navy" disabled={reminding} onClick={() => remind()}>{reminding ? 'Đang tạo lời nhắc…' : 'Nhắc thanh toán tất cả'}</button><p role="status">{reminderMessage}</p></div><div className="admin-toolbar"><input aria-label="Tìm kiếm đơn" placeholder="Tìm mã đơn, tên, email, điện thoại, Chapter…" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /><select aria-label="Trạng thái" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="all">Tất cả trạng thái</option>{Object.entries(statusText).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="button navy" onClick={() => refresh(v => v + 1)}>Tải lại</button></div><p className="admin-export-note">Xuất Excel gồm toàn bộ đơn khớp bộ lọc, không chỉ trang đang xem.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="admin-table-wrap" aria-busy={loading}><table className="admin-table"><thead><tr><th>Mã đơn / Thời gian</th><th>Người đại diện</th><th>Chapter</th><th>Số vé</th><th>Cần chuyển khoản</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead><tbody>{!loading && rows.map(row => <tr key={row.id}><td><strong>{row.id}</strong><small>{new Date(row.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</small></td><td><strong>{row.order_data.name}</strong><small>{row.order_data.email}</small><small>{row.order_data.phone}</small></td><td>{row.order_data.chapter || '—'}</td><td>{row.order_data.quantity ?? 1}</td><td>{money(row.payment_data.amount)}</td><td><span className={`status-pill ${row.status}`}>{statusText[row.status]}</span></td><td><button disabled={confirming} onClick={() => setDetail(row)}>Xem đơn</button></td></tr>)}</tbody></table>{loading ? <p className="admin-empty">Đang tải danh sách…</p> : !rows.length && <p className="admin-empty">{error ? 'Chưa tải được danh sách.' : 'Không có đơn phù hợp.'}</p>}</div><div className="admin-pagination"><button className="button navy" disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}>Trang trước</button><span>Trang {page} / {Math.max(1, Math.ceil(total / 50))}</span><button className="button navy" disabled={page * 50 >= total || loading} onClick={() => setPage(p => p + 1)}>Trang sau</button></div></div>{detail && <div className="modal-backdrop" onClick={() => !confirming && setDetail(null)}><section className="admin-detail" role="dialog" aria-modal="true" aria-label="Chi tiết đăng ký" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>{detail.id}</h2><button className="close-button" aria-label="Đóng" onClick={() => !confirming && setDetail(null)}>×</button></div><dl>{[['Người đại diện', detail.order_data.name], ['Email', detail.order_data.email], ['Điện thoại', detail.order_data.phone], ['Chapter', detail.order_data.chapter], ['Số vé', detail.order_data.quantity ?? 1], ['Handicap', detail.order_data.handicap], ['Gói đăng ký', detail.order_data.internationalPackageId || `${detail.order_data.tier} Impactor`], ['Dịch vụ', addons.filter(a => detail.order_data.addons.includes(a.id)).map(a => a.name).join(', ')], ['Giá trị đăng ký', orderMoney(detail.order_data)], ['Số tiền cần chuyển', money(detail.payment_data.amount)], ['Nội dung chuyển khoản', detail.payment_data.transferContent], ['Trạng thái', statusText[detail.status]], ['Ảnh chuyển khoản', detail.receipt_path ? 'Đã tải ảnh lên' : 'Không có'], ['Ghi chú', detail.order_data.note]].map(([label, value]) => <div className="admin-detail-row" key={String(label)}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl><div className="admin-confirmation">{detail.status === 'pending' && <><button className="button navy full" disabled={reminding || confirming} onClick={() => remind(detail.id)}>{reminding ? 'Đang tạo lời nhắc…' : 'Gửi email nhắc thanh toán'}</button><p role="status">{reminderMessage}</p></>}{detail.status !== 'confirmed' && <><label className="consent"><input type="checkbox" checked={verified} disabled={confirming} onChange={e => setVerified(e.target.checked)} />Tôi đã kiểm tra ngân hàng và xác nhận tiền thực nhận khớp số tiền, nội dung chuyển khoản của đơn này.</label><button className="button navy full" disabled={!verified || confirming} onClick={confirmPayment}>{confirming ? 'Đang xác nhận…' : 'Xác nhận thanh toán'}</button></>}{confirmError && <p className="form-error" role="alert">{confirmError}</p>}{confirmMessage && <p className="admin-confirm-success" role="status">{confirmMessage}</p>}</div><button className="button navy full" onClick={() => !confirming && setDetail(null)}>Đóng chi tiết</button></section></div>}</main>;
}
