import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
export const stompClient = Stomp.over(socket);