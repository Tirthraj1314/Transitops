import { useEffect, useState } from "react";

export function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const numericTarget = Number(target);

  useEffect(() => {
    if (!Number.isFinite(numericTarget)) {
      setValue(numericTarget);
      return;
    }

    let frame;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(numericTarget * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numericTarget, duration]);

  return value;
}
