import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Camera} from 'react-native-vision-camera';

const MyCamera = ({navigation}) => {
  const [camPermission, setCamPermission] = useState('');
  const [micPermission, setMicPermission] = useState('');
  const [state, setState] = useState('')

  let getPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();

    if ( cameraPermission == 'authorized' && microphonePermission == 'authorized') {
      navigation.navigate('CameraScreen');
    } else {
      const newCameraPermission = await Camera.requestCameraPermission();
      const newMicrophonePermission = await Camera.requestMicrophonePermission();

      if (newCameraPermission == 'authorized' && newMicrophonePermission == 'authorized') {
        navigation.navigate('CameraScreen');
      }
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return <View style={{flex: 1}}></View>;
};

export default MyCamera;
