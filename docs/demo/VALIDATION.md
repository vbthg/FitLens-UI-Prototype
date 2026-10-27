# Kiểm tra bản bàn giao — lượt biên tập UI, 27/10/2026

Bản này cập nhật cách viết chức năng, font/lề/điều khiển dùng chung, dock kính nhẹ và cấu trúc Weekly Rhythm. Giữ các thay đổi mới đã có trong workspace: tab Workouts, bỏ recap route cũ, recap năm 8 chương.

## Kiểm tra giao diện

- Chrome headless, viewport 320/390/430 × 844; không phát hiện tràn ngang hoặc lỗi JavaScript trong Home, Plan, Workouts, chi tiết/đang tập/recap, Steps, Food và Insights.
- Rhythm: new, active, complete, recovery, comeback; tiến độ tuần đứng trước số tuần liên tiếp. Mở chi tiết buổi, lịch sử tuần, đặt mục tiêu cho tuần sau và pause/resume đều hoạt động.
- Mục tiêu 2–5 buổi ở 320px không tràn hàng. Với 5 buổi ở màn hẹp, sỏi chia thành 2 hàng để nhãn không dính nhau. Icon phân biệt Walk/Workout khi dữ liệu có loại hoạt động tương ứng; fixture hiện tại minh họa workouts.
- Các nhãn chính đã đo trong Rhythm có tương phản khoảng 4,87–5,83:1 trên nền thực của chúng. Đây là kiểm tra các nhãn được chọn, không phải chứng nhận accessibility cho toàn bộ app.
- Giữ font serif Lora ở tiêu đề Food; các thành phần chức năng dùng Nunito. Giữ mặt trời, mascot, thẻ kiến thức và hiệu ứng recap.

## Kiểm tra trên bản sao qua HTTP local

- Mở 19 URL: Home, Steps, chuyển hướng recap đi bộ cũ, Setup plan, Reminders, Workouts, chi tiết bài tập, đang tập, Camera setup, workout review, Chat, Insights, recap tháng, Food, chuyển hướng Activity cũ, Plan, Profile, Rhythm, recap năm.
- Không ghi nhận lỗi JavaScript hoặc tài nguyên HTTP lỗi trong lượt mở trang và tour.
- Home → Steps: số 3.150, đổi Steps/Distance/Flights, mở/đóng bài đọc.
- Food: mở công thức, quay lại và tìm “trứng”.
- Insights → recap năm; chọn Your familiar moves, Heavier than you think, Your year, to keep. Tải PNG poster thành công.
- Recap tháng: ArrowRight chuyển sang trang 2.
- Luồng dữ liệu thật của prototype, cùng tab/server: đặt goal 3 → Suggest my week → Preview my week → Apply week → mở buổi → Start Workout → ghi 1 hiệp → rest → Skip rest → Finish & check in → recap đúng 1 set → Finish check-in → Home 1 of 3 → Plan có 1 buổi Done.
- Các kiểm tra model training, steps và profile đã chạy thành công.

## Giới hạn và hướng dẫn

Chưa diễn tập trên máy teammate/máy chiếu hoặc điện thoại thật. Camera, Health, AI, thông báo và nội dung sức khỏe chưa được xác thực như một sản phẩm native. Chưa có video dự phòng. Dùng README tour 4 phút và tự diễn tập trên đúng máy trước buổi trình bày.

Ảnh README được chụp từ bản sao hiện tại. `review.png` là recap mẫu; `plan.png` và `workout.png` từ luồng đã ghi một hiệp. `rhythm.png` dùng trạng thái active. Ảnh `walk.png` còn lưu từ bản trước nhưng không còn là màn của tour hiện tại.

## Cập nhật 28/10/2026 — Training focus, hồ sơ và bản sao hiện tại

- Kiểm tra lại trên chính thư mục repo được phục vụ qua HTTP local: 19 trang hiện có, dẫn hướng recap tháng, các chương recap năm và tải poster PNG; không có lỗi JavaScript hay tài nguyên thiếu.
- Luồng Plan → bắt đầu tập → hoàn thành 1 set → nghỉ/bỏ qua nghỉ → kết thúc sớm → recap thật → Home 1/3 → Plan đánh dấu hoàn thành đã qua.
- Kiểm tra thêm onboarding tùy chọn, lựa chọn giới tính/hình minh họa độc lập trong Profile, hình heatmap tự đọc hồ sơ và không có bộ chọn nam/nữ ngay trên biểu đồ.
- Training focus: dữ liệu thật chỉ tính set hoàn thành; dữ liệu mẫu có nhãn rõ, tuần/tháng/năm lần lượt 28/160/1.752 set tại mốc 28/10/2026; chuyển qua lại không ghi dữ liệu mẫu vào lịch sử thật. Biểu đồ mẫu tháng 9 có 12 buổi / 204 set.
- Kiểm tra heatmap, xem trước workout/từng bài, chọn ngày và bố cục ở viewport 320/390/430px. Đây là kiểm tra Chrome headless với kích thước mobile, chưa phải kiểm tra thiết bị vật lý.
- Thẻ Training focus dùng các dải xanh phẳng, tụ phía trên và mở rộng dần sang trái ở đáy; không có gradient hay icon cơ thể. Có nguồn/giấy phép MIT cho SVG giải phẫu trong assets/anatomy/.
