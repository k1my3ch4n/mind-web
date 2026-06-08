import type { PageComponentAlign, PageComponentData, PageComponentSize } from '../model/types';

interface PageComponentPreviewProps {
  component: PageComponentData;
}

const ALIGN_WRAPPER_CLASS: Record<PageComponentAlign, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const ALIGN_TEXT_CLASS: Record<PageComponentAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const TEXT_SIZE_CLASS: Record<PageComponentSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const CONTROL_PADDING_CLASS: Record<PageComponentSize, string> = {
  sm: 'px-2 py-1',
  md: 'px-3 py-1.5',
  lg: 'px-4 py-2.5',
};

const IMAGE_HEIGHT_CLASS: Record<PageComponentSize, string> = {
  sm: 'h-16',
  md: 'h-24',
  lg: 'h-36',
};

function PageComponentPreview({ component }: PageComponentPreviewProps) {
  const { type, text, align, size } = component;

  switch (type) {
    case 'button':
      return (
        <div className={`flex w-full ${ALIGN_WRAPPER_CLASS[align]}`}>
          <button
            type="button"
            className={`rounded-md bg-blue-600 font-medium text-white shadow-sm ${TEXT_SIZE_CLASS[size]} ${CONTROL_PADDING_CLASS[size]}`}
          >
            {text}
          </button>
        </div>
      );

    case 'text':
      return (
        <p className={`w-full text-gray-700 ${ALIGN_TEXT_CLASS[align]} ${TEXT_SIZE_CLASS[size]}`}>{text}</p>
      );

    case 'image':
      return (
        <div className={`flex w-full ${ALIGN_WRAPPER_CLASS[align]}`}>
          <div
            className={`flex w-full max-w-xs flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 bg-gray-100 text-gray-400 ${IMAGE_HEIGHT_CLASS[size]}`}
          >
            <span aria-hidden className="text-lg">
              🖼
            </span>
            <span className={TEXT_SIZE_CLASS[size]}>{text}</span>
          </div>
        </div>
      );

    case 'input':
      return (
        <div className={`flex w-full ${ALIGN_WRAPPER_CLASS[align]}`}>
          <input
            disabled
            placeholder={text}
            className={`w-full max-w-xs rounded-md border border-gray-300 bg-white text-gray-400 outline-none ${TEXT_SIZE_CLASS[size]} ${CONTROL_PADDING_CLASS[size]}`}
          />
        </div>
      );

    case 'card':
      return (
        <div
          className={`w-full rounded-lg border border-gray-200 bg-white shadow-sm ${CONTROL_PADDING_CLASS[size]} ${ALIGN_TEXT_CLASS[align]}`}
        >
          <p className={`font-medium text-gray-900 ${TEXT_SIZE_CLASS[size]}`}>{text}</p>
          <p className="mt-1 text-xs text-gray-400">카드 내용이 들어갈 영역이에요.</p>
        </div>
      );

    case 'modal':
      return (
        <div className={`flex w-full ${ALIGN_WRAPPER_CLASS[align]}`}>
          <button
            type="button"
            className={`flex items-center gap-1.5 rounded-md border border-gray-300 bg-white font-medium text-gray-700 shadow-sm ${TEXT_SIZE_CLASS[size]} ${CONTROL_PADDING_CLASS[size]}`}
          >
            {text}
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              모달
            </span>
          </button>
        </div>
      );
  }
}

export default PageComponentPreview;
