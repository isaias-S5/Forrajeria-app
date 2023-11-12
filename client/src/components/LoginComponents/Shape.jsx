import React from 'react';
import { Svg, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const Shape = () => {
  return (
    <Svg width={null} height={null} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Defs>
        <LinearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
          <Stop offset="0%" stopColor="rgba(248, 117, 55, 1)" />
          <Stop offset="100%" stopColor="rgba(251, 168, 31, 1)" />
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#sw-gradient)"
        d="M59.8,-20.3C67.5,-17.2,76.8,-12.6,80.7,-5C84.6,2.6,83.1,13.3,78.2,22.2C73.3,31.1,64.9,38.2,55.5,40.9C46.1,43.7,35.7,42.1,25.8,38.7C15.8,35.3,6.4,30.1,5,22.6C3.6,15.2,10.3,5.6,14.9,-1.5C19.6,-8.6,22.4,-13.1,26.3,-17C30.1,-20.8,35.1,-24,40.6,-24.7C46.1,-25.4,52.1,-23.5,59.8,-20.3Z"
      />
    </Svg>
  );
};

export default Shape;
