# FitLens — Hướng dẫn demo cho người thuyết trình

**Bản bàn giao: 27/10/2026 · Prototype giao diện mobile · Tiếng Việt cho người demo, giao diện tiếng Anh.**

FitLens giúp người dùng tạo nhịp vận động phù hợp, ghi nhận cảm nhận sau buổi tập và tìm gợi ý ăn uống, kiến thức liên quan. Điểm nhấn là cách trình bày gần gũi: mascot có biểu cảm, số liệu gắn với hình minh họa và không khuyến khích tập bất chấp đau.

Đây là **HTML/CSS/JavaScript prototype tương tác**, chưa phải ứng dụng điện thoại kết nối thiết bị. Đọc mục 1–4 trước để trình bày; các mục sau dùng khi diễn tập hoặc trả lời câu hỏi. Các ảnh bên dưới được chụp từ chính bản sao này. Xem [biên bản kiểm tra](docs/demo/VALIDATION.md) để biết phạm vi đã thử.

## 1. Mở và chuẩn bị trong 5 phút

1. Clone hoặc tải ZIP repo, giải nén; mở terminal tại thư mục có `home.html`.
2. Nếu đã cài Python, chạy:

   ```sh
   python -m http.server 8000 --bind 127.0.0.1
   ```

   Trên Windows có thể dùng `py -m http.server 8000 --bind 127.0.0.1` nếu máy dùng lệnh `py`.
3. Mở [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Nếu máy không có Python, dùng Live Server của VS Code và giữ cùng một địa chỉ trong cả buổi.
4. Dùng Chrome hoặc Edge trên laptop. Nhấn F12 → bật thanh mô phỏng điện thoại → chọn **Responsive, 390 × 844**, mức zoom trang 100%. Thu phóng phần xem trước cho vừa chiều cao màn hình trình chiếu. Không cần giả lập camera hoặc GPS.
5. Đợi font và ảnh hiện đủ. Đóng thông báo hệ điều hành, thử trình chiếu và kiểm tra con trỏ đủ dễ nhìn.
6. Mở sẵn các đường dẫn trong mục 2. Chạy thử các thao tác ở mục 3 trước khi lên lớp.

**Nếu chỉ xem nhanh:** mở `home.html` trực tiếp cũng có thể hiển thị, nhưng demo chính thức nên chạy bằng server để địa chỉ và dữ liệu trình duyệt ổn định. Sau khi server đã chạy và tải trang, các tài nguyên UI chính nằm trong repo; không cần gọi AI, bản đồ hay Health trực tuyến.

## 2. Thứ tự mở trang và chọn thời lượng demo

**Luồng chính bắt buộc có lịch tập và workout:** Today → Plan → chi tiết buổi → đang tập → recap → Home/Plan. Các phần Walk, Food và story bổ sung vào sau luồng này; không dùng chúng để thay toàn bộ nghiệp vụ tập luyện.

| Thứ tự | Trang | Dùng thế nào |
|---|---|---|
| 1 | [Today](http://127.0.0.1:8000/home.html) | Bắt đầu và quay lại xem tiến độ sau buổi tập. Dùng trạng thái thật của prototype, không thêm `preview`. |
| 2 | [Plan](http://127.0.0.1:8000/plan.html) | Gợi ý tuần, xem bản nháp, Apply week và mở một buổi. |
| 3 | Chi tiết buổi → đang tập → recap | Đi tiếp từ Plan trong **cùng một tab** để giữ đúng buổi và số hiệp vừa nhập. Không mở recap mẫu thay cho kết quả của luồng này. |
| Dự phòng | [Thư viện Workouts](http://127.0.0.1:8000/workouts.html) | Chọn một workout nếu không còn ngày phù hợp để demo từ lịch. |
| Mở rộng | [Steps](http://127.0.0.1:8000/steps.html), [recap đi bộ](http://127.0.0.1:8000/post-walk-restored.html) | Mặt trời, biểu đồ, route và cảm nhận sau đi bộ. |
| Mở rộng | [Food](http://127.0.0.1:8000/food.html?preview=walk) | Danh mục 30 món, công thức và tìm kiếm/lọc. |
| Kết | [Insights](http://127.0.0.1:8000/insights.html) → [recap năm](http://127.0.0.1:8000/yearly-recap.html) | Thẻ kiến thức và story năm với chuyển màu, minh họa, poster. |

- **3 phút:** Today → Plan (chuẩn bị sẵn lịch đã Apply) → workout (một hiệp) → recap → kết quả Home. Không bỏ cả Plan hoặc Workout để chỉ diễn màn đẹp.
- **5 phút:** luồng chính đầy đủ ở mục 3, kết bằng một đoạn ngắn recap năm.
- **7–8 phút:** luồng 5 phút + Walk/route khoảng 1 phút + Food khoảng 40 giây + mở một bài kiến thức. Recap sau tập và story vẫn là điểm nhấn thị giác.

![Today — nhịp tuần và bản sắc FitLens](docs/demo/home.png)

## 3. Kịch bản chính — lịch tập → workout → recap, khoảng 5 phút

### Chuẩn bị trước khi bấm giờ

1. Dùng một phiên trình duyệt sạch theo mục 6 và cùng địa chỉ server. Không mở file trực tiếp khi cần chứng minh dữ liệu liên thông: trình duyệt có thể lưu `file://` khác nhau giữa từng trang.
2. Mở `streak.html` **không có `preview`**, bấm **Set a weekly goal**, chọn **3** và lưu bằng **Set my goal**. Nếu đã có mục tiêu 3 buổi thì giữ nguyên. Trở về `home.html`. Việc này giúp đoạn kết có tiến độ thật **1 of 3 sessions**.
3. Đảm bảo Plan không còn bản nháp cũ và không có buổi đang chạy. Nếu diễn tập đã tạo lịch sử, chuẩn bị phiên sạch từ trước; không xóa dữ liệu trong lúc nói.
4. Nếu tuần hiện tại còn ít hơn 3 ngày trống, chọn mục tiêu **2** khi còn 2 ngày; nếu chỉ còn 1 ngày, demo gợi ý lịch **tuần tới**, rồi dùng một workout trong thư viện để minh họa tập hôm nay. Nói rõ hai phần này. Dòng cuối ở Home sẽ theo mục tiêu Rhythm đã đặt, không nhất thiết bằng số buổi của lịch vừa gợi ý.
5. Mở sẵn Insights/recap năm ở tab dự phòng. Các tab này phục vụ phần kết thị giác; giữ luồng Plan → Workout → Review trong cùng tab chính.

### 0:00–0:20 — Today: bắt đầu từ nhu cầu người dùng

- **Mở:** `home.html` không có `preview`.
- **Thao tác:** chỉ nhanh mascot, tiến độ tuần và đường vào **Your plan** hoặc tab đáy **Plan**.
- **Lời dẫn:** “FitLens giúp người dùng lên lịch phù hợp, thực hiện buổi tập và ghi lại cảm nhận sau đó. Mình sẽ demo một vòng từ lên kế hoạch đến kết quả.”
- **Kỳ vọng:** tiến độ thật đang lưu là 0/3 nếu đã chuẩn bị phiên mới. Không dùng `home.html?preview=active` cho đoạn chứng minh tăng số buổi.

### 0:20–1:25 — Plan: lựa chọn → bản nháp → lịch được áp dụng

1. Bấm tab **Plan**, rồi **Suggest my week.**
2. Qua **Focus → Week → Setup**. Dùng **Build a habit**, **3 buổi**, **30 min** khi đủ ngày; giữ các ngày còn trống mà giao diện đã chọn. Chọn **At home / Bodyweight** để demo đơn giản; không đánh dấu vùng chấn thương trong luồng chính.
3. Bấm **Preview my week**. Dừng một nhịp ở nhãn **A SUGGESTION, STILL YOURS TO CHANGE**: đây là bản nháp, chưa phải lịch đã lưu áp dụng.
4. Bấm **Apply week**. Chỉ vào các thẻ buổi trên lịch; tên bài, ngày và thời lượng đã rõ. Không chuyển sang tập từ một bản nháp chưa Apply.
5. Có thể chỉ nhanh **Set times together**; phần đặt giờ hoặc kéo đổi ngày dành cho mục 4 nếu còn thời gian.

**Lời dẫn:** “Người dùng chọn mục tiêu, thời lượng và điều kiện tập. FitLens đề xuất một tuần để xem trước, người dùng vẫn có thể sửa rồi mới áp dụng.”

**Kỳ vọng:** nhãn bản nháp biến mất, các buổi xuất hiện trên lịch. Gợi ý hiện chạy bằng danh mục và luật cục bộ, chưa gọi AI trực tuyến. Nếu bước Focus đã có thông tin hồ sơ, màn có thể bắt đầu ở Week; đi theo các bước đang hiện.

![Plan — lịch sau khi áp dụng gợi ý](docs/demo/plan.png)

### 1:25–1:55 — Chi tiết workout: người dùng biết mình sắp tập gì

- **Thao tác:** bấm tên buổi đầu tiên trên Plan (ưu tiên buổi hôm nay). Xem tiêu đề, danh sách **Your lineup**, số sets/reps, thời gian nghỉ và dụng cụ.
- **Tùy chọn ngắn:** bấm một bài trong danh sách để xem thiết lập rồi đóng; chưa sửa số liệu nếu chưa diễn tập.
- **Lời dẫn:** “Mỗi buổi có danh sách bài và thông số cụ thể. Người dùng xem trước hoặc điều chỉnh trước khi bắt đầu.”
- **Tiếp:** bấm **Start Workout**. Nếu bị chặn vì vùng cần tránh, đó là kiểm tra ràng buộc; quay lại sửa lựa chọn hoặc dùng workout phù hợp, không cố bỏ qua cảnh báo.

### 1:55–2:55 — Trong buổi tập: ghi một hiệp, nghỉ, rồi kết thúc demo

1. Cho xem bài hiện tại, đồng hồ buổi tập, **Your sets**, cột **KG / REPS** và nút **Complete Set 1**.
2. Ở hàng **set 1**, nhập **KG = 0** nếu là bodyweight và **REPS = 10** để làm dữ liệu minh họa. Với bài dùng tạ, dùng mức minh họa đã chuẩn bị và nói rõ đang mô phỏng. Không để trống reps rồi bấm hoàn thành.
3. Bấm **Complete Set 1** hoặc nút ✓ ở hàng đầu. Chỉ vào dấu đã ghi và bảng nghỉ **Rest easy** nếu xuất hiện. Bấm **Skip rest** để không chờ hết thời gian nghỉ trong lớp.
4. Chỉ nhanh **Exercise guide**, danh sách bài và **Check my form**. Camera là nhánh bổ sung, không cần rời màn tập trong luồng 5 phút.
5. Bấm **Session options** (••• phía trên) → **Finish & check in**.

**Lời dẫn:** “Mình mô phỏng ghi một hiệp để cho thấy cách nhập kết quả và nghỉ giữa hiệp. Để tiết kiệm thời gian demo, mình kết thúc buổi sớm ở đây rồi xem phần check-in.”

**Kỳ vọng:** đi tới recap có ID buổi vừa ghi trong địa chỉ, không phải recap độc lập. Cần hoàn thành ít nhất **một hiệp hợp lệ**; chưa có hiệp nào mà Finish thì bản hiện tại có thể về Activity và không tạo recap. Không nói người dùng đã hoàn tất toàn bộ chương trình khi mới nhập một hiệp. Prototype hiện có thể đánh dấu buổi đã kết thúc là completed ngay cả khi kết thúc sớm; đây chưa phải tiêu chuẩn đánh giá chất lượng buổi tập.

![Workout — các hiệp và điều khiển buổi tập](docs/demo/workout.png)

### 2:55–3:40 — Recap: kết quả vừa ghi và mascot phản hồi

- **Thao tác:** xem các khối tổng kết; kéo thanh độ mệt qua vài mức rồi dừng khoảng **5–6**, quan sát mascot. Bấm **Finish check-in**, sau đó **Back to Today** trong bảng xác nhận.
- **Lời dẫn:** “Sau tập, FitLens tổng kết phần vừa ghi và hỏi mức độ người dùng cảm nhận. Mascot phản hồi theo check-in, thay vì chỉ đưa ra một bảng số.”
- **Kỳ vọng:** luồng thử một hiệp hiển thị **1 set**, không phải 18 set của recap mẫu. Giá trị so sánh hình gấu tùy khối lượng vừa nhập; bodyweight 0 kg có thể không tạo con số volume ấn tượng. Không nhập khối lượng giả lớn để làm đẹp kết quả.
- **Nếu muốn cho xem đầy đủ phần minh họa đẹp:** mở riêng `workout-review.html` không có `completed` ở nhánh mở rộng và giới thiệu là **recap mẫu**, không thay nó vào luồng dữ liệu vừa tạo.

![Recap mẫu — hình gấu và bố cục tổng kết; số này không phải kết quả một hiệp demo](docs/demo/review.png)

### 3:40–4:10 — Chứng minh kết quả đã đi qua các màn

- **Thao tác:** tại Today xem nhịp tuần **1 of 3 sessions** (nếu đã đặt goal 3). Vào **Plan**, chỉ vào buổi vừa tập có trạng thái **Done**. Có thể mở Activity để xem lịch sử nếu còn thời gian.
- **Lời dẫn:** “Kết quả được ghi lại trong prototype: tiến độ tuần tăng và buổi trên lịch đổi trạng thái. Người dùng không cần nhập lại ở từng màn.”
- **Lưu ý:** số bước mẫu và recap năm không tự thay đổi theo buổi vừa tập. Dùng Home không có `preview`; các trang preview luôn hiển thị fixture riêng.

### 4:10–4:50 — Kết bằng điểm nhấn thị giác: Insights → recap năm

- **Thao tác:** bấm **Insights**, mở thẻ **2025**, xem bìa rồi chọn chương **Your familiar loop** hoặc **Heavier than you think**, sau đó **Your year, to keep**. Dùng các đoạn tiến độ đầu trang để chọn, không cần chạy đủ 11 chương.
- **Lời dẫn:** “Ngoài trải nghiệm từng buổi, FitLens còn kể lại hành trình bằng recap và poster. Đây là dữ liệu một năm giả lập để trình diễn thiết kế, không tổng hợp từ một hiệp vừa demo.”
- **Nếu còn thời gian:** thêm Walk và Food theo mục 4; các phần đẹp nhất vẫn có hướng dẫn đầy đủ ở đó.

![Recap năm — bìa story](docs/demo/year.png)

### 4:50–5:00 — Kết luận

“Luồng vừa rồi đi từ lập lịch, tập, ghi kết quả đến check-in và xem tiến độ. Camera, Health, AI và thông báo hiện ở mức thiết kế/mô phỏng và cần tích hợp thật ở ứng dụng điện thoại.”

## 4. Phần mở rộng — giữ những màn đẹp và có hướng dẫn chi tiết

Sau luồng chính, chọn thêm các đoạn dưới theo thời gian. **Walk và Food phù hợp bản 7–8 phút; recap mẫu sau tập có thể mở riêng để giới thiệu đầy đủ minh họa.** Các mục Plan/Workout bên dưới cũng là tài liệu tra cứu khi giảng viên hỏi sâu hơn.

### Steps: số liệu có ngữ cảnh

- **Thao tác:** bấm thẻ **Steps**; nhìn mặt trời, cuộn xuống Progress và Short-term overview. Chuyển **Steps → Distance → Flights**. Chỉ thử 1–2 điểm trên Progress để minh họa đọc số liệu.
- **Lời dẫn:** “Số bước được đặt cạnh thói quen thường ngày, không chỉ một ngưỡng cố định. Người dùng có thể xem diễn biến trong ngày và tổng quan nhiều ngày.”
- **Lưu ý:** Steps dùng bộ dữ liệu mẫu cố định tháng 10/2026; “Today” ở màn này không tự chuyển theo ngày máy. Flights là dữ liệu mẫu. Không nói đang đọc trực tiếp Apple Health.
- **Cuộn cuối:** có **Recorded walk** dạng hàng ngang và **More about walking**. Đưa con trỏ vào thẻ bài, mở một bài rồi đóng để cho thấy quay lại nguyên vị trí.

![Steps — mặt trời và thống kê](docs/demo/steps.png)

### Recap đi bộ: route và cảm nhận

- **Mở:** bấm **Morning Lake Loop** trong Recorded walk, hoặc tab recap đi bộ đã mở sẵn.
- **Thao tác:** xem route; kéo **Explore your route**, chuyển **Pace / Elevation / Heart rate**. Cuộn tới **How do you feel now?**, chọn một cảm nhận.
- **Lời dẫn:** “Sau một chuyến đi bộ, người dùng nhìn lại đường đi và diễn biến hoạt động, rồi ghi nhận cơ thể cảm thấy thế nào.”
- **Kỳ vọng:** điểm trên route, giá trị và biểu đồ phản hồi theo thao tác. Route, GPS, độ cao và nhịp tim đều là minh họa.
- **Giới hạn cần biết:** nút **Finish check-in** hiện trình diễn xác nhận/check-in; không dùng nó để chứng minh buổi đi bộ đã tăng Rhythm hoặc tạo một hoạt động thật. Muốn minh họa ghi hoạt động và tăng tiến độ, dùng Activity ở mục 4.

![Recap đi bộ — route minh họa](docs/demo/walk.png)

### Food: chăm sóc cả phần ăn uống

- **Mở:** tab `food.html?preview=walk`.
- **Thao tác:** lướt hàng món gợi ý; chọn một món; xem nguyên liệu và cách làm. Quay lại; nếu cần, tìm `trứng` trong ô **Dish or ingredient**.
- **Lời dẫn:** “Gợi ý món ăn được gắn với ngữ cảnh sinh hoạt. Người dùng có thể tìm món, xem công thức và ghi lại bữa ăn thay vì phải nhập calo chính xác.”
- **Lưu ý:** preview Walk là ngữ cảnh giả lập; danh mục và luật gợi ý chạy cục bộ. Đây chưa phải tư vấn dinh dưỡng cá nhân từ AI. Ảnh món ăn là tài nguyên demo; không tuyên bố toàn bộ ảnh do nhóm chụp.

![Food — gợi ý và danh mục món](docs/demo/food.png)

### Insights và kiến thức đúng ngữ cảnh

- **Mở:** tab Insights; cuộn tới **Daily Insights**.
- **Thao tác:** vuốt một hàng thẻ, mở bài và đóng.
- **Lời dẫn:** “Kiến thức được đọc trong Insights và cũng xuất hiện cuối những màn liên quan. Cùng một bài dùng chung nội dung và giao diện đọc.”
- **Lưu ý:** bài viết hiện là nội dung mẫu của thư viện prototype; không trình bày như tài liệu y khoa đã thẩm định.

### Recap năm: kết thúc bằng phần thị giác nổi bật nhất

- **Thao tác:** trở lại đầu Insights, bấm thẻ recap năm **2025**, hoặc dùng tab đã mở sẵn.
- **Nên cho xem:** bìa **Your year in motion**; chương **Your familiar loop** (bản đồ); chương **Heavier than you think** (so sánh khối lượng); chương cuối **Your year, to keep** (poster). Không cần diễn đủ cả 11 chương.
- **Điều khiển:** dùng mũi tên đầu trang hoặc các đoạn tiến độ để chọn chương. Story có tự chạy; giữ tay/con trỏ nhấn trên vùng nội dung để tạm dừng khi cần nói, thả để tiếp tục. Dùng nút điều hướng là cách chắc chắn khi đang trình chiếu.
- **Lời dẫn:** “Những hoạt động nhỏ được kể thành một câu chuyện dài hạn. Recap biến dữ liệu thành ký ức và một poster có thể lưu lại.”
- **Kỳ vọng:** màu nền, minh họa và thống kê thay đổi theo chương. Nút **Save your poster** tải tệp; chỉ bấm nếu đã diễn tập tải tệp trên máy trình chiếu.
- **Phải nói rõ:** đây là **năm 2025 giả lập**; không tổng hợp từ các hoạt động vừa nhập và không phải sức khỏe của người thuyết trình.

![Recap năm — bìa story](docs/demo/year.png)


### A. Plan — thể hiện luồng nghiệp vụ, khoảng 1–2 phút

1. Mở `plan.html`. Nếu lịch đã có dữ liệu cũ, xem mục 6 trước; không reset ngay khi đang trình bày.
2. Bấm **Suggest my week.**; đi qua **Focus → Week → Setup**. Chọn mục tiêu, số buổi, thời lượng, ngày, nơi tập và dụng cụ bằng các lựa chọn đang hiện.
3. Bấm **Preview my week**. Cho xem nhãn bản nháp và các buổi được gợi ý; bấm **Apply week** để áp dụng.
4. Có thể mở một buổi, đổi ngày hoặc đặt giờ. **Set times together** minh họa đặt giờ chung cho các buổi còn thiếu giờ.
5. Giải thích: lịch được tạo từ danh mục và luật cục bộ theo lựa chọn, **không gọi LLM**. Nếu tuần hiện tại còn quá ít ngày, chọn tuần tới bằng mũi tên hoặc **Plan next week** khi được gợi ý.
6. Nếu có bản nháp cũ, trang sẽ đề nghị **Review draft**. Xử lý nó trong lúc chuẩn bị, không coi đây là lỗi.

### B. Activity — ghi hoạt động thực sự vào trạng thái prototype

- Tab đáy hiện là **Today / Activity / Plan / Insights**. Workouts là thư viện bài tập được mở từ Activity hoặc đường dẫn trực tiếp `workouts.html`.
- Mở `activity.html`: có các lựa chọn ghi/tạo hoạt động. Dùng một hoạt động mẫu của người trình bày, điền ngày hôm nay hoặc ngày đã qua và thời lượng hợp lệ; không nhập ngày tương lai.
- Hoạt động ghi thủ công được lưu trong trình duyệt và đồng bộ vào mô hình Rhythm. Đây là thao tác nhập, chưa phải GPS hoặc Health tự đồng bộ.
- Đi bộ tính theo hoạt động được ghi; **số bước hằng ngày là tổng hợp riêng**, không tự biến thành nhiều buổi tập và không nên cộng trùng vào quãng đường route.

### C. Workout → Camera → Review

- `workouts.html` → chọn tên một bài → chi tiết bài → **Start Workout**.
- Trong màn đang tập có nhập số, đánh dấu hiệp, nghỉ và báo đau. Chỉ chạy một phần ngắn nếu chưa diễn tập hoàn tất cả buổi.
- Camera có màn thiết lập, khung người minh họa và trạng thái **Ready / Adjust view**. **Camera đang tắt:** không quay, không đếm rep, không chấm tư thế.
- Nút báo đau dừng buổi và Pause Rhythm; không dùng trong kịch bản vui vẻ chính vì nó thay đổi trạng thái nghỉ. Khi được hỏi về an toàn, mở một lượt riêng và giải thích rõ.
- Recap đẹp có thể mở trực tiếp `workout-review.html` nếu không đủ thời gian hoàn thành buổi tập; nói rõ đang xem mẫu.

### D. Rhythm — dùng trạng thái mẫu, không đợi tích lũy nhiều tuần

| Trạng thái | Đường dẫn |
|---|---|
| Bắt đầu | `streak.html?preview=new` |
| Đang theo mục tiêu | `streak.html?preview=active` |
| Đủ mục tiêu | `streak.html?preview=complete` |
| Nghỉ phục hồi | `streak.html?preview=recovery` |
| Trở lại | `streak.html?preview=comeback` |

Preview tách khỏi tiến độ thật đang lưu; không dùng các trang mẫu để chứng minh cộng buổi trực tiếp. Muốn thử dữ liệu thật của prototype, dùng `streak.html` không có `preview` và đặt mục tiêu trước.

Đủ số buổi là tuần được tính hoàn thành ngay, không phải đợi Chủ Nhật. Tuần Pause giữ chuỗi trước đó nhưng không tăng tuần hoàn thành. Tuần thiếu mục tiêu không được bảo vệ sẽ ngắt chuỗi; lịch sử vẫn giữ. Chưa có XP, vật phẩm hay khiên tích lũy.

### E. Những phần đẹp khác

- **Monthly recap:** Insights → thẻ **September**, hoặc `monthly-recap.html`. Có 2 trang; vuốt hoặc dùng phím trái/phải trên vùng story. Trang biểu đồ cần một nhịp để chạy hoạt ảnh.
- **Bộ phận cơ thể trong workout review:** xem tổng quan cơ và các góc nhìn; phần báo khó chịu cho chọn vùng và ghi nhận phản hồi.
- **Chat:** mở từ ngữ cảnh Food hoặc bài tập. Dùng câu hỏi gợi ý sẵn; câu trả lời là mẫu cục bộ, không phải AI trực tuyến.
- **Profile:** `profile.html` thể hiện hồ sơ, dụng cụ, mục tiêu và vùng cơ thể cần lưu ý. Đây là nhánh giải thích cá nhân hóa; không nhất thiết đưa vào demo 5 phút.

## 5. Bản đồ các màn hiện có

| Nhóm | File | Vai trò |
|---|---|---|
| Tổng quan | `home.html` | Trang bắt đầu; Steps, nhịp tuần, gợi ý tập, Food. |
| Hoạt động | `activity.html`, `workouts.html` | Lịch sử/nhập hoạt động và thư viện bài tập. |
| Lịch | `plan.html` | Lên lịch, gợi ý, áp dụng và điều chỉnh tuần. |
| Chi tiết và buổi tập | `workout-details.html`, `workout-active.html` | Nội dung buổi tập và ghi các hiệp. |
| Camera | `camera-setup.html` | Thiết lập mô phỏng bằng hình minh họa. |
| Sau tập | `workout-review.html` | Tổng kết, độ mệt, cơ thể và ghi chú. |
| Đi bộ | `steps.html`, `post-walk-restored.html` | Tổng hợp bước chân và recap route mẫu. |
| Dinh dưỡng | `food.html` | Gợi ý, tìm món, công thức, nhật ký bữa ăn. |
| Kiến thức | `insights.html` | Recap và thư viện bài viết. |
| Story | `yearly-recap.html`, `monthly-recap.html` | Recap năm 2025 / tháng 9/2026 giả lập, độc lập nhau. |
| Động lực | `streak.html` | Weekly Rhythm và lịch sử tuần. |
| Cá nhân | `profile.html`, `chat.html` | Hồ sơ và hội thoại mẫu theo ngữ cảnh. |
| Luồng thiết lập cũ | `setup-plan.html`, `reminders.html` | Vẫn có trong bản sao để liên kết cũ không đứt; kịch bản chính dùng Plan mới. |

Các nghiên cứu hình ảnh cũ như `steps-orb-study.html`, `post-walk.html`, `face-expressions.html` không thuộc đường demo chính và không được đưa vào bản sao hiện hành.

## 6. Dữ liệu, chuẩn bị và reset

- Dữ liệu nằm trong `localStorage` hoặc `sessionStorage` của trình duyệt; không có tài khoản/backend. Profile, lịch, lịch sử hoạt động, Rhythm và bữa ăn có thể còn sau khi tải lại. Một số trạng thái buổi tập/check-in/hội thoại phụ thuộc tab.
- Dùng **cùng trình duyệt, địa chỉ và cổng** trong cả buổi. `localhost`, `127.0.0.1`, cổng 8000 và cổng Live Server có thể tạo các vùng dữ liệu khác nhau.
- Dùng dữ liệu demo, không nhập thông tin sức khỏe thật. Các trạng thái `?preview=...` là fixture có sẵn, không sửa thành tích đã lưu.
- Cách chuẩn bị sạch dễ nhất: mở một cửa sổ ẩn danh mới, chạy đúng địa chỉ server, diễn tập và giữ cửa sổ đó đến hết buổi. Đóng toàn bộ cửa sổ ẩn danh sẽ làm mất dữ liệu của phiên đó.
- Muốn reset phiên đang dùng: chỉ thực hiện trước diễn tập/demo, mở DevTools → **Application → Storage**, chọn đúng địa chỉ prototype và xóa dữ liệu của trang đó, rồi tải lại. Việc này xóa cả các chỉnh sửa demo đã lưu ở địa chỉ đó; không dùng nếu cần giữ chúng.
- Preview Rhythm có thể đổi trạng thái bằng URL; không cần tạo giả nhiều tuần lịch sử. Dữ liệu Steps, recap tháng, recap năm và route mẫu không đồng bộ với những thay đổi bạn vừa nhập.

## 7. Giới hạn cần biết để trả lời đúng

| Phần | Có thể cho xem | Không nên khẳng định |
|---|---|---|
| Plan | Gợi ý từ lựa chọn, bản nháp, chỉnh và áp dụng lịch | AI đã phân tích sức khỏe rồi kê lịch cá nhân. |
| Camera | Khung thiết lập, trạng thái minh họa | Camera đang nhận diện và đếm rep thật. |
| Steps / Flights | Biểu đồ và dữ liệu mẫu | Đang đồng bộ Health hoặc cảm biến điện thoại. |
| Walk recap | Route mẫu, khám phá biểu đồ, check-in | Finish check-in đã ghi thêm một chuyến đi vào Rhythm. |
| Báo đau | Nút trong lúc tập dừng buổi và Pause Rhythm | Mọi ghi chú “khó chịu” ở mọi màn đã đồng bộ bảo vệ chuỗi. |
| Reminders | Chọn giờ và giao diện nhắc | Máy sẽ phát thông báo khi đến giờ. |
| Chat | Hội thoại theo ngữ cảnh, phản hồi mẫu | Đang kết nối LLM hoặc có tư vấn y tế. |
| Recap | Hình ảnh, animation, biểu đồ, poster | Story 2025 được tổng hợp từ dữ liệu vừa nhập năm 2026. |
| Ảnh/bài viết | Tài nguyên minh họa và nội dung mẫu đã có | Tất cả ảnh có giấy phép tái sử dụng hoặc bài đã thẩm định y khoa. |

Chưa có xác minh đầy đủ quyền sử dụng ảnh Food; ghi chú nguồn có trong `assets/food/SOURCES.md` và `assets/food/demo/SOURCES.md`. Bản sao giữ tài nguyên hiện tại để đồng nhất với bản demo. Trước khi dùng thương mại hoặc phân phối rộng hơn, cần rà soát nguồn/quyền và nội dung sức khỏe. Các ghi chú nguồn không phải chứng nhận bản quyền.

## 8. Câu hỏi thường gặp khi bảo vệ

**“App này đã hoàn chỉnh chưa?”** — “Đây là prototype tương tác để kiểm chứng luồng và trải nghiệm. Dữ liệu, tích hợp thiết bị và dịch vụ sẽ được triển khai ở ứng dụng thật.”

**“Điểm khác biệt chính là gì?”** — “Kết nối vận động với cảm nhận cơ thể, ăn uống và kiến thức trong một trải nghiệm gần gũi. Việc nghỉ được thể hiện rõ thay vì chỉ thúc người dùng tập thêm.”

**“Vì sao đếm theo tuần?”** — “Mục tiêu theo số buổi cho phép linh hoạt ngày tập. Đạt đủ mục tiêu là tính ngay; nghỉ được bảo vệ khác với một tuần hoàn thành.”

**“Số tầng có lấy thật được không?”** — “Ứng dụng điện thoại có thể đọc dữ liệu tương ứng khi thiết bị/dịch vụ có dữ liệu và người dùng cấp quyền. Trong prototype đang dùng số mẫu.”

**“Ảnh route là bản đồ thật?”** — “Đây là route minh họa để thử thiết kế và tương tác. Bản thật cần dữ liệu vị trí và sự đồng ý của người dùng.”

**“Không có mạng có chạy được không?”** — “Phần UI chính và dữ liệu demo được phục vụ từ máy local. Các liên kết nguồn bên ngoài vẫn cần mạng. Chưa triển khai chế độ offline của ứng dụng thật.”

**“Calo và những phép so sánh chính xác không?”** — “Đó là dữ liệu minh họa và phép ví von được ghi chú. Chúng không dùng để chẩn đoán hoặc đánh giá sức khỏe cá nhân.”

## 9. Checklist trước buổi demo và phương án dự phòng

- [ ] Đã tải đúng phiên bản repo; không lấy nhầm bản đầu thiếu Activity/Plan/recap năm.
- [ ] Server chạy; `home.html`, Food và recap năm tải được font, ảnh, icon.
- [ ] Đã thử bằng đúng máy, trình duyệt, màn hình chiếu và kích thước điện thoại sẽ dùng.
- [ ] Đã mở các tab theo thứ tự; biết URL quay về khi lỡ thao tác.
- [ ] Đã diễn toàn bộ kịch bản một lần, bấm nút thật và đọc lời dẫn thành tiếng.
- [ ] Đã chọn bản 3/5/7–8 phút; luồng chính luôn có Plan và Workout, chỉ rút gọn phần mở rộng.
- [ ] Có bản ZIP local; không phụ thuộc tải GitHub trong lớp.
- [ ] Nếu cần video dự phòng: quay màn hình một lượt demo đã chạy thành công. **Repo chưa kèm video demo.**

**Khi gặp vấn đề:** nếu sai trạng thái, dùng tab dự phòng/URL đã chuẩn bị; nếu story chuyển nhanh, dùng mũi tên để chọn lại; nếu ảnh chưa hiện, chờ tải hoặc tải lại trước khi nói tiếp. Nếu một bước không hoạt động, nói ngắn “phần này đang ở mức prototype” và chuyển sang màn đã kiểm tra. Không bấm ngẫu nhiên hoặc cố làm người xem không nhận ra lỗi.

Sau diễn tập, hạn chế sửa sát giờ. Nếu vừa cập nhật repo, chạy lại toàn bộ đường demo; tài liệu không thay thế việc thử trên máy thuyết trình.

## 10. Ghi chú cho người cập nhật dự án

- Mỗi màn dùng HTML/CSS/JS thuần; ảnh và font nằm trong `assets/`. Không cần npm build.
- `training-model.js`, `activity-model.js`, `rhythm-model.js`, `profile-model.js`, `food-model.js` quản lý trạng thái prototype cục bộ.
- `insights-data.js` chứa thư viện bài chung; `related-insights.js` và `related-insights.css` cung cấp hàng bài liên quan/phần đọc cho nhiều màn.
- Đây là **bản sao để chia sẻ**, tách khỏi workspace thiết kế. Không đưa thư mục handoff, dữ liệu kết nối, secret hoặc tài liệu riêng vào repo.
- Trong workspace gốc, tài liệu nguồn là `public-share/DEMO_README.md`; công cụ `public-share/build_public_snapshot.py` cập nhật bản sao và README. Sửa tài liệu nguồn trước lần đồng bộ tiếp theo để không ghi đè hướng dẫn mới.
- `docs/demo/` chứa ảnh chụp từ bản sao. Khi giao diện thay đổi đáng kể, chụp lại ảnh và thử lại các bước liên quan.
- Mốc kiểm tra này: 27/10/2026. Phần giới hạn mô tả bản bàn giao tại mốc này; cần cập nhật khi các tích hợp thật được hoàn thành.
