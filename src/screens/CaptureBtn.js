import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
// import Animated from 'react-native-reanimated';

import Svg, {G, Circle} from 'react-native-svg';

const CaptureBtn = () => {
  const size = 96;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const [recording, setRecording] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = toValue => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      value => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage],
    );
  });

  return (
    <View>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            ref={progressRef}
            stroke="#E6E7E8"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={progressRef}
            stroke="red"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            // strokeDashoffset={circumference - (circumference * 25) / 100}
          />
        </G>
      </Svg>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 10,
          position: 'absolute',
          alignSelf: 'center',
          top: 14,
          width: 34 * 2,
          height: 34 * 2,
          borderRadius: 34,
        }}></TouchableOpacity>
    </View>
  );
};

export default CaptureBtn;
