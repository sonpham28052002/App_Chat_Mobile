import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';

const { StipopModule } = NativeModules;

const ConnectStipop = () => {
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

  return null;
};

export default ConnectStipop;
