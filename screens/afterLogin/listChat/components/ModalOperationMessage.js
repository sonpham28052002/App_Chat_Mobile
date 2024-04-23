import { Dimensions, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Modal } from 'react-native-paper';
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';

const ModalOperationMessage = ({ visible, onDismiss, messTarget, senderId, onPressRecall, onPressForward, onPressDelete }) => {
    const { width } = Dimensions.get('window')
    return (
        <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: width * 0.8, marginHorizontal: width * 0.1 }}
        >
            {messTarget &&
                <View>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>{messTarget.text}</Text>
                </View>
            }
            <View style={{
                flexDirection: 'row',
                borderBottomWidth: 1, borderBottomColor: 'lightgray',
                borderTopWidth: 1, borderTopColor: 'lightgray',
                paddingVertical: 5,
                marginVertical: 10,
                justifyContent: 'space-between',
                width: width * 0.7
            }}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>😄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>❤️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>😥</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>😡</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>👍</Text>
                </TouchableOpacity>
            </View>
            {messTarget && messTarget.user._id == senderId &&
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                    onPress={onPressRecall}
                >
                    <FontAwesome6 name="arrows-rotate" size={40} color="red" />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>Thu hồi tin nhắn</Text>
                </TouchableOpacity>
            }
            <TouchableOpacity style={{
                width: '100%', flexDirection: 'row', alignItems: 'center',
                marginVertical: 10
            }}
                onPress={onPressForward}
            >
                <Ionicons name="arrow-undo" size={40} color="black" />
                <Text style={{ fontSize: 20, marginLeft: 5 }}>Chuyển tiếp tin nhắn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                onPress={onPressDelete}
            >
                <MaterialIcons name="delete" size={40} color="red" />
                <Text style={{ fontSize: 20, marginLeft: 5 }}>Xoá tin nhắn</Text>
            </TouchableOpacity>
        </Modal>
    )
}

export default ModalOperationMessage