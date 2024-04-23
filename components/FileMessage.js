import { View, Text, Dimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <View style={{
            borderRadius: 5, paddingRight: 10, paddingVertical: 10, paddingLeft: 5,
            marginLeft: currentMessage.user._id !== senderId ? 0 : width - 252,
            backgroundColor: currentMessage.user._id !== senderId ? 'white' : '#1E90FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: currentMessage.user._id !== senderId ? 0 : 20,
            borderBottomRightRadius: currentMessage.user._id !== senderId ? 20 : 0,
            width: width - 150
        }}>
            <TouchableOpacity style={{ flexDirection: 'row', width: width - 220, justifyContent: 'space-between', alignItems: 'center' }}
                onLongPress={onLongPress}
            >
                <TouchableOpacity onPress={() => Linking.openURL(currentMessage.file)}>
                    <MaterialCommunityIcons name={iconName} size={50} color={colorIcon} />
                </TouchableOpacity>
                <Text numberOfLines={2}
                    style={{ color: currentMessage.user._id !== senderId ? 'black' : 'white' }}
                >{titleFile}</Text>
            </TouchableOpacity>
            <Text style={{
                color: 'grey', fontSize: 11, marginLeft: 10,
                color: currentMessage.user._id !== senderId ? 'grey' : 'white',
                textAlign: currentMessage.user._id !== senderId ? 'left' : 'right'
            }}>
                {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Text>
        </View>
    );
}

export default FileMessage