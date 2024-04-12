import React, { useState, useEffect } from 'react';
import { NativeModules, Platform, Keyboard, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const { StipopModule } = NativeModules;

const StipopSender = () => {
    useEffect(() => {
    if (StipopModule) {
      StipopModule.connect("9759023ad992a581d4b12b91d8ca373f");
      return () => {
        StipopModule.disconnect();
      };
    } else {
      console.error('StipopModule is not available.');
    }
  }, []);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isStipopShowing, setIsStipopShowing] = useState(false);

  var keyboardDidShowListener = null;
  var keyboardDidHideListener = null;

  const keyboardListenerInit = () => {
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
      setKeyboardVisible(true);
    });
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', event => {
      setKeyboardVisible(false);
      setIsStipopShowing(false);
    });
  };

  const keyboardListenerRemove = () => {
    if (keyboardDidHideListener != null) {
      keyboardDidHideListener.remove();
    }
    if (keyboardDidShowListener != null) {
      keyboardDidShowListener.remove();
    }
  };

  useEffect(() => {
    keyboardListenerInit();
    return () => {
      keyboardListenerRemove();
    };
  }, []);

  const handleStipopPress = () => {
    if (StipopModule) {
      switch (Platform.OS) {
        case 'android':
          StipopModule.show(isKeyboardVisible, isStipopShowing, resultBool => {
            setIsStipopShowing(resultBool);
          });
          break;

        case 'ios':
          StipopModule.show(
            isKeyboardVisible,
            isStipopShowing,
            (error, resultBool) => {
              setIsStipopShowing(resultBool);
            },
          );
          break;
      }
    } else {
      console.error('StipopModule is not available.');
    }
  };

  return (
    <TouchableOpacity onPress={handleStipopPress}>
      <MaterialCommunityIcons name="sticker-emoji" size={24} color="black" />
    </TouchableOpacity>
  );
};


export default StipopSender;
