import React, { Component } from 'react';
import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG, GROUP_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { View, Dimensions } from 'react-native';

export default function VoiceCallPage(props) {
  const { width, height } = Dimensions.get('window');
    return (
        <View style={{height: height-50}}>
            <ZegoUIKitPrebuiltCall
                appID={940263346}
                appSign={'40da48b6a31a24ddfc594d8c998e7bb36a542e86f83697fb889f2b85bf1c572a'}
                userID={props.route.params.id} // userID can be something like a phone number or the user id on your own user system. 
                userName={props.route.params.userName}
                callID={'UHoKafmPwftcxMAVpvFoznZIq'} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...GROUP_VIDEO_CALL_CONFIG,
                    
                    // onOnlySelfInRoom: () => { props.navigation.navigate('HomePage') },
                    onHangUp: () => { props.navigation.goBack() },
                }}
            />
        </View>
    );
}
