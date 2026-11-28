import type { TravelMode } from '@/lib/event';
import { BusFront, Compass } from './icon';

type Props = { value: TravelMode; onChange: (mode: TravelMode) => void };

export default function TravelModeSelector({ value, onChange }: Props) {
  return (
    <fieldset className="travel-mode-selector">
      <legend>Bạn muốn tham dự theo hình thức nào?</legend>
      <div className="travel-mode-options">
        <label className={value === 'group' ? 'travel-mode active' : 'travel-mode'}>
          <input type="radio" name="travel-mode" value="group" checked={value === 'group'} onChange={() => onChange('group')} />
          <BusFront size={24} aria-hidden="true" />
          <strong>Đi theo đoàn</strong>
          <span>Một người đại diện mua vé cho cả đoàn, tự chọn khách sạn, villa và các dịch vụ.</span>
        </label>
        <label className={value === 'individual' ? 'travel-mode active' : 'travel-mode'}>
          <input type="radio" name="travel-mode" value="individual" checked={value === 'individual'} onChange={() => onChange('individual')} />
          <Compass size={24} aria-hidden="true" />
          <strong>Đi cá nhân</strong>
          <span>Chọn combo hoặc vé lẻ từng đêm, tự chọn lưu trú, di chuyển và trải nghiệm theo nhu cầu.</span>
        </label>
      </div>
      <p>Cả hai hình thức đều tự chọn dịch vụ. Khách sạn tính theo người; villa dành cho đoàn tối thiểu 8 người, làm tròn số căn mỗi 8 người.</p>
    </fieldset>
  );
}
