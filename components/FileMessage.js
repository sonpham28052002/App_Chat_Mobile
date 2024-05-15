import { View, Text, Dimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';

const FileMessage = ({ currentMessage, fileExtension, senderId, onLongPress }) => {
    const { width } = Dimensions.get('window')
    const [iconName, setIconName] = useState('');
    const [colorIcon, setColorIcon] = useState('red');
    const [titleFile, setTitleFile] = useState('');

    useEffect(() => {
        switch (fileExtension) {
            case 'pdf':
                setIconName('file-pdf-box')
                setColorIcon('#F28585')
                break;
            case 'doc':
            case 'docx':
                setIconName('file-word')
                setColorIcon('blue')
                break;
            case 'xls':
            case 'xlsx':
                setIconName('file-excel')
                setColorIcon('#0A7641')
                break;
            case 'ppt':
            case 'pptx':
                setIconName('file-powerpoint')
                setColorIcon('#D34C2C')
                break;
            case 'mov':
            case 'mp4':
            case 'mp3':
                setIconName('file-video')
                break;
            default:
                setIconName('file')
                setColorIcon('#111111')
        }
        const uri = currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)
        const type = uri.substring(uri.lastIndexOf(".") + 1);
        setTitleFile(uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_")) + "." + type)
    }, []);

    return (
        <View style={{ flexDirection: 'row', marginBottom: currentMessage.extraData.react?.length > 0 ? 10 : 0 }}>
            <View style={{
                borderRadius: 5, paddingRight: 10, paddingVertical: 10, paddingLeft: 5,
                marginLeft: currentMessage.user._id !== senderId ? 0 : width - 252,
                backgroundColor: currentMessage.user._id !== senderId ? 'white' : '#D5F1FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: currentMessage.user._id !== senderId ? 0 : 20,
                borderBottomRightRadius: currentMessage.user._id !== senderId ? 20 : 0,
                width: width - 150
            }}>
                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>{currentMessage.user.name}</Text>
                {currentMessage.replyMessage &&
                    <TouchableOpacity style={{ borderLeftWidth: 4, marginLeft: 10, borderLeftColor: '#70faf3', paddingLeft: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: 700 }}>{currentMessage.replyMessage.userName}</Text>
                        <Text style={{ color: 'grey', fontSize: 11 }} numberOfLines={1}>{currentMessage.replyMessage.content}</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={{ flexDirection: 'row', width: width - 220, justifyContent: 'space-between', alignItems: 'center' }}
                    onLongPress={onLongPress}
                >
                    <TouchableOpacity onPress={() => Linking.openURL(currentMessage.file)}>
                        <MaterialCommunityIcons name={iconName} size={50} color={colorIcon} />
                    </TouchableOpacity>
                    <Text numberOfLines={2}
                        style={{ color: 'black' }}
                    >{titleFile}</Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 11, marginLeft: 10,
                    color: 'grey',
                    textAlign: currentMessage.user._id !== senderId ? 'left' : 'right'
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
            {currentMessage.user._id === senderId && <FontAwesome name={currentMessage.pending ? "circle-o" : "check-circle"} size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
        </View>
    );
}

export default FileMessage