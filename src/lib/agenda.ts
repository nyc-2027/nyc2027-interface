export type LocalizedText = { vi: string; en: string };
type Session = { time: string; name: LocalizedText; description: LocalizedText; module?: boolean };
type ProgramDay = { date: string; weekday: LocalizedText; theme: LocalizedText; sessions: Session[] };

// Program supplied in Agenda.md. Times remain provisional until confirmed by COC.
export const program: ProgramDay[] = [
  {
    date: '15', weekday: { vi: 'THỨ SÁU', en: 'FRIDAY' },
    theme: { vi: 'Hội tụ', en: 'Convergence' },
    sessions: [
      { time: '14:00', name: { vi: 'Đại hội thường niên JCI Vietnam 2027 (GA 01/2027)', en: 'JCI Vietnam General Assembly 01/2027' }, description: {
        vi: 'Kỳ họp đầu tiên của nhiệm kỳ mới. Ban Điều hành Quốc gia (NBOD) và đại diện các chapter trên cả nước cùng ngồi lại để thống nhất định hướng, kế hoạch và các quyết sách cho năm 2027.',
        en: 'The first assembly of the new term. The National Board and chapter delegates from across Vietnam come together to set the direction, plans and key decisions for 2027.',
      } },
      { time: '19:00', name: { vi: 'Culture Night: 17 Sắc màu · 17 Mục tiêu', en: 'Culture Night: 17 Colours · 17 Goals' }, description: {
        vi: 'Mỗi chapter mang một Mục tiêu Phát triển Bền vững (SDG) của Liên Hợp Quốc lên sân khấu bằng trang phục và màn trình diễn của mình. 17 chapter thể hiện 17 mục tiêu, cùng kể chung một câu chuyện về tác động tích cực, nơi bản sắc địa phương gặp tầm nhìn toàn cầu.',
        en: 'Each chapter brings one UN Sustainable Development Goal to life through costume and performance. 17 chapters, 17 goals, one shared story of impact where local identity meets global vision.',
      } },
    ],
  },
  {
    date: '16', weekday: { vi: 'THỨ BẢY', en: 'SATURDAY' },
    theme: { vi: 'Kế thừa & Vinh danh', en: 'Heritage & Honour' },
    sessions: [
      { time: '07:00', module: true, name: { vi: 'Giải Golf Quốc tế NYC 2027', en: 'NYC 2027 International Golf Tournament' }, description: {
        vi: 'Giải golf giữa núi non Ninh Bình, nơi doanh nhân trong và ngoài nước giao lưu, kết nối và cùng nhau thi đấu.',
        en: "A friendly competition set among Ninh Binh's limestone landscapes, connecting leaders and entrepreneurs from Vietnam and abroad.",
      } },
      { time: '08:30', name: { vi: 'Lễ Nhậm chức JCI Thăng Long 2027', en: 'JCI Thang Long Inauguration Ceremony 2027' }, description: {
        vi: 'Ban Điều hành mới của JCI Thăng Long nhận nhiệm vụ ngay trên vùng đất Cố đô, tiếp nối truyền thống và mở ra một chặng đường mới.',
        en: "JCI Thang Long's new leadership takes office in the ancient capital, carrying the legacy forward into a new chapter.",
      } },
      { time: '13:00', name: { vi: 'JCI Vietnam Awards 2027', en: 'JCI Vietnam Awards 2027' }, description: {
        vi: 'Vinh danh những cá nhân, dự án và chapter đã tạo nên tác động nổi bật trong năm qua. Họ là những người đang viết tiếp di sản của JCI Vietnam.',
        en: "Celebrating the individuals, projects and chapters behind the year's most outstanding impact: those writing the next chapter of JCI Vietnam's heritage.",
      } },
      { time: '19:00', name: { vi: 'Lễ Nhậm chức JCI Vietnam 2027', en: 'JCI Vietnam Inauguration Ceremony 2027' }, description: {
        vi: 'Đêm trang trọng nhất của NYC 2027. Ban Điều hành Quốc gia nhiệm kỳ mới chính thức nhận nhiệm vụ, khởi đầu một năm hành động vì tác động bền vững.',
        en: 'The defining night of NYC 2027. The new National Board officially takes office, opening a year of action for lasting impact.',
      } },
    ],
  },
  {
    date: '17', weekday: { vi: 'CHỦ NHẬT', en: 'SUNDAY' },
    theme: { vi: 'Lan tỏa', en: 'Momentum' },
    sessions: [
      { time: '07:30', name: { vi: 'Giải Pickleball Giao hữu NYC 2027', en: 'NYC 2027 Pickleball Friendly' }, description: {
        vi: 'Buổi sáng sôi động để các chapter cùng giao lưu, rèn sức và lan tỏa tinh thần đồng đội trước khi lên đường.',
        en: 'An energetic morning of friendly matches across chapters before the journey home.',
      } },
      { time: '08:00', module: true, name: { vi: 'Tour khám phá Di sản Ninh Bình', en: 'Ninh Binh Heritage Tour' }, description: {
        vi: 'Tràng An, Tam Cốc, Hoa Lư: một hành trình về miền di sản để mỗi đại biểu mang theo cảm hứng cho năm mới.',
        en: 'Trang An, Tam Coc, Hoa Lu: a journey through world heritage so every delegate takes inspiration home for the year ahead.',
      } },
    ],
  },
];
