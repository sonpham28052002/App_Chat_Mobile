import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import { Dialog } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';

const ImageMessage = ({ currentMessage, isSender, onLongPress }) => {
    const { width } = Dimensions.get('window')
    const [showModal, setShowModal] = React.useState(false)
    return (
        <View style={{ flexDirection: 'row', marginBottom: currentMessage.extraData.react?.length > 0 ? 10 : 0 }}>
            <View style={{
            borderRadius: 5, paddingTop: 2, paddingBottom: 5, paddingHorizontal: 2,
            marginLeft: !isSender ? 0 : width - 252,
            backgroundColor: !isSender ? 'white' : '#D5F1FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: !isSender ? 0 : 20,
            borderBottomRightRadius: !isSender ? 20 : 0,
            width: 204
        }}>
            <Text style={{ fontWeight: 'bold', marginLeft: 10, marginBottom: 5 }}>{currentMessage.user.name}</Text>
            { currentMessage.replyMessage &&
                    <TouchableOpacity style={{ borderLeftWidth: 4, marginTop: 8, marginBottom: 5, marginHorizontal: 8, borderLeftColor: '#70faf3', paddingLeft: 5}}>
                        <Text style={{ fontSize: 11, fontWeight: 700 }}>{currentMessage.replyMessage.userName}</Text>
                        <Text style={{ color: 'grey', fontSize: 11}} numberOfLines={1}>{currentMessage.replyMessage.content}</Text>
                    </TouchableOpacity>
            }
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                    onLongPress={onLongPress}
                    onPress={() => setShowModal(true)}
                >
                    <Image source={{ uri: currentMessage.image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 11, 
                    paddingRight: 10,
                    color: 'grey',
                    textAlign: !isSender ? 'left' : 'right'
                }}>
                    {currentMessage.createdAt ? new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Sending...'}
                </Text>
                {currentMessage.extraData.react.length > 0 &&
                    <TouchableOpacity style={{
                        borderRadius: 10, flexDirection: 'row', paddingLeft: 2, paddingRight: 5, borderWidth: 1, borderColor: 'grey', backgroundColor: 'white',
                        position: 'absolute', bottom: -10, left: 20
                    }}>
                        {
                            [...new Set(currentMessage.extraData.react.map(item => item.react))].slice(0, 3).map((react, index) => <Text key={index} style={{ fontSize: 9 }}>{
                                react == "HAPPY" ? "😄"
                                    : react == "HEART" ? "❤️"
                                        : react == "SAD" ? "😥"
                                            : react == "ANGRY" ? "😡"
                                                : react == "LIKE" ? "👍"
                                                    : null
                            }</Text>)
                        }
                        <Text style={{ fontSize: 9, marginLeft: 1 }}>{currentMessage.extraData.react.length < 100 ? currentMessage.extraData.react.length : "99+"}</Text>
                    </TouchableOpacity>
                }
            </View>
            <Dialog isVisible={showModal} onBackdropPress={() => setShowModal(false)}
                overlayStyle={{ width: width, padding: 5, margin: 0 }}
            >
                <Image source={{ uri: currentMessage.image }} style={{ width: width - 10, height: width - 10 }} />
            </Dialog>
        </View>
        {isSender && <FontAwesome name={currentMessage.pending ? "circle-o" : "check-circle"} size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
        </View>
    )
}

export default ImageMessage