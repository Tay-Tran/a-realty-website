import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireLocale } from '@/i18n/locale';
import { SNAPSHOT_FETCHED_AT, getSourceStates } from '@/lib/data/sources';
import { STATUS_MAX_AGE } from '@/lib/data/sources/live';
import type { ListingStatus } from '@/lib/data/types';
import { listingPath } from '@/lib/listing/paths';
import { SOURCE_DISPLAY_NAMES } from '@/components/listing/SourceTag';
import { Container } from '@/components/ui/Container';
import { recheckSources } from './actions';

// Internal demo page for the client (Vietnamese only), not linked from the menu and never indexed.

export const metadata: Metadata = { title: 'Nguồn dữ liệu', robots: { index: false, follow: false } };

type Props = { params: Promise<{ locale: string }> };

const STATUS_VI: Record<ListingStatus, string> = {
  available: 'Còn trống',
  applied: 'Đang có người đăng ký',
  rented: 'Đã cho thuê',
};
const STATUS_TONE: Record<ListingStatus, string> = {
  available: 'bg-success/10 text-success',
  applied: 'bg-warn/15 text-warn',
  rented: 'bg-ink/10 text-ink-soft',
};

const tokyoTime = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(iso));

function StatusChip({ status }: { status: ListingStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[status]}`}>{STATUS_VI[status]}</span>;
}

export default async function DataSourcesPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const states = await getSourceStates();
  const reached = states.filter((s) => s.live).length;

  return (
    <main lang="vi">
      <Container className="py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Nguồn dữ liệu</h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          Các phòng dưới đây được công cụ lấy tự động từ trang công khai của Leopalace21 và J&amp;K, rồi đưa lên website như phòng bình thường.
          Trạng thái được hỏi lại trang nguồn tối đa mỗi {STATUS_MAX_AGE / 60} phút; phòng nào nguồn báo đã cho thuê sẽ tự ẩn khỏi website.
        </p>
        <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          <div><dt className="inline text-ink-soft">Lấy dữ liệu phòng lúc: </dt><dd className="inline font-medium">{tokyoTime(SNAPSHOT_FETCHED_AT)} (giờ Nhật)</dd></div>
          <div><dt className="inline text-ink-soft">Kết nối được nguồn: </dt><dd className="inline font-medium">{reached}/{states.length} phòng</dd></div>
        </dl>
        <form action={recheckSources} className="mt-4">
          <button type="submit" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
            Kiểm tra lại ngay
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink/5 text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Mã</th>
                <th className="px-3 py-2 font-medium">Nguồn</th>
                <th className="px-3 py-2 font-medium">Phòng trên trang nguồn</th>
                <th className="px-3 py-2 font-medium">Giá thuê</th>
                <th className="px-3 py-2 font-medium">Lúc lấy</th>
                <th className="px-3 py-2 font-medium">Hiện tại</th>
                <th className="px-3 py-2 font-medium">Kiểm tra lúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {states.map(({ listing, snapshotStatus, live }) => (
                <tr key={listing.code} className="align-top">
                  <td className="px-3 py-2">
                    <Link href={listingPath(listing)} className="font-medium text-sky hover:underline">{listing.code}</Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{listing.source && SOURCE_DISPLAY_NAMES[listing.source.name]}</td>
                  <td className="px-3 py-2">
                    {listing.source && (
                      <a href={listing.source.url} target="_blank" rel="noopener nofollow" className="hover:underline">
                        {listing.source.label} ↗
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">¥{listing.rent.toLocaleString('ja-JP')}</td>
                  <td className="px-3 py-2"><StatusChip status={snapshotStatus} /></td>
                  <td className="px-3 py-2">
                    {live ? <StatusChip status={live.status} /> : <span className="text-xs text-warn">Không kết nối được, giữ trạng thái cũ</span>}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-ink-soft">{live ? tokyoTime(live.checkedAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Bấm tên phòng để mở đúng phòng đó trên trang nguồn. Ảnh và nội dung thuộc về bên đăng tin.
        </p>
      </Container>
    </main>
  );
}
