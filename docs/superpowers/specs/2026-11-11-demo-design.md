# Thiết kế bản Demo – Website BĐS cho thuê tại Nhật (Kurashi Homes)

- **Ngày:** 11/11/2026
- **Dự án:** PROJECT A-REALTY – Giai đoạn 1, tuần 1 theo báo giá của Thuận (20.000.000đ, 4 tuần)
- **Mục tiêu demo:** để khách (anh Vũ) duyệt giao diện trang chủ, trang danh sách và trang chi tiết căn hộ qua link xem thử. Code demo **được dùng tiếp** cho bản chính thức, không phải làm lại.

## 1. Phạm vi

### Có trong demo
- 3 trang: Trang chủ, Danh sách/Tìm kiếm, Chi tiết căn hộ.
- Đủ 3 ngôn ngữ: Anh (`en`), Myanmar (`my`), Nhật (`ja`).
- Bộ lọc chạy thật trên dữ liệu mẫu.
- Responsive mobile và desktop.
- SEO cơ bản: metadata theo từng ngôn ngữ, hreflang, canonical.

### Không có trong demo (làm ở các tuần sau)
- Trang quản trị Payload, database (tuần 2).
- Gửi form thật về email/Google Sheet (tuần 3). Demo chỉ validate và hiện thông báo thành công.
- Danh sách yêu thích, đổi đơn vị tiền tệ, AI dịch, nhập Excel.
- Trang SEO tự tạo theo ga/khu vực, sitemap, GA4/GTM (tuần 4).

## 2. Thương hiệu tạm

- Tên: **Kurashi Homes** (暮らし – "cuộc sống"). Đây là tên tạm, chưa phải tên công ty khách.
- Màu (phương án A, chốt 2026-11-11 sau góp ý của Thuận): nút và logo navy `#1d3557`, giá/link/icon xanh thép `#2a5f96`, nền phụ xanh nhạt `#e3edf8`/`#e8f0f8`, nền trang `#f7f9fc`, viền `#dbe4ee`, chữ `#1f2a44`. Màu đậm chỉ dùng cho nút chính; khối tìm kiếm nền trắng.
- Mọi thông tin thương hiệu (tên, tagline, màu, logo, số điện thoại, link LINE/WhatsApp/Messenger) nằm trong `src/config/site.ts`. Đổi thương hiệu chỉ cần sửa file này.
- **Không dùng lại hình ảnh, nội dung của AREALTY.** Chỉ tham khảo bố cục và cách tìm kiếm.

## 3. Các trang

### Thành phần chung
- **Header:** logo, menu (Tìm phòng · Khu vực · Quy trình thuê · Liên hệ – demo chưa có trang "Về chúng tôi" nên menu trỏ tới các phần trên trang chủ), nút đổi ngôn ngữ EN / မြန်မာ / 日本語. Đổi ngôn ngữ giữ nguyên trang đang xem.
- **Thanh liên hệ cố định ở đáy màn hình trên mobile:** LINE, WhatsApp, Messenger, gọi điện.
- **Footer:** thông tin công ty (tạm), liên kết, mạng xã hội.

### 3.1. Trang chủ – `/[locale]`
1. Banner với ô tìm kiếm: khu vực, tuyến → ga, giá thuê tối đa, loại phòng. Bấm tìm thì chuyển sang `/[locale]/rent?...`.
2. Ô danh mục: Cho sinh viên · Không tiền lễ · Không cần bảo lãnh · Cho nuôi thú · Mới xây · Có nội thất. Mỗi ô là link tới trang danh sách đã lọc sẵn.
3. Căn hộ nổi bật (6 căn có `featured = true`).
4. Lưới khu vực (8 khu vực), mỗi ô link tới danh sách lọc theo khu vực.
5. Quy trình thuê 5 bước cho người nước ngoài.
6. Câu hỏi thường gặp (dạng accordion).
7. Form đăng ký tư vấn.

### 3.2. Danh sách / Tìm kiếm – `/[locale]/rent`
- **Bộ lọc:** khu vực, tuyến → ga, số phút đi bộ tối đa, khoảng giá thuê, loại phòng (chọn nhiều), điều kiện (nhận người nước ngoài, không cần bảo lãnh, không tiền lễ, nhận du học sinh, cho nuôi thú, có nội thất), sắp xếp (giá tăng, giá giảm, mới nhất).
- Desktop: bộ lọc ở cột trái. Mobile: nút "Bộ lọc" mở bảng trượt từ dưới lên.
- Bộ lọc là **nguồn sự thật trên URL** (search params). Trang là server component đọc search params, lọc, render kết quả.
- Kết quả: thẻ căn hộ (ảnh, giá thuê + phí quản lý, loại phòng, m², ga + phút đi bộ, nhãn điều kiện, nhãn trạng thái). 12 căn mỗi trang, có phân trang.
- Không có kết quả: thông báo + nút xóa bộ lọc.
- **Căn đã cho thuê không xuất hiện trong kết quả.**

### 3.3. Chi tiết căn hộ – `/[locale]/rent/[area]/[slug]`
- `slug` có dạng `<mô-tả>-<mã căn viết thường>`, ví dụ `1k-shin-okubo-a1023`. Tra cứu bằng mã căn ở cuối slug. Nếu slug sai nhưng mã đúng thì redirect 308 về slug đúng.
- Thư viện ảnh (ảnh chính + ảnh nhỏ, xem toàn màn hình).
- Thông tin chính: giá thuê, phí quản lý, tổng mỗi tháng, loại phòng, m², tầng, năm xây, các ga gần nhất + phút đi bộ, địa chỉ.
- **Bảng chi phí ban đầu:** từng dòng + tổng, tính bằng `calcInitialCost`.
- Nhãn điều kiện thuê và tiện ích.
- Google Maps nhúng (iframe embed miễn phí, theo địa chỉ).
- Căn tương tự (tối đa 4, cùng khu vực hoặc cùng ga, giá gần nhau, không gồm căn đã cho thuê).
- Form hỏi thuê điền sẵn mã căn.
- Trạng thái:
  - `available` (đang tuyển): hiển thị bình thường.
  - `applied` (đang có người đăng ký): nhãn vàng, vẫn cho hỏi thuê ("có thể đăng ký dự phòng").
  - `rented` (đã cho thuê): trang vẫn truy cập được, hiện thông báo đã cho thuê, ẩn form, nhấn mạnh căn tương tự.

## 4. Dữ liệu

### 4.1. Kiểu dữ liệu (`src/lib/data/types.ts`)

```ts
type Locale = 'en' | 'my' | 'ja';
type LocalizedText = Record<Locale, string>;

interface Area    { slug: string; name: LocalizedText; }
interface Line    { slug: string; name: LocalizedText; color: string; }
interface Station { slug: string; name: LocalizedText; lineSlugs: string[]; areaSlug: string; }

type Layout = '1R' | '1K' | '1DK' | '1LDK' | '2K' | '2DK' | '2LDK' | '3LDK';
type ListingStatus = 'available' | 'applied' | 'rented';

interface Listing {
  code: string;                 // 'A1023' – duy nhất, khóa khi nhập Excel sau này
  slug: string;                 // '1k-shin-okubo-a1023'
  status: ListingStatus;
  title: LocalizedText;
  description: LocalizedText;
  areaSlug: string;
  address: string;              // địa chỉ tiếng Nhật, dùng cho bản đồ
  stations: { stationSlug: string; walkMinutes: number }[];  // 1–3 ga
  layout: Layout;
  sizeM2: number;
  floor: number;
  builtYear: number;
  rent: number;                 // yên/tháng
  managementFee: number;        // yên/tháng
  initialCosts: {
    depositMonths: number;      // 敷金
    keyMoneyMonths: number;     // 礼金
    brokerageMonths: number;    // 仲介手数料
    guaranteeFee: number;       // yên – phí công ty bảo lãnh
    insurance: number;          // yên – bảo hiểm hỏa hoạn
    keyExchange: number;        // yên – thay khóa
    cleaning: number;           // yên – vệ sinh
  };
  conditions: {
    foreignerOk: boolean; noGuarantor: boolean; studentOk: boolean;
    petOk: boolean; furnished: boolean; overseasApplication: boolean; autoLock: boolean;
  };
  images: string[];
  featured: boolean;
  publishedAt: string;          // ISO date
}
```

### 4.2. Giá trị tính tự động (không lưu)
- `noKeyMoney = initialCosts.keyMoneyMonths === 0`
- `newlyBuilt = năm hiện tại - builtYear <= 3`
- `monthlyTotal = rent + managementFee`
- Dòng **tiền thuê tháng đầu (前家賃)** = `rent + managementFee`, luôn có trong bảng chi phí ban đầu (ở Nhật khoản này luôn trả trước khi vào ở; bỏ đi sẽ làm tổng thấp hơn thực tế).

### 4.3. Lớp truy cập dữ liệu (`src/lib/data/index.ts`)
Các trang **chỉ** gọi các hàm sau (đều là `async` để sau này đổi sang Payload không phải sửa nơi gọi):

| Hàm | Mô tả |
|---|---|
| `getListings(filters)` | `page` và `sort` nằm trong `filters`. Trả `{ items, total, page, pageCount }`. Loại căn `rented`. |
| `getListing(code)` | Trả căn hoặc `null`. Gồm cả căn `rented`. |
| `getSimilarListings(listing, limit)` | Căn tương tự, không gồm `rented` và chính căn đó. |
| `getFeaturedListings(limit)` | Căn nổi bật, không gồm `rented`. |
| `getAreas()`, `getLines()`, `getStations(lineSlug?)` | Dữ liệu tham chiếu. |

Hiện tại các hàm đọc từ `src/lib/data/mock/*`. Tuần 2 thay bằng Payload Local API.

### 4.4. Logic thuần (có unit test)
- `src/lib/listing/derived.ts` – `isNewlyBuilt`, `hasCondition`, `monthlyTotal`.
- `src/lib/listing/initial-cost.ts` – `calcInitialCost(listing)` → `{ items: { key, amount, months? }[], total }`. Dòng đầu là tiền thuê tháng đầu (`rent + managementFee`). Tiền cọc/tiền lễ/phí môi giới = số tháng × `rent`. Các khoản tính bằng yên giữ nguyên. Khoản bằng 0 vẫn trả về (để hiện "0 yên – miễn phí"). Tổng là số nguyên.
- `src/lib/listing/filters.ts`
  - `Filters` (zod schema): `area?`, `line?`, `station?`, `maxWalk?`, `minRent?`, `maxRent?`, `layouts?: Layout[]`, `conditions?: ConditionKey[]` (gồm cả `noKeyMoney`, `newlyBuilt`), `sort?: 'price-asc' | 'price-desc' | 'newest'`, `page?`.
  - `parseFilters(searchParams)`: giá trị sai bị bỏ qua, không ném lỗi.
  - `serializeFilters(filters)`: bỏ giá trị rỗng, thứ tự key ổn định.
  - `filterListings(listings, filters)`: lọc + sắp xếp. Lọc giá theo `rent` (không gồm phí quản lý). Lọc `station` khớp bất kỳ ga nào trong `stations` với `walkMinutes <= maxWalk` (nếu có). Lọc `line` khớp căn có ít nhất một ga thuộc tuyến đó.
- `src/lib/listing/format.ts` – định dạng yên (`Intl.NumberFormat`), diện tích, số phút đi bộ theo ngôn ngữ.

### 4.5. Dữ liệu mẫu
- 8 khu vực Tokyo: Shinjuku, Toshima, Shibuya, Nakano, Bunkyo, Taito, Sumida, Kita.
- 10 tuyến, 25 ga (Shin-Okubo, Takadanobaba, Ikebukuro, Shinjuku, Nakano, Ueno, Akabane…), nhập tay. Tên ga, tuyến, khu vực ở bản `my` dùng chữ Latin như bản `en` (người Myanmar tại Nhật đọc tên ga theo romaji; phiên âm sang chữ Myanmar dễ sai).
- 24 căn, trải đều khu vực, giá 45.000–180.000 yên, nhiều loại phòng. Trạng thái: 20 `available`, 2 `applied`, 2 `rented`. 6 căn `featured`.
- Ảnh: Unsplash (giấy phép miễn phí), dùng URL từ `images.unsplash.com` qua `next/image` (`remotePatterns`). Kiểm tra từng URL trả về 200 trước khi dùng.
- Nội dung tiếng Myanmar và tiếng Nhật do Claude viết, **là bản nháp chờ người bản ngữ bên khách duyệt.**

## 5. Đa ngôn ngữ

- Thư viện: `next-intl`, routing theo prefix luôn có (`/en`, `/my`, `/ja`). `src/proxy.ts` (Next.js 16 đổi tên `middleware.ts` thành `proxy.ts`) chuyển `/` → `/en`.
- Chữ giao diện: `messages/{en,my,ja}.json`. Nội dung căn hộ: trường `LocalizedText`.
- Thiếu bản dịch → hiện tiếng Anh.
- Font qua `next/font/google`: Noto Sans (en), Noto Sans Myanmar (my), Noto Sans JP (ja). Thẻ `<html lang>` đúng theo ngôn ngữ. Với `my`, `line-height` tăng lên (≈1.9) để không đè dấu.

## 6. SEO cơ bản

- `generateMetadata` cho mỗi trang: title, description theo ngôn ngữ; `alternates.languages` (hreflang) cho cả 3 ngôn ngữ + `x-default` → `en`; `alternates.canonical`.
- Trang danh sách có bộ lọc: canonical về `/[locale]/rent` (trang SEO theo ga/khu vực sẽ làm ở tuần 4).
- **Môi trường xem thử phải noindex:** biến môi trường `NEXT_PUBLIC_SITE_ENV=staging` → `robots.txt` chặn toàn bộ và metadata `robots: { index: false, follow: false }`. Mặc định là `staging`; chỉ bản chính thức mới đặt `production`.

## 7. Xử lý lỗi

- Mã căn không tồn tại → `notFound()` → trang 404 theo ngôn ngữ.
- Ngôn ngữ không hỗ trợ trong URL → 404.
- Search params sai → bỏ qua giá trị đó (do `parseFilters`).
- `page` vượt quá số trang → hiển thị trang cuối.
- Ảnh lỗi: **chưa xử lý ở demo** – mọi ảnh mẫu đã được kiểm tra trước. Sẽ thêm ảnh thay thế khi có ảnh upload thật qua Payload (tuần 2).

## 8. Công nghệ

- Next.js **16.4.6** (App Router) + TypeScript (strict). Đã kiểm tra: `@payloadcms/next@3.93.0` hỗ trợ `next >=16.3.3 <17`.
- Tailwind CSS, `next-intl`, `zod`.
- Vitest cho unit test.
- Không dùng thư viện UI nặng; component tự viết, gọn.

## 9. Cấu trúc thư mục

```
src/
  app/[locale]/
    layout.tsx  page.tsx  not-found.tsx
    rent/page.tsx
    rent/[area]/[slug]/page.tsx
  app/robots.ts
  components/
    layout/   Header, Footer, LanguageSwitcher, MobileContactBar
    home/     Hero, CategoryTiles, AreaGrid, RentalSteps, Faq
    search/   SearchBox, FilterPanel, FilterSheet, Pagination, SortSelect
    listing/  ListingCard, Gallery, KeyFacts, InitialCostTable, ConditionBadges, StatusBadge, MapEmbed, SimilarListings
    forms/    InquiryForm
    ui/       Button, Badge, Container…
  lib/data/        types.ts, index.ts, mock/{areas,lines,stations,listings}.ts
  lib/listing/     derived.ts, initial-cost.ts, filters.ts, format.ts (+ *.test.ts)
  lib/seo.ts
  i18n/            routing.ts, request.ts, navigation.ts, merge.ts
  config/site.ts
  proxy.ts
messages/          en.json, my.json, ja.json
```

## 10. Kiểm thử và tiêu chí hoàn thành

1. `vitest run` xanh: `calcInitialCost`, `filterListings`, `parseFilters`/`serializeFilters`.
2. `next build` không lỗi, không lỗi TypeScript.
3. Kiểm tra trên trình duyệt (preview): 3 trang × 3 ngôn ngữ × (mobile 375px, desktop), chụp màn hình. Kiểm tra: chữ Myanmar hiển thị đúng, bộ lọc thay đổi URL và kết quả, đổi ngôn ngữ giữ trang, căn `rented` hiện đúng, 404 hoạt động.
4. Không có lỗi trong console trình duyệt.

## 11. Git và triển khai

- Git khởi tạo trong thư mục dự án, commit theo từng bước.
- Đẩy lên GitHub và deploy Vercel (link xem thử): **cần tài khoản của bạn hoặc Thuận – hỏi trước khi làm.**

---

## 12. Bổ sung 11/11/2026 – bám bố cục arealty.jp và báo giá của Thuận

Sau khi so sánh trực tiếp với arealty.jp (trang chủ, trang danh mục, trang chi tiết). Giữ màu thương hiệu riêng, không dùng lại ảnh, chữ hay số liệu của họ.

**A. Bố cục**
- Trang chủ: tiêu đề banner căn giữa; ô tìm kiếm 2 hàng (Khu vực · Tuyến · Ga / Giá · Diện tích · Phòng ngủ · Tìm); danh mục dạng thẻ ảnh 2×3 đặt cạnh form liên hệ; căn nổi bật dạng băng trượt ngang.
- Trang danh sách: thẻ nằm ngang (ảnh + 3 hình nhỏ | khu vực, tên, 2 ga, bảng Loại phòng/Diện tích/Tầng/Phòng ngủ, nhãn | giá, nút, ♡); chip danh mục liên quan ở đầu trang.
- Trang chi tiết: lưới ảnh mosaic (1 lớn + 4 nhỏ, "Xem tất cả"); thanh dính (tên, tổng/tháng, nút Hỏi thuê, điện thoại); thanh mục lục Tổng quan · Tiện ích · Chi tiết · Bản đồ; phần Chi tiết 3 cột (tòa nhà / hằng tháng / ban đầu + tổng); form hỏi thuê ở cuối trang thay cho khung giá bên phải.

**B. Theo báo giá**
- Số phòng ngủ tính từ loại phòng (R/K/DK/LDK theo số đầu). Điều kiện tự tính mới: `family` (≥ 2 phòng ngủ), `luxury` (giá thuê ≥ ¥150,000).
- Bộ lọc mới: `minSize`, `maxSize` (m²), `bedrooms` (tối thiểu), `maxAge` (tuổi nhà, năm).
- Trường mới `amenities` (điều hòa, ban công, tủ nhận hàng, thang máy, bãi xe đạp, toilet riêng, washlet, wifi, bếp hệ thống, sàn gỗ, tủ âm tường).
- Yêu thích: lưu mã căn trong localStorage; trang `/[locale]/favorites`; dữ liệu lấy qua route `/api/listings?codes=…`.
- Đổi tiền tệ: JPY / USD / EUR / VND, tỷ giá cố định "tham khảo" (1 USD = ¥156, 1 EUR ≈ ¥170, ¥1 ≈ 168₫), lựa chọn lưu localStorage, mặc định JPY.

**C. Trang chủ**: dịch vụ (4 thẻ), giới thiệu, con số thống kê, kêu gọi đối tác, 3 đánh giá khách hàng – nội dung tạm. Form liên hệ có ô loại yêu cầu (Thuê / Hỗ trợ chuyển nhà / Hợp tác đối tác / Khác).

**D.** Nút LINE / WhatsApp / Messenger nổi góc phải trên desktop.

**Chưa làm**: sơ đồ phòng (chưa có ảnh hợp lệ), tab Mua / Ngắn hạn (ngoài Giai đoạn 1).
