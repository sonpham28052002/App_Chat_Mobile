import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const VideoMessage = ({ videoUri }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
   const [isPlay, SetIsPlay] = useState(false);
  const handleToggleFullScreen = () => {
   SetIsPlay(true)
  };

  return (
    <View style={{marginLeft:'50%'}}>
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
