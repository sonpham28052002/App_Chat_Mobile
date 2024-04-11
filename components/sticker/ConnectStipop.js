import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';

const { StipopModule } = NativeModules;

const ConnectStipop = () => {
  useEffect(() => {
    StipopModule.connect("9759023ad992a581d4b12b91d8ca373f");
    return () => {
      StipopModule.disconnect();
    };
  }, []);

  return null;
};

export default ConnectStipop;
