import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const handlePushNotification = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;
    if (data && data.screen === 'Chat') {
      navigation.navigate('Chat', { userId: data.userId });
    }
  };

  const sendPushNotification = async () => {
    const message = {
      to: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
      sound: 'default',
      title: 'Tiêu đề thông báo',
      body: 'Nội dung thông báo',
      data: { screen: 'Chat', userId: 'user123' },
    };

    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null,
    });
  };

  return { sendPushNotification };
};

export default handlePushNotification;
