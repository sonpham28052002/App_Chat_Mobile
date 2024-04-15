import { View, Text, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Modal, TextInput } from 'react-native-paper';
import ButtonCustom from '../../../../components/button';
import axios from 'axios';
import PhoneInput from "react-native-phone-input";
import AddFriend from '../AddFriend';

const ModalAddFriend = ({ visible, onDismiss, onPress}) => {
    const { width, height } = Dimensions.get('window')
    const phoneInput = useRef(null);
  return (
    <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{
                backgroundColor: 'white',
                width: width * 0.9,
                marginHorizontal: width * 0.05,
                padding: 5,
                height: height * 0.8
                // height: 200,
                // marginLeft: width - width * 0.4,
                // marginBottom: height * 0.5 + 150
            }}
        >
      <AddFriend onPress={onPress}/>
    </Modal>
  )
}

export default ModalAddFriend