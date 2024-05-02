import React, { useState } from 'react';
import { Foundation } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoMessage = React.memo(({ videoUri, sender, onLongPress }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const [uri, setUri] = useState("")
  const [key, setKey] = useState(videoUri._id)
  const handlePress = () => {
    setPlayVideo(true);
    setUri(videoUri.video)
  }

  const { width } = Dimensions.get('window');

  return (
    <TouchableOpacity style={{
      width: width - 170, paddingVertical: 5, paddingHorizontal: 10,
      backgroundColor: !sender ? 'white' : '#D5F1FF',
      marginLeft: !sender ? 0 : width - 232,
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      borderBottomRightRadius: !sender ? 20 : 0,
      borderBottomLeftRadius: !sender ? 0 : 20,
      height: 180
    }}
      onLongPress={() => onLongPress(videoUri)}
    >
      <View style={{ width: 200, height: 150, paddingTop: 5, justifyContent: 'center'}}>
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
      </View>
      <Text style={{
        fontSize: 11,
        color: 'grey',
        textAlign: !sender ? 'left' : 'right'
      }}>
        {new Date(videoUri.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })}
      </Text>
    </TouchableOpacity>
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