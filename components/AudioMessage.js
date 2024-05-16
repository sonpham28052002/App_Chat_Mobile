import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioUri, isSender, onLongPress }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
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
        if (currentTime >= duration / 1000) {
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
        <View style={{ flexDirection: 'row', marginBottom: audioUri.extraData.react?.length > 0 ? 10 : 0 }}>
            <TouchableOpacity style={{
                borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10,
                marginLeft: !isSender ? 0 : width - 252,
                backgroundColor: !isSender ? 'white' : '#D5F1FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: !isSender ? 0 : 20,
                borderBottomRightRadius: !isSender ? 20 : 0,
                width: 200
            }} onLongPress={onLongPress}>
                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>{audioUri.user.name}</Text>
                {audioUri.replyMessage &&
                    <TouchableOpacity style={{ borderLeftWidth: 4, marginTop: 5, borderLeftColor: '#70faf3', paddingLeft: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: 700 }}>{audioUri.replyMessage.userName}</Text>
                        <Text style={{ color: 'grey', fontSize: 11 }} numberOfLines={1}>{audioUri.replyMessage.content}</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onLongPress={onLongPress}>
                    <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                        <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
                    </TouchableOpacity>
                    <Text style={{ color: 'black' }}>{`${formatTime(currentTime)} / ${formatTime(duration / 1000)}`}</Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 11,
                    color: 'grey',
                    textAlign: !isSender ? 'left' : 'right'
                }}>
                    {audioUri.createdAt ? new Date(audioUri.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Sending...'}
                </Text>
                {audioUri.extraData.react.length > 0 &&
                    <TouchableOpacity style={{
                        borderRadius: 10, flexDirection: 'row', paddingLeft: 2, paddingRight: 5, borderWidth: 1, borderColor: 'grey', backgroundColor: 'white',
                        position: 'absolute', bottom: -10, left: 20
                    }}>
                        {
                            [...new Set(audioUri.extraData.react.map(item => item.react))].slice(0, 3).map((react, index) => <Text key={index} style={{ fontSize: 9 }}>{
                                react == "HAPPY" ? "😄"
                                    : react == "HEART" ? "❤️"
                                        : react == "SAD" ? "😥"
                                            : react == "ANGRY" ? "😡"
                                                : react == "LIKE" ? "👍"
                                                    : null
                            }</Text>)
                        }
                        <Text style={{ fontSize: 9, marginLeft: 1 }}>{audioUri.extraData.react.length < 100 ? audioUri.extraData.react.length : "99+"}</Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
            {isSender && <FontAwesome name={audioUri.pending ? "circle-o" : "check-circle"} size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
        </View>
    );
};
export default AudioMessage;