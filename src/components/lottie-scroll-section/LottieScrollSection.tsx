import React, { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { useTransform, useViewportScroll } from "framer-motion";
import getTopPosition from "../../utils/getTopDistance";
import LottieScrollSectionProps from "../../@types/lottie-scroll-section.interface";
import getTotalViewport from "../../utils/getTotalViewport";
import { getHorizontalAnimPosition } from "../../utils/animationAlign";

const LottieScrollSection: React.FC<LottieScrollSectionProps> = ({
  height,
  animationPosition = "center",
  debugMode = false,
  frames,
  animation,
  startMargin = 0,
  style,
  className,
  animationStyle,
  ...rest
}) => {
  if (!frames) {
    throw new Error("LottieScrollSection needs the frames property!");
  }

  if (height < window.innerHeight) {
    throw new Error(
      `LottieScrollSection needs that height property be heigher than screen height(${window.innerHeight}px)!`
    );
  }

  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [anim, setAnim] = useState<AnimationItem>();
  const { scrollY } = useViewportScroll();
  const scene = useTransform(
    scrollY,
    [
      getTopPosition(sectionRef) - startMargin,
      getTotalViewport(sectionRef, height),
    ],
    frames
  );

  useEffect(() => {
    if (!lottieContainerRef.current) return;

    if (!anim) {
      const newAnim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        initialSegment: [0, frames[1]],
        animationData: typeof animation !== "string" ? animation : undefined,
        path: typeof animation === "string" ? animation : undefined,
        ...rest,
        loop: false,
        autoplay: false,
      });
      setAnim(newAnim);

      scene.onChange((data) => {
        newAnim.goToAndStop(data, true);
      });
    }

    return () => {
      if (!anim) return;
      anim?.destroy();
    };
  }, [lottieContainerRef]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        width: "100%",
        ...style,
        border: debugMode ? "1px solid red" : undefined,
        display: "flex",
        height,
        position: "relative",
        justifyContent: getHorizontalAnimPosition(animationPosition),
      }}
    >
      <div
        ref={lottieContainerRef}
        style={{
          width: "100%",
          ...animationStyle,
          height: "100vh",
          position: "sticky",
          top: "0",
          border: debugMode ? "1px solid blue" : undefined,
        }}
      />
    </section>
  );
};

export default LottieScrollSection;
