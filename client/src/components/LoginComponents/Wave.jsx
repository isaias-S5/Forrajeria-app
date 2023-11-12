import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Svg, Defs, LinearGradient, Stop, Path } from "react-native-svg";

const Wave = ({
  customStyles,
  customHeight,
  customTop,
  customBgColor,
  customWavePattern
}) => {
  return (
    <View style={customStyles}>
      <View style={{ backgroundColor: customBgColor, height: customHeight }}>
        <Svg
          height="60%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: customTop }}
        >
          <Path fill={customBgColor} d={customWavePattern} />
        </Svg>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wave: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default Wave;
