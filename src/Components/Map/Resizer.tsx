import React, { useEffect, useRef, useState } from "react";
import styles from "./MapStyles.module.css";

export default function Resizer({
  parentRef,
}: {
  parentRef: React.RefObject<HTMLDivElement>;
}) {
  const [pointerDown, setPointerDown] = useState(false);
  const oldY = useRef(0);

  useEffect(() => {
    const handleSplitterMove = (e: PointerEvent) => {
      if (parentRef.current && pointerDown) {
        const newHeight =
          parseInt(getComputedStyle(parentRef.current).height, 10) -
          (e.clientY - oldY.current);
        // parentRef.current.style.height = `${newHeight}px`;
        if (e.clientY - oldY.current < 0)
          parentRef.current.style.height = "100svh";
        else parentRef.current.style.height = "7rem";
        oldY.current = e.clientY;
      }
    };
    const onUp = () => {
      setPointerDown(false);
    };
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointermove", handleSplitterMove);
    return () => {
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointermove", handleSplitterMove);
    };
  }, [pointerDown]);

  return (
    <div
      onPointerDown={(e) => {
        setPointerDown(true);
        if (!oldY.current) oldY.current = e.clientY;
      }}
      className={styles["splitter"]}
    ></div>
  );
}
