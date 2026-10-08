import { useEffect, useRef, useState } from "react";

type PreviewThumbProps = {
  slug: string;
  title: string;
  /** Size of the page the preview is drawn at before it is scaled down to fit. */
  width?: number;
  height?: number;
};

/** A live, scaled-down preview of a component. Not interactive: the card link gets the clicks. */
export function PreviewThumb({ slug, title, width = 800, height = 600 }: PreviewThumbProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / width);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div className="thumb" ref={boxRef} style={{ aspectRatio: `${width} / ${height}` }}>
      {scale > 0 ? (
        <iframe
          aria-hidden="true"
          loading="lazy"
          src={`preview.html#/${slug}`}
          style={{ width, height, transform: `scale(${scale})` }}
          tabIndex={-1}
          title={`${title} preview`}
        />
      ) : null}
    </div>
  );
}
