import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const CameraScreen = ({navigation}) => {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [recordStatus, setRecordStatus] = useState(false);
  const [videos, setVideos] = useState([]);

  if (device == null)
    return (
      <View style={{flex: 1}}>
        <Text>No camera found on this device!</Text>
      </View>
    );

  let recordVideo = async () => {
    setRecordStatus(true);

    await cameraRef.current.startRecording({
      flash: 'off',
      onRecordingFinished: video => {
        console.log(video);
        let newData = videos;
        newData.push(video.path)

        setVideos(newData);
        setRecordStatus(false);
      },
      onRecordingError: error => {
        console.error(error);
        setRecordStatus(false);
      },
    });
  };

  let stopRecordVideo = async () => {
    await cameraRef.current.stopRecording();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <Camera
        ref={cameraRef}
        video={true}
        audio={true}
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={true}
      />

      <View style={{marginTop: 10, marginLeft: 20}}>
        <Text style={{color: "#fff"}}>{`No. of Videos: ${videos.length}`}</Text>
      </View>

      <TouchableOpacity
        onPress={recordStatus ? stopRecordVideo : recordVideo}
        style={{
          width: 80,
          height: 80,
          backgroundColor: recordStatus ? 'red' : 'green',
          borderRadius: 40,
          position: 'absolute',
          bottom: 60,
          alignSelf: 'center',
        }}></TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("PreviewScreen", {data: videos})}
        style={{
          width: 60,
          height: 30,
          backgroundColor: '#fff',
          // borderRadius: 40,
          position: 'absolute',
          right: 20,
          bottom: 80,
          alignSelf: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text>DONE</Text>
        </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;
