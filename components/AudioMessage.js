import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioUri, sender, onLongPress }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        const loadSound = async () => {
            try {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound, duration: newDuration } = await Audio.Sound.createAsync(
                    { uri: audioUri.audio },
                    { shouldPlay: false }
                );
                setSound(newSound);
                setDuration(newDuration);
            } catch (error) {
                console.error('Error loading sound', error);
            }
        };
        loadSound();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [audioUri.audio]);

const { width } = Dimensions.get('window');

    const playSound = async () => {
        try {
            if (!sound) return;
            if (!isPlaying) {
                await sound.setPositionAsync(position);
                await sound.playAsync();
                setIsPlaying(true);
                Animated.timing(animation, {
                    toValue: 1,
                    duration: (duration - position) * 1000,
                    useNativeDriver: true
                }).start();
            } else {
                await sound.pauseAsync();
                setIsPlaying(false);
                Animated.timing(animation).stop();
            }
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const stopSound = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.setPositionAsync(0);
                setIsPlaying(false);
                setPosition(0);
                Animated.timing(animation).stop();
                animation.setValue(0);
            }
        } catch (error) {
            console.error('Error stopping sound', error);
        }
    };

    const onPositionChange = (value) => {
        if (!isPlaying) {
            setPosition(value);
        }
    };

    const progressBarWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    return (
        // <TouchableOpacity style={{ width: width - 170,
        // alignItems: 'center', padding: 10,
        // backgroundColor: !sender? 'white':'#1E90FF',
        // marginLeft: !sender? 53 : width - 232, 
        // borderTopLeftRadius: 20, borderTopRightRadius: 20,
        // borderBottomRightRadius: !sender? 20:0,
        // borderBottomLeftRadius: !sender? 0:20,
        // marginBottom: 10
        // }}
        //     onLongPress={() => onLongPress(audioUri)}
        // >
        //     <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
        //         <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
        //     </TouchableOpacity>
        // </TouchableOpacity>
        <View style={{ flexDirection: 'column', alignItems: 'center' ,marginLeft:'50%',borderRadius:10}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                    <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
                </TouchableOpacity>
                <Text>{`${Math.floor(position)} / ${Math.floor(duration)}`}</Text>
            </View>
            <View style={{ width: '100%', height: 10, backgroundColor: 'lightgray' }}>
                <Animated.View
                    style={{
                        height: '100%',
                        backgroundColor: 'green',
                        transform: [{ scaleX: progressBarWidth }]
                    }}
                />
            </View>
        </View>
    );
};

export default AudioMessage;
