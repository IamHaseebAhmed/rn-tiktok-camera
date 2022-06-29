import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from 'react-native';

import Svg, {G, Circle, Rect} from 'react-native-svg';
import DotPoints from './DotPoints';

const {width, height} = Dimensions.get('window');

const CaptureBtn = () => {
  const size = 90;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const [recording, setRecording] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = toValue => {
    if (toValue <= 30) {
      return Animated.spring(progressAnimation, {
        toValue,
        easing: Easing.ease,
        stiffness: 20,
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
        // console.log('recording...');
        doClearIntervals(timer);

        timer = setInterval(() => {
          // console.log('inside running...', isComplete);

          if (isComplete) {
            doClearIntervals(timer);
            // console.log('post-stopped...');
            return;
          }
          setPercentage(prev => {
            if (prev < 30) {
              return prev + 1;
            }
            isComplete = true;
            return;
          });
        }, 1000);
      } else if (!recording) {
        // console.log('stopped...');
        doClearIntervals(timer);
      }
    }

    return () => clearInterval(timer);
  }, [recording]);

  // let angle = 270;
  // let x, y;

  // x = Math.sin(angle * (Math.PI / 180)) * radius;
  // y = radius - radius * Math.cos(angle * (Math.PI / 180));

  // if (angle > 180) {
  //   angle = 90 - (180 - angle);
  //   x = radius - radius * Math.cos(angle * (Math.PI / 180));
  //   y = Math.sin(angle * (Math.PI / 180)) * radius;
  // }

  // console.log('x: ', x);
  // console.log('y: ', y);

  // console.log("percentage: ", percentage);

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   path: '',
    //   duration: 3,
    // },
    // {
    //   id: 1,
    //   path: '',
    //   duration: 6,
    // },
    // {
    //   id: 1,
    //   path: '',
    //   duration: 10,
    // },
  ]);

  let discardLastClipHander = () => {
    let newArr = data.slice(0, -1);
    let newPercent = 0;

    if (newArr.length > 0) {
      newPercent = newArr[newArr.length - 1].duration;
    }

    console.log('newPercent: ', newPercent);

    // for (let i = 0; i < data.length; i++) {
    //   newPercent += data[i].duration;
    // }
    setPercentage(newPercent);
    setData(newArr);
  };

  return (
    <View
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 100,
      }}>
      <Svg width={size} height={size} style={{position: 'relative'}}>
        {/* <G rotation="-90" origin={center}>
          <Circle cx={85 - y} cy={40 + x} r={3} fill="green" />
        </G> */}
        <G rotation="-90" origin={center}>
          <Circle
            ref={progressRef}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
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
          {/* <Circle cx={87} cy={45} r={3} fill="red" /> */}
          {data.map(el => {
            let {cx, cy, id} = DotPoints[el.duration];
            if (cx && cy) {
              return <Circle key={id} cx={cx} cy={cy} r={3} fill="red" />;
            }
          })}
        </G>
      </Svg>
      <TouchableOpacity
        onPress={() => {
          if (!recording) {
            setRecording(true);
            return;
          }
          setRecording(false);

          let newData = {
            id: data.length,
            path: '',
            duration: percentage,
          };

          setData([...data, newData]);
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

      <TouchableOpacity
        onPress={discardLastClipHander}
        style={{
          width: 60,
          height: 30,
          backgroundColor: '#fff',
          // borderRadius: 40,
          position: 'absolute',
          right: 20,
          bottom: 200,
          alignSelf: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>DELETE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CaptureBtn;
