'use client';

import type { Session } from '@/lib/agenda';
import { useLocale } from './locale-provider';
import { MapPin } from './icon';

export default function SessionLocation({ session }: { session: Session }) {
  const { locale } = useLocale();
  const en = locale === 'en';
  const name = session.venue === 'golf' ? 'Tràng An Golf & Resort'
    : session.venue === 'tour' ? (en ? 'Ninh Binh heritage sites' : 'Các điểm di sản Ninh Bình')
    : 'Wyndham Grand Vedana Ninh Bình';
  const query = session.venue === 'tour' ? 'Ninh Binh Vietnam' : name;
  return <details className="session-location">
    <summary><MapPin size={16} /><span>{name}</span><small>{en ? 'Map & transport' : 'Bản đồ & di chuyển'}</small></summary>
    <div className="session-location-content">
      <p>{session.venue
        ? (en ? 'Transport outside the resort is arranged by the organising committee.' : 'Ngoài khu nghỉ dưỡng: di chuyển bằng xe do BTC sắp xếp.')
        : (en ? 'Within Wyndham: travel by electric buggy.' : 'Trong nội khu Wyndham: di chuyển bằng xe điện.')}</p>
      {session.venue === 'tour' && <p>{en ? 'The exact route and meeting point will be announced by the organising committee.' : 'Tuyến tour và điểm tập trung cụ thể sẽ được BTC thông báo.'}</p>}
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{en ? 'Open Google Maps ↗' : 'Mở Google Maps ↗'}</a>
    </div>
  </details>;
}
