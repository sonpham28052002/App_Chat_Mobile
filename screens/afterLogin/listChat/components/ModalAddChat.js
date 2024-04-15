import { Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import ButtonCustom from '../../../../components/button';

const ModalAddChat = ({visible, onDismiss, handleShowModalAddFriend, handleShowModalCreateGroup}) => {
    const { width, height } = Dimensions.get('window')
    return (
        <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: width * 0.4,
                // height: 200,
                marginLeft: width - width * 0.4,
                marginBottom: height * 0.5 + 150
            }}
        >
            <ButtonCustom title='Thêm bạn bè' backgroundColor='white' border={true}
                onPress={handleShowModalAddFriend}
            />
            <ButtonCustom title='Tạo group' backgroundColor='white' border={true}
                onPress={handleShowModalCreateGroup}
            />
        </Modal>
    )
}

export default ModalAddChat