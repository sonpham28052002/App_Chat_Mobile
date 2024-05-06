import { Text, Dimensions, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { visibleModal } from '../../Redux/slice';
import { Dialog } from '@rneui/themed';
import { Audio } from 'expo-av';

const modalNotification = () => {
    const { width } = Dimensions.get('window');
    const dispatch = useDispatch();
    const visible = useSelector(state => state.modal.visible);
    const notify = useSelector(state => state.modal.notify);
    const [sound, setSound] = useState();

    useEffect(() => {
        const loadSound = async () => {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/movie_1.mp3')
          );
          setSound(sound);
        };
    
        loadSound();
    
        return () => {
          if (sound) {
            sound.unloadAsync();
          }
        };
      }, []);

    useEffect(() => {
        if(visible) {
            sound.playAsync()
            setTimeout(() => sound.stopAsync(), 500)
            setTimeout(() => dispatch(visibleModal(false)), 2500)
        }
    }, [visible])

    return (
        <Dialog isVisible={visible} visible={visible} backdropStyle={{backgroundColor: '0,0,0,0.5'}} onBackdropPress={() => dispatch(visibleModal(false))}
            overlayStyle={{position: 'absolute', flexDirection: 'row', paddingVertical: 0, alignItems: 'center', height: 55, width: width, top: 0, left: 0, right: 0}}
        >
            { notify.avt && <Image source={{uri: notify.avt}} style={{width: 40, height: 40, borderRadius: 20, marginLeft: 10}} />}
            <View style={{ marginLeft: 10 }}>
                { ( notify.type === 'single-chat' || notify.type === 'group-chat') && <Text style={{ fontWeight: 'bold' }}>{notify.userName}</Text> }
                { notify.content? <Text>{notify.content}</Text> 
                    : <Text style={{ fontWeight: 'bold' }}>{notify.userName}
                        <Text style={{ fontWeight: 'normal'}}>{notify.type === 'request-add-friend'? ' đã gửi lời mời kết bạn' : ' đã đồng ý kết bạn'}</Text>
                    </Text> }
            </View>
        </Dialog>
    )
}

export default modalNotification