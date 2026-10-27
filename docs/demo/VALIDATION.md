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
