import React, { useState } from 'react';
import { FontAwesome, Octicons } from '@expo/vector-icons';
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
    <View style={{ flexDirection: 'row', marginBottom: videoUri.extraData.react?.length > 0 ? 10 : 0 }}>
      <TouchableOpacity style={{
        width: width - 170, paddingVertical: 5, paddingHorizontal: 10,
        backgroundColor: !sender ? 'white' : '#D5F1FF',
        marginLeft: !sender ? 0 : width - 232,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomRightRadius: !sender ? 20 : 0,
        borderBottomLeftRadius: !sender ? 0 : 20,
      }}
        onLongPress={() => onLongPress(videoUri)}
      >
        <Text style={{ fontWeight: 'bold' }}>{videoUri.user.name}</Text>
        {videoUri.replyMessage &&
          <TouchableOpacity style={{ marginVertical: 5, borderLeftWidth: 4, borderLeftColor: '#70faf3', paddingLeft: 5 }}>
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{videoUri.replyMessage.userName}</Text>
            <Text style={{ color: 'grey', fontSize: 11 }} numberOfLines={1}>{videoUri.replyMessage.content}</Text>
          </TouchableOpacity>
        }
        <View style={{ width: 200, height: 150, paddingTop: 5, justifyContent: 'center' }}>
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
              <Octicons name="play" size={70} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{
          fontSize: 11,
          color: 'grey',
          textAlign: !sender ? 'left' : 'right'
        }}>
          {videoUri.createdAt ? new Date(videoUri.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Sending...'}
        </Text>
        {videoUri.extraData.react.length > 0 &&
                    <TouchableOpacity style={{
                        borderRadius: 10, flexDirection: 'row', paddingLeft: 2, paddingRight: 5, borderWidth: 1, borderColor: 'grey', backgroundColor: 'white',
                        position: 'absolute', bottom: -10, left: 20
                    }}>
                        {
                            [...new Set(videoUri.extraData.react.map(item => item.react))].slice(0, 3).map((react, index) => <Text key={index} style={{ fontSize: 9 }}>{
                                react == "HAPPY" ? "😄"
                                    : react == "HEART" ? "❤️"
                                        : react == "SAD" ? "😥"
                                            : react == "ANGRY" ? "😡"
                                                : react == "LIKE" ? "👍"
                                                    : null
                            }</Text>)
                        }
                        <Text style={{ fontSize: 9, marginLeft: 1 }}>{videoUri.extraData.react.length < 100 ? videoUri.extraData.react.length : "99+"}</Text>
                    </TouchableOpacity>
                }
      </TouchableOpacity>
      {sender && <FontAwesome name={videoUri.pending ? "circle-o" : "check-circle"} size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoMessage;