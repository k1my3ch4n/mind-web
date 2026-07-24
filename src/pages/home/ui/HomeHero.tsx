import { ArrowRight, Boxes, MousePointerClick, Network, Play, Sparkles } from 'lucide-react';

import { Logo } from '@shared/ui';

import ProductPreview from './ProductPreview';

const PRODUCT_STEPS = [
  { icon: Network, label: '페이지 연결', description: '사이트 구조를 마인드맵으로 설계' },
  { icon: Boxes, label: '화면 구성', description: '페이지별 컴포넌트를 간편하게 배치' },
  { icon: MousePointerClick, label: '흐름 프리뷰', description: '연결한 사용자 동선을 바로 확인' },
] as const;

interface HomeHeroProps {
  hasProjectData: boolean;
  onStartNewProject: () => void;
  onOpenExample: () => void;
  onContinueProject: () => void;
}

function HomeHero({
  hasProjectData,
  onStartNewProject,
  onOpenExample,
  onContinueProject,
}: HomeHeroProps) {
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-16">
      <section>
        <div className="mb-10 flex items-center gap-3">
          <Logo size={44} />
          <span className="text-xl font-bold tracking-tight text-gray-900">mind-web</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
          <Sparkles size={13} /> 아이디어에서 클릭 가능한 웹 흐름까지
        </div>
        <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.15] tracking-tight text-gray-950 lg:text-5xl">
          구조를 그리면,
          <br />
          바로 움직이는 웹이 됩니다
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
          페이지 관계를 마인드맵으로 설계하고 화면을 구성해 보세요. 연결한 구조 그대로 사용자 흐름을
          프리뷰할 수 있습니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStartNewProject}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            새 프로젝트 시작
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={onOpenExample}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Play size={15} className="fill-current" />
            예제 프로젝트로 둘러보기
          </button>
          {hasProjectData && (
            <button
              type="button"
              onClick={onContinueProject}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              이어서 작업하기
            </button>
          )}
        </div>

        <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
          {PRODUCT_STEPS.map(({ icon: Icon, label, description }, index) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white/80 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon size={15} />
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {index + 1}. {label}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-4 text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="absolute -inset-8 -z-10 rounded-full bg-brand-100/60 blur-3xl" />
        <ProductPreview />
      </section>
    </main>
  );
}

export default HomeHero;
