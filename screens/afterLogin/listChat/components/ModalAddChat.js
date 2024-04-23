import { Dimensions, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native-paper';
import ButtonCustom from '../../../../components/button';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const ModalAddChat = ({visible, onDismiss, handleShowModalAddFriend, handleShowModalCreateGroup}) => {
    const { width, height } = Dimensions.get('window')
    return (
        <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{
                backgroundColor: 'white',
                // justifyContent: 'center',
                // alignItems: 'center',
                width: width * 0.5,
                // height: 200,
                marginLeft: width - width * 0.5,
                marginBottom: height * 0.5 + 140,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name="person-add-outline" size={30} color="black" />
                <ButtonCustom title='Thêm bạn bè' width={width * 0.5 -50} alignItems='flex-start' fontWeight={400} backgroundColor='white' border={true}
                    onPress={handleShowModalAddFriend}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <AntDesign name="addusergroup" size={30} color="black" />
            <ButtonCustom title='Tạo group' width={width * 0.5 -50} alignItems='flex-start' fontWeight={400} backgroundColor='white' border={true}
                onPress={handleShowModalCreateGroup}
            />
            </View>
        </Modal>
    )
}

export default ModalAddChat