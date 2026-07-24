import { ArrowRight, Play, Sparkles } from 'lucide-react';

function ProductPreview() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-2xl shadow-brand-100/60"
    >
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 rounded-full bg-white px-3 py-1 text-[10px] font-medium text-gray-400 shadow-sm">
          mind-web workspace
        </span>
      </div>

      <div className="grid min-h-[400px] grid-cols-[1.05fr_0.95fr] bg-gray-100">
        <div className="relative overflow-hidden border-r border-gray-200 bg-[radial-gradient(#d8d1ff_1px,transparent_1px)] bg-[size:18px_18px] p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
            <Sparkles size={11} /> 사이트 구조
          </span>

          <div className="absolute left-[29%] top-[36%] h-px w-[27%] rotate-[-16deg] bg-brand-300" />
          <div className="absolute left-[51%] top-[41%] h-px w-[24%] rotate-[22deg] bg-brand-300" />
          <div className="absolute left-[51%] top-[59%] h-px w-[24%] rotate-[-22deg] bg-brand-300" />

          <div className="absolute left-[7%] top-[39%] w-[31%] rounded-xl border-2 border-brand-500 bg-white p-3 shadow-lg shadow-brand-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-900">홈</span>
              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[8px] font-semibold text-brand-700">
                START
              </span>
            </div>
            <p className="mt-1 text-[9px] text-gray-400">/</p>
            <div className="mt-3 h-8 rounded-md bg-brand-50" />
          </div>

          <div className="absolute right-[7%] top-[22%] w-[34%] rounded-xl border border-gray-200 bg-white p-3 shadow-md">
            <span className="text-xs font-bold text-gray-900">상품 목록</span>
            <p className="mt-1 text-[9px] text-gray-400">/products</p>
            <div className="mt-3 grid grid-cols-2 gap-1">
              <div className="h-7 rounded bg-gray-100" />
              <div className="h-7 rounded bg-gray-100" />
            </div>
          </div>

          <div className="absolute bottom-[15%] right-[7%] w-[34%] rounded-xl border border-gray-200 bg-white p-3 shadow-md">
            <span className="text-xs font-bold text-gray-900">상품 상세</span>
            <p className="mt-1 text-[9px] text-gray-400">/products/detail</p>
            <div className="mt-3 h-3 w-2/3 rounded bg-gray-100" />
            <div className="mt-2 h-5 w-1/2 rounded bg-brand-500" />
          </div>
        </div>

        <div className="flex flex-col bg-gray-50 p-5">
          <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold text-gray-500">
            <Play size={11} className="fill-current" /> LIVE PREVIEW
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <div className="ml-2 h-2 w-24 rounded-full bg-gray-100" />
            </div>
            <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-7 text-center">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                New collection
              </span>
              <div className="mt-2 h-3 w-28 rounded-full bg-gray-800" />
              <div className="mt-2 h-2 w-20 rounded-full bg-gray-200" />
              <div className="mt-5 flex w-full flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-gray-100">
                <div className="h-20 w-14 rounded-t-full rounded-b-xl bg-white shadow-lg" />
              </div>
              <div className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-[9px] font-bold text-white">
                상품 둘러보기
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-white px-4 py-3 text-[10px] font-medium text-gray-500">
        <span>마인드맵</span>
        <ArrowRight size={11} className="text-brand-400" />
        <span>페이지 디자인</span>
        <ArrowRight size={11} className="text-brand-400" />
        <span>클릭 프리뷰</span>
      </div>
    </div>
  );
}

export default ProductPreview;
