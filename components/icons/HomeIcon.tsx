import React from "react";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";

export default function SunMoonIcon({ size = 30, color = "white" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        {/* Crescent moon created by clipping two circles */}
        <ClipPath id="moonClip">
          <Circle cx="32" cy="32" r="10" />
          <Circle cx="37" cy="28" r="10" fill="black" />
        </ClipPath>
      </Defs>

      {/* 8-point polygon (flower/star look) */}
      <Path
        d="M32 4 L40 12 L52 12 L56 24 L64 32 L56 40 L52 52 L40 52 L32 60 L24 52 L12 52 L8 40 L0 32 L8 24 L12 12 L24 12 Z"
        fill={color}
      />

      {/* Moon inside (white space cut out) */}
      <G clipPath="url(#moonClip)">
        <Circle cx="32" cy="32" r="10" fill="black" />
      </G>
    </Svg>
    // <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    //   <Defs>
    //     {/* Create a mask for the cutout moon */}
    //     <Mask id="moonMask">
    //       {/* Full circle */}
    //       <Rect width="24" height="24" fill="white" />
    //       {/* Cutout circle for crescent */}
    //       <Path
    //         fill="black"
    //         d="M14 6a6.5 6.5 0 1 0 0 12c-2-1-3.5-3-3.5-6S12 7 14 6z"
    //       />
    //     </Mask>
    //   </Defs>

    //   {/* Outer circle with cutout moon */}
    //   <Path
    //     d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
    //     fill={color}
    //     mask="url(#moonMask)"
    //   />
    // </Svg>
  );
}
