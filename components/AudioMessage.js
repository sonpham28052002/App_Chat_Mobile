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
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const loadSound = async () => {
            try {
                if (!audioUri) {
                    console.error('Error loading sound: audioUri is null');
                    return;
                }

                if (sound) {
                    await sound.unloadAsync();
                }

                const { sound: newSound, status: { durationMillis } } = await Audio.Sound.createAsync(
                    { uri: audioUri.audio },
                    { shouldPlay: false }
                );
                setSound(newSound);
                setDuration(durationMillis);
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
    }, [audioUri]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
                setCurrentTime(status.positionMillis / 1000);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sound]);

    const { width } = Dimensions.get('window');

    const playSound = async () => {
        try {
            if (!sound) return;

            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
                if (!status.isPlaying) {
                    const newPosition = position > duration ? 0 : position;
                    await sound.setPositionAsync(newPosition);
                    await sound.playAsync();
                    setIsPlaying(true);
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: (duration - newPosition) * 1000,
                        useNativeDriver: true
                    }).start();
                } else {
                    console.log('Sound is already playing.');
                }
            } else {
                console.error('Error playing sound: Sound is not loaded.');
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

    const progressBarWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: '50%', borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                    <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
                </TouchableOpacity>
                <Text>{`${formatTime(currentTime)} / ${formatTime(duration / 1000)}`}</Text>
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
