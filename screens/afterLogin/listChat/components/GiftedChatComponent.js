import { View, TouchableOpacity, Dimensions, Text, Image } from 'react-native'
import { TextInput } from 'react-native-paper';
import React from 'react'
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import AudioRecorder from '../../../../components/AudioRecorder';
import FileMessage from '../../../../components/FileMessage';
import VideoMessage from '../../../../components/VideoMesssage';
import AudioMessage from '../../../../components/AudioMessage';
import MessageCustom from '../../../../components/MessageCustom';
import ImageMessage from '../../../../components/ImageMessage';

const GiftedChatComponent = ({ onPress, messages, senderId, user, onLongPress, mess, onChangeText, position, onSelectionChange, textInputRef, onPressModal2, onSelectAudio, handleSend, fileExtension }) => {
    const { width } = Dimensions.get('window')
    const renderBubble = (props) => {
        const { currentMessage } = props;
        const onLongPressMessage = () => {
            onLongPress(null, currentMessage)
        }
        if (currentMessage.file)
            return <FileMessage currentMessage={currentMessage} fileExtension={fileExtension(currentMessage.file)} senderId={senderId} onLongPress={onLongPressMessage}/>
        if (currentMessage.video)
            return <VideoMessage videoUri={currentMessage} sender={currentMessage.user._id == senderId ? true : false} onLongPress={onLongPressMessage} />;
        if (currentMessage.audio)
            return <AudioMessage key={currentMessage._id} audioUri={currentMessage} sender={currentMessage.user._id == senderId ? true : false} onLongPress={onLongPressMessage} durationInSeconds={currentMessage.durationInSeconds} />;
        if (currentMessage.text)
            return <MessageCustom currentMessage={currentMessage} onLongPress={onLongPressMessage} isSender={currentMessage.user._id == senderId ? true : false}/>
        if (currentMessage.image)
            return <ImageMessage currentMessage={currentMessage} onLongPress={onLongPressMessage} isSender={currentMessage.user._id == senderId ? true : false}/>
        return null
    }

    return (
        <GiftedChat
            renderInputToolbar={(props) =>
                <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: width - 45, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity onPress={onPress}>
                            <Entypo name="emoji-happy" size={35} color='black' />
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10, width: width - 180 }}>
                            <TextInput placeholder="Tin nhắn" style={{ backgroundColor: 'white', fontSize: 20, width: '100%' }}
                                value={mess}
                                onChangeText={onChangeText}
                                selection={position}
                                ref={textInputRef}
                                onSelectionChange={onSelectionChange}
                            />
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', width: 75, justifyContent: 'space-between' }} onPress={onPressModal2} >
                            <Entypo name="dots-three-horizontal" size={35} color="black" />
                            <AudioRecorder onSelectAudio={onSelectAudio} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleSend}
                        style={{ width: 45, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <MaterialIcons name="send" size={35} color="cyan" />
                    </TouchableOpacity>
                </View>
            }
            messages={messages}
            user={user}
            onLongPress={onLongPress}
            // renderMessage={renderMessage}
            renderBubble={renderBubble}
        />
    )
}

export default GiftedChatComponent