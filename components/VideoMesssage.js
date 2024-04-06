import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';

const VideoMessage = React.memo(({ videoUri }) => {
  const [playVideo, setPlayVideo] = useState(false);
 const [uri,setUri]=useState("")
  const [key,setKey]=useState(videoUri._id)
  const handlePress = () => {
    setPlayVideo(true);
    setUri(videoUri.video)
  }

  return (
    <View style={{marginLeft:'50%'}}>
      <View style={{ width: 200, height: 150 }}>
        <WebView
        key={key}
          style={{ flex: 1 }}
          source={{ uri: uri }}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={false}
          // startInLoadingState={true}
          renderLoading={() => <ActivityIndicator />}
        />
        {!playVideo && (
          <TouchableOpacity style={styles.overlay} onPress={handlePress}>
            <Text>Play video</Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: '#111111', fontSize: 10 }}>
          {new Date(videoUri.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoMessage;