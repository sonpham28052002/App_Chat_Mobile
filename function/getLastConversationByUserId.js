import axios from "axios";
import host from "../configHost";

const getLastConversationByUserId = async (id) => {
    let response = null;
    let api = `${host}users/getUserById?id=${id}`;
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