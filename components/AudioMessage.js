import React, { useState } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioUri, sender, onLongPress }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

const { width } = Dimensions.get('window');

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
        <TouchableOpacity style={{ width: width - 170,
        alignItems: 'center', padding: 10,
        backgroundColor: !sender? 'white':'#1E90FF',
        marginLeft: !sender? 53 : width - 232, 
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomRightRadius: !sender? 20:0,
        borderBottomLeftRadius: !sender? 0:20,
        marginBottom: 10
        }}
            onLongPress={() => onLongPress(audioUri)}
        >
            <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={35} color="black" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default AudioMessage;
