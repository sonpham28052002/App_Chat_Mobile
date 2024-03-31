import store from './Redux/store'
import { Provider } from 'react-redux';
import Auth from './screens/auth/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
        <Auth />
    </Provider>
    </GestureHandlerRootView>
  );
}