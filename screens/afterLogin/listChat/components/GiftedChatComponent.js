import { View, TouchableOpacity, Dimensions, Text, Image } from 'react-native'
import { TextInput } from 'react-native-paper';
import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AudioRecorder from '../../../../components/AudioRecorder';
import FileMessage from '../../../../components/FileMessage';
import VideoMessage from '../../../../components/VideoMesssage';
import AudioMessage from '../../../../components/AudioMessage';
import MessageCustom from '../../../../components/MessageCustom';
import ImageMessage from '../../../../components/ImageMessage';

const GiftedChatComponent = ({ status, memberType, onPress, messages, senderId, user, onLongPress, mess, onChangeText, position, onSelectionChange, textInputRef, onPressModal2, onSelectAudio, handleSend, fileExtension, messageReply, onCloseReply }) => {
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
            return <AudioMessage key={currentMessage._id} audioUri={currentMessage} isSender={currentMessage.user._id == senderId ? true : false} onLongPress={onLongPressMessage} durationInSeconds={currentMessage.durationInSeconds} />;
        if (currentMessage.system)
            return <Text>System</Text>
        if (currentMessage.text)
            return <MessageCustom currentMessage={currentMessage} onLongPress={onLongPressMessage} isSender={currentMessage.user._id == senderId ? true : false} />
        if (currentMessage.image)
            return <ImageMessage currentMessage={currentMessage} onLongPress={onLongPressMessage} isSender={currentMessage.user._id == senderId ? true : false}/>
        return null
    }

    const getTitleFile = (file) => {
        const uri = file.substring(file.indexOf('/') + 1)
        const title = uri.substring(uri.indexOf('_') + 1, uri.lastIndexOf('_'))
        const type = uri.substring(uri.lastIndexOf('.') + 1)
        return title + '.' + type
    }

    return (
        <GiftedChat
            renderInputToolbar={(props) =>
                (!status || status == "ACTIVE" || 
                ( status == "READ_ONLY" && (memberType == "DEPUTY_LEADER" || memberType == "GROUP_LEADER")) ||
                ( status == "CHANGE_IMAGE_AND_NAME_ONLY" && (memberType == "DEPUTY_LEADER" || memberType == "GROUP_LEADER")))?
                <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: width - 45, height: 65, justifyContent: 'space-between', alignItems: 'center' }}>
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
                </View> :
                <View style={{ height: 80, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: 'lightgrey' }}>Chỉ trưởng nhóm và phó nhóm mới được gửi tin nhắn!</Text>
                </View>
            }
            messages={messages}
            user={user}
            onLongPress={onLongPress}
            // renderMessage={renderMessage}
            renderBubble={renderBubble}
            renderChatFooter={() => messageReply &&
                <View style={{ paddingHorizontal : 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                    <AntDesign name="aliwangwang" size={35} color="black" />
                    <View style={{ width: width - 105, marginLeft: 10, paddingTop: 5, paddingHorizontal: 10, borderLeftWidth: 5, borderColor: '#1E90FF' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold'}}>{messageReply.user.name}</Text>
                        { messageReply.text && <Text style={{ fontSize: 14, color: 'gray' }} numberOfLines={2}>{messageReply.text}</Text> }
                        { messageReply.image && <Image source={{ uri: messageReply.image }} style={{ width: 50, height: 50 }} /> }
                        { messageReply.file && <Text style={{ fontSize: 14, color: 'gray' }} numberOfLines={2}>{getTitleFile(messageReply.file)}</Text> }
                        { messageReply.video && <Text style={{ fontSize: 14, color: 'gray' }} numberOfLines={2}>[Video]</Text> }
                        { messageReply.audio && <Text style={{ fontSize: 14, color: 'gray' }} numberOfLines={2}>[Audio]</Text> }
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                        onPress={onCloseReply}
                    >
                        <MaterialIcons name="cancel" size={35} color="gray" />
                    </TouchableOpacity>
                </View>
            }
        />
    )
}

export default GiftedChatComponent