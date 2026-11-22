# NYC 2027 · Interface

Next.js App Router, TypeScript, Tailwind CSS 4. Nội dung tiếng Việt dựa trên bảng giá và lịch trình dự kiến được cung cấp. Ảnh/logo lấy từ website demo NYC 2027 do khách hàng cung cấp, lưu tại `public/images`.

## Chạy local

```sh
pnpm install
pnpm dev
```

- Trang sự kiện: `http://localhost:3000`
- Quản trị mẫu: `http://localhost:3000/admin`
- Kiểm tra: `pnpm typecheck`, `pnpm test`, `pnpm build`.

Dev sử dụng Webpack để tránh lỗi PostCSS/Turbopack trên môi trường Windows hiện tại; build production vẫn sử dụng mặc định của Next.js.

## Đã có

- Landing responsive, lịch trình theo ngày, địa điểm/bản đồ, lưu trú, di chuyển, FAQ.
- Chọn combo theo member/non-member, chọn dịch vụ, tính tổng cho **một người/đơn**.
- Priority đến hết 12/12/2026 theo múi giờ Việt Nam, sau đó chuyển giá Impactor. Không bán Early đã kết thúc.
- Form thông tin, tạo mã đơn duy nhất, QR **minh họa, không dùng để thanh toán**.
- Đơn mẫu lưu trong localStorage; trang admin mẫu tìm/lọc, xem đơn, xác nhận trạng thái và xem trước email.
- Không cho đăng ký đồng thời tour sáng 17/01 và golf vì trùng khung giờ.

## Giới hạn bản giao diện / tích hợp tiếp theo

Đây là frontend demo, chưa dùng để nhận đăng ký thật. Admin chưa có đăng nhập/phân quyền. Đơn không đồng bộ giữa thiết bị, có thể bị sửa qua trình duyệt; xóa dữ liệu trình duyệt sẽ mất đơn. Chưa thực hiện chuyển khoản, đối soát ngân hàng hoặc gửi email. Không lưu thông tin khách thật trong bản demo.

Để mở đăng ký thật: cần API và cơ sở dữ liệu, xác thực và phân quyền admin, xác thực giá phía server, thông tin tài khoản ngân hàng BTC/VietQR, mã đơn và giao dịch bền vững, quy trình đối soát có audit log, dịch vụ email, chính sách dữ liệu/đổi hủy, hạn mức dịch vụ và kênh hỗ trợ chính thức. Xác nhận của khách chỉ là báo đã chuyển khoản, không tự xác nhận thanh toán.

Handbook chi tiết, AI và Quest để các mốc sau; widget hiện tại chỉ dẫn đến nội dung có sẵn và ghi rõ AI sắp ra mắt.

Lộ trình đề xuất: mốc 27/11 ưu tiên landing + đăng ký cơ bản + admin; tiếp theo hoàn thiện handbook; sau đó AI và Quest. Cần BTC chốt nội dung còn thiếu trước khi vận hành thật.

Bản HTML tham khảo gốc được giữ nguyên trong thư mục dự án.
