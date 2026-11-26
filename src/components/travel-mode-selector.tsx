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
          <span>Full option: combo chương trình + 2 đêm Villa + xe khứ hồi + cả 3 tour nửa ngày + Golf Cup + tắm khoáng nóng.</span>
        </label>
        <label className={value === 'individual' ? 'travel-mode active' : 'travel-mode'}>
          <input type="radio" name="travel-mode" value="individual" checked={value === 'individual'} onChange={() => onChange('individual')} />
          <Compass size={24} aria-hidden="true" />
          <strong>Đi cá nhân</strong>
          <span>Combo chương trình, tự chọn đêm lưu trú, di chuyển và các trải nghiệm theo nhu cầu.</span>
        </label>
      </div>
      <p>Gói đoàn: combo và dịch vụ nhân số vé, mỗi villa tối đa 8 người. Đi cá nhân tự chọn dịch vụ và phòng khách sạn 2 người.</p>
    </fieldset>
  );
}
