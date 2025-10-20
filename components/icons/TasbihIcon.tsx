// DigitalTasbihIcon.tsx
import React from "react";
import Svg, { Ellipse, Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

const DigitalTasbihIcon: React.FC<Props> = ({ size = 128, color = "#000" }) => {
  return (
    <Svg viewBox="0 0 128 128" width={size} height={size} fill="none">
      {/* Example - you can apply `color` or keep original fills */}
      <Ellipse cx="101.21" cy="63.87" rx="6.14" ry="6.39" fill={color} />
      <Ellipse
        cx="100.63"
        cy="63.18"
        rx="5.24"
        ry="5.45"
        fill={color}
        opacity={0.6}
      />
      <Path
        d="M101.06 60.5c.42 1.56-1.14 2.85-2.44 2.71c-1.18-.13-2.28-1.41-1.45-2.96c1.09-2.01 3.49-1.23 3.89.25z"
        fill={color}
      />

      {/* You’d continue adding the rest of <ellipse> and <path> items here.
          For long SVGs, you can use an online converter:
          https://react-svgr.com/playground/?native=true */}
    </Svg>
  );
};

export default DigitalTasbihIcon;
