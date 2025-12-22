/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect } from "react";

type WheelColumnProps<T> = {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  renderItem: (item: T, active: boolean) => React.ReactNode;
  itemHeight?: number;
};

const WheelColumn = <T,>({
  items,
  value,
  onChange,
  renderItem,
  itemHeight = 40,
}: WheelColumnProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const paddingTop = itemHeight * 4; // 4 rows above
  const paddingBottom = itemHeight * 4; // 4 rows below
  const visibleHeight = itemHeight * 9; // 4 above + 1 center + 4 below
  const isUserScrolling = useRef(false);
  // Scroll to selected value (centered)
//   useEffect(() => {
//     if (isUserScrolling.current) return;
//     const index = items.indexOf(value);
//     if (index >= 0 && ref.current) {
//       // Center the item: scroll so the item is at position 4 * itemHeight from top
//       const scrollTop = index * itemHeight;
//       ref.current.scrollTo({
//         top: scrollTop,
//         behavior: "smooth",
//       });
//     }
//   }, [value, items, itemHeight]);

  const handleScroll = () => {
    if (!ref.current) return;
    isUserScrolling.current = true;
    // Calculate which item is at the center (4 items from top)
    const centerPosition = ref.current.scrollTop + paddingTop;
    const index = Math.round(centerPosition / (itemHeight)); //scroll friction
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const next = items[clampedIndex];
    if (next !== value) onChange(next);
    window.clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = window.setTimeout(() => {
      isUserScrolling.current = false;
    }, 100);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="wheel px-5"
      style={{
        height: visibleHeight,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* Top padding to allow first items to scroll to center */}
      <div style={{ height: paddingTop }} />

      {items.map((item, i) => (
        <div
          key={i}
          style={{
            height: itemHeight,
            scrollSnapAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderItem(item, item === value)}
        </div>
      ))}

      {/* Bottom padding to allow last items to scroll to center */}
      <div style={{ height: paddingBottom }} />
    </div>
  );
};

export default WheelColumn;
