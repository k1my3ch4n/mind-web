const PALETTE_ITEMS = ['버튼', '텍스트', '이미지', '입력', '카드', '모달'];

function ComponentPalette() {
  return (
    <div className="flex w-40 shrink-0 flex-col border-r border-gray-100 p-3">
      <h3 className="mb-2 text-xs font-medium text-gray-400">컴포넌트</h3>
      <ul className="flex flex-col gap-1.5">
        {PALETTE_ITEMS.map((item) => (
          <li
            key={item}
            className="rounded border border-dashed border-gray-200 px-2 py-1.5 text-xs text-gray-400"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComponentPalette;
