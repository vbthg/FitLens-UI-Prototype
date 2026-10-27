# Kiểm tra bản bàn giao demo — 27/10/2026

Đối tượng: bản sao trong repo này, không phải một bản deploy hay ứng dụng native.

## Đã chạy

- Chrome headless, mô phỏng 390 × 844, múi giờ Asia/Ho_Chi_Minh; các trang được phục vụ qua máy chủ HTTP local.
- Mở 19 trang đang được phát hành: Home, Steps, recap đi bộ, Setup plan, Reminders, Workouts, chi tiết bài tập, đang tập, Camera setup, workout review, Chat, Insights, recap tháng, Food, Activity, Plan, Profile, Rhythm, recap năm.
- Không ghi nhận lỗi JavaScript hoặc phản hồi HTTP lỗi trong lượt mở trang và kịch bản chính.
- Home → Steps: đúng liên kết; số bước 3.150; đổi Distance/Flights/Steps; mở/đóng bài liên quan.
- Recorded walk → recap đi bộ; đổi Elevation; kéo Explore your route; chọn cảm nhận Good.
- Food: vào công thức, quay lại, tìm “trứng” có kết quả.
- Insights: mở/đóng bài, mở thẻ recap năm.
- Recap năm: chọn chương 5/8/11; tạo và nhận tải xuống `FitLens-2025-demo-poster.png` thành công.
- Recap tháng: dùng ArrowRight chuyển trang 1 → 2.
- Plan: Focus → Week → Setup → Preview my week → Apply week; xuất hiện 3 planned cards, không còn nhãn bản nháp.
- Kiểm tra tham chiếu file trong HTML/CSS: không có tài nguyên hoặc trang local bị thiếu.
- Kiểm tra nội dung bản sao: không có thư mục handoff/private-review, session secret, cấu hình kết nối phiên hoặc tệp môi trường.

## Giới hạn của kiểm tra

Đây là kiểm tra tự động và xem ảnh render, chưa phải buổi diễn tập trên máy teammate/máy chiếu. Chưa xác nhận Safari/iPhone thật, camera, Health, AI trực tuyến, thông báo thật, hiệu năng thiết bị yếu hoặc độ chính xác y khoa. Không có video dự phòng đi kèm. Các chức năng dùng dữ liệu mẫu được ghi trong README.

Ảnh `home.png`, `steps.png`, `walk.png`, `food.png`, `review.png`, `year.png` chụp từ bản sao đã mở. Không phải dữ liệu sức khỏe thật. Trước ngày demo, người trình bày cần chạy lại đường demo trên đúng thiết bị và phiên bản mình dùng.

## Bổ sung: luồng workout và lịch tập trong README

Đã chạy qua HTTP local trong cùng tab, trên phiên trình duyệt sạch:

1. Rhythm: đặt goal 3 buổi.
2. Plan: Suggest my week → Focus/Week/Setup → Preview my week → Apply week.
3. Mở buổi đầu tiên từ Plan → Start Workout.
4. Nhập KG = 0 và REPS = 10 cho hiệp đầu → Complete Set 1 → thấy trạng thái rest → Skip rest.
5. Session options → Finish & check in → vào recap có `completed` ID, số set là 1.
6. Đổi effort → Finish check-in → Back to Today → hiển thị 1 of 3 sessions.
7. Quay lại Plan: đúng 1 planned card có trạng thái completed.

Kết thúc sớm chỉ dùng để rút ngắn demo; README nêu rõ không coi một hiệp là đã tập đủ toàn bộ chương trình. Không dùng mở file trực tiếp để chứng minh trạng thái liên thông. Ảnh `plan.png` và `workout.png` chụp trong lượt kiểm tra này.
