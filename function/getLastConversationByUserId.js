import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const getLastConversationByUserId = async (id) => {
    let response = null;
    let api = `https://deploybackend-production.up.railway.app/users/getUserById?id=${id}`;
    response = await axios.get(api);
    let conversation = {}
    try{
        if(response.data){
            conversation = {...response.data.conversation[response.data.conversation.length - 1]};
        }
    } catch (error) {
        console.log(error);
    }
    return conversation;
}

const getConversation = async (id) => {
    try{
        const conversation = await getLastConversationByUserId(id);
        return conversation;
    } catch (error) {
        console.log(error);
    }
}

export { getConversation };