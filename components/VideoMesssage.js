import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const VideoMessage = ({ videoUri, sender }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
   const [isPlay, SetIsPlay] = useState(false);
  const handleToggleFullScreen = () => {
   SetIsPlay(true)
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={{ width: width - 170, justifyContent: 'center', 
      alignItems: 'center', padding: 10,
      backgroundColor: !sender? 'white':'#1E90FF',
      marginLeft: !sender? 53 : width - 232, 
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      borderBottomRightRadius: !sender? 20:0,
      borderBottomLeftRadius: !sender? 0:20,
      }}>
      <TouchableOpacity onPress={handleToggleFullScreen}>
        <View style={{ width: 200, height: 150 }}>
            <WebView
              style={{ flex: 1 }}
              source={{ uri: videoUri.video }}
              allowsFullscreenVideo={isPlay}
             mediaPlaybackRequiresUserAction={!isPlay}
             allowsInlineMediaPlayback={false}
            />
          <Text style={{ color: '#111111', fontSize: 10 }}>
            {new Date(videoUri.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoMessage;
