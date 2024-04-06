import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioUri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playSound = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri.audio },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const stopSound = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error stopping sound', error);
        }
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default AudioMessage;
