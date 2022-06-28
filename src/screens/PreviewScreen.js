import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';

const PreviewScreen = ({route, navigation}) => {

  const {data} = route.params;
  const [videos, setVideos] = useState(data);
  const [currPlayVid, setCurrPlayVideo] = useState(0);

  let loadNextVideo = () => {
    if (currPlayVid < videos.length) {
      setCurrPlayVideo(prev => 1 + prev);
      return;
    } 
    setCurrPlayVideo(0)
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {videos[currPlayVid] ? (
        <Video
          source={{uri: videos[currPlayVid]}}
          resizeMode="cover"
          se
          style={StyleSheet.absoluteFillObject}
          onEnd={loadNextVideo}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 18}}>
            You have played all videos :)
          </Text>
          <TouchableOpacity
            onPress={() => setCurrPlayVideo(0)}
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginTop: 10,
              borderRadius: 6
            }}>
            <Text style={{color: "#000"}}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{position: 'absolute', top: 10, left: 20, zIndex: 20}}>
        <Text style={{color: '#fff'}}>{`Total Videos: ${videos.length}`}</Text>
        <Text
          style={{color: '#fff'}}>{`Currently playing: ${currPlayVid}`}</Text>
      </View>
    </View>
  );
};

export default PreviewScreen;
