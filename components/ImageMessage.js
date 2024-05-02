import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import { Modal } from 'react-native-paper'
import { Dialog } from '@rneui/themed';

const ImageMessage = ({ currentMessage, isSender, onLongPress }) => {
    const { width } = Dimensions.get('window')
    const [showModal, setShowModal] = React.useState(false)
    return (
        <View style={{
            borderRadius: 5, paddingTop: 2, paddingBottom: 5, paddingHorizontal: 2,
            marginLeft: !isSender ? 0 : width - 252,
            backgroundColor: !isSender ? 'white' : '#D5F1FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: !isSender ? 0 : 20,
            borderBottomRightRadius: !isSender ? 20 : 0,
            width: 204
        }}>
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
                    <Image source={{ uri: currentMessage.image }} style={{ width: 200, height: 200, borderRadius: 20 }} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 11, 
                    paddingRight: 10,
                    color: 'grey',
                    textAlign: !isSender ? 'left' : 'right'
                }}>
                    {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </Text>
            </View>
            <Dialog isVisible={showModal} onBackdropPress={() => setShowModal(false)}
                overlayStyle={{ width: width, padding: 5, margin: 0 }}
            >
                <Image source={{ uri: currentMessage.image }} style={{ width: width - 10, height: width - 10 }} />
            </Dialog>
        </View>
    )
}

export default ImageMessage