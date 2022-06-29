import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';

import Svg, {G, Circle} from 'react-native-svg';

const CaptureBtn = () => {
  const size = 90;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const [recording, setRecording] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = toValue => {
    if (toValue <= 30) {
      return Animated.timing(progressAnimation, {
        toValue,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      value => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 30;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage],
    );
  });

  const doClearIntervals = timer => {
    if (timer) {
      clearInterval(timer);
      return;
    }
  };

  useEffect(() => {
    let timer;
    let isComplete;

    if (recording === true || recording === false) {
      if (recording) {
        console.log('recording...');
        doClearIntervals(timer);

        timer = setInterval(() => {
          console.log('inside running...', isComplete);

          if (isComplete) {
            doClearIntervals(timer);
            console.log('post-stopped...');
            return;
          }
          setPercentage(prev => {
            if (prev < 30) {
              return prev + 1
            }
            isComplete = true
            return;
          });
        }, 1000);
      } 
      else if (!recording) {
        console.log('stopped...');
        doClearIntervals(timer);
      }
    }

    return () => clearInterval(timer);
  }, [recording]);

  return (
    <View style={{backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 100}}>
      <Svg width={size} height={size} style={{position: 'relative'}}>
        <G rotation="-90" origin={center}>
          <Circle
            ref={progressRef}
            // stroke="#E6E7E8"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            onPress={() => {
              if (!recording) {
                setRecording(true);
                return;
              }
              setRecording(false);
            }}
          />
          <Circle
            ref={progressRef}
            stroke="rgba(156, 88, 243, 1)"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * 25) / 30}
          />
        </G>
      </Svg>
      <TouchableOpacity
        onPress={() => {
          if (!recording) {
            setRecording(true);
            return;
          }
          setRecording(false);
        }}
        style={{
          backgroundColor: 'rgba(156, 88, 243, 1)',
          position: 'absolute',
          // alignSelf: 'center',
          top: 11,
          left: 11,
          right: 0,
          width: 34 * 2,
          height: 34 * 2,
          borderRadius: 34,
        }}></TouchableOpacity>
    </View>
  );
};

export default CaptureBtn;