import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioUri, isSender, onLongPress }) => {
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
        let interval
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prevSeconds => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if(currentTime >= duration/1000) {
            setIsPlaying(false);
            setCurrentTime(0);
            setPosition(0);
            stopSound();
        }
    }, [currentTime]);

    const playSound = async () => {
        try {
            if (!sound) return;
            await sound.playAsync();
            setIsPlaying(true);
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
                setCurrentTime(0);
            }
        } catch (error) {
            console.error('Error stopping sound', error);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const { width } = Dimensions.get('window');

    return (
        <View style={{
            borderRadius: 5, paddingVertical: 10, paddingHorizontal: 10,
            marginLeft: !isSender ? 0 : width - 252,
            backgroundColor: !isSender ? 'white' : '#1E90FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: !isSender ? 0 : 20,
            borderBottomRightRadius: !isSender ? 20 : 0,
            width: 150
        }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onLongPress={onLongPress}>
                <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                    <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
                </TouchableOpacity>
                <Text style={{ color: !isSender ? 'black' : 'white' }}>{`${formatTime(currentTime)} / ${formatTime(duration / 1000)}`}</Text>
            </TouchableOpacity>
            <Text style={{
                fontSize: 11,
                color: !isSender ? 'grey' : 'white',
                textAlign: !isSender ? 'left' : 'right'
            }}>
                {new Date(audioUri.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Text>
        </View>
    );
};
export default AudioMessage;
