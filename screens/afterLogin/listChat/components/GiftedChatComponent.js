import { View, TouchableOpacity, Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper';
import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import AudioRecorder from '../../../../components/AudioRecorder';

const GiftedChatComponent = ({ onPress, messages, user, onLongPress, renderMessage, mess, onChangeText, position, onSelectionChange, textInputRef, onPressModal2, onSelectAudio, handleSend }) => {
    const { width } = Dimensions.get('window')
    
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
            renderMessage={renderMessage}
        />
    )
}

export default GiftedChatComponent