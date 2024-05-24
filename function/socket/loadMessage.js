import axios from "axios";
import host from '../../configHost'

const getMember = (members, id) => {
    return members.find(item => item.member.id === id);
}

const getMessage = async (sender, receiver) => {
    let response = null;
    let api = ''
    let isGroup = receiver.members ? true : false // kiểm tra xem đang lấy tin nhắn group hay cá nhân
    if (!isGroup) // lấy tin nhắn cá nhân
        api = `${host}messages/getMessageByIdSenderAndIsReceiver?idSender=${sender.id}&idReceiver=${receiver.id}`
    else // lấy tin nhắn group
        api = `${host}messages/getMessageAndMemberByIdSenderAndIdGroup?idSender=${sender.id}&idGroup=${receiver.id}`
    response = await axios.get(api);
    let messages = []
    try {
        if (response.data) {
            if (response.data.length <= 20) messages = [...response.data]
            else messages = response.data.slice(-20)
            messages = messages.map(message => {
                let date = new Date(message.senderDate);
                let newMess = {
                    _id: message.id,
                    createdAt: date.setUTCHours(date.getUTCHours() + 7),
                    user: {
                        _id: message.sender.id,
                        name: message.sender.id == sender.id ? sender.userName : isGroup ? getMember(receiver.members, message.sender.id).member.userName : receiver.userName,
                        avatar: message.sender.id == sender.id ? sender.avt : isGroup ? getMember(receiver.members, message.sender.id).member.avt : receiver.avt,
                    },
                    retrieve: message.messageType === 'RETRIEVE'? true : false,
                    extraData:{
                        react: message.react? [...message.react]: []
                    },
                    replyMessage: message.replyMessage? {
                        userName: message.replyMessage.sender.id == sender.id ? sender.userName : isGroup ? getMember(receiver.members, message.replyMessage.sender.id).member.userName : receiver.userName,
                        content: message.replyMessage.messageType === 'RETRIEVE' ? "Tin nhắn đã bị thu hồi!" 
                            : message.replyMessage.messageType === 'Text' ? message.replyMessage.content
                            : message.replyMessage.messageType === 'PNG' || message.replyMessage.messageType === 'JPG' || message.replyMessage.messageType === 'JPEG' ? 'Hình ảnh'
                            : message.replyMessage.messageType === 'PDF' || message.replyMessage.messageType === 'DOC' || message.replyMessage.messageType === 'DOCX' || message.replyMessage.messageType === 'XLS' || message.replyMessage.messageType === 'XLSX' || message.replyMessage.messageType === 'PPT' || message.replyMessage.messageType === 'PPTX' || message.replyMessage.messageType === 'RAR' || message.replyMessage.messageType === 'ZIP' ? message.replyMessage.titleFile
                            : message.replyMessage.messageType === 'VIDEO' ? 'Video'
                            : message.replyMessage.messageType === 'AUDIO' ? 'Audio'
                            : ''
                    } : null
                }
                if(message.messageType === 'NOTIFICATION'){
                    if(["đã tạo nhóm.", "đã rời nhóm"].includes(message.content))
                        newMess.text = getMember(receiver.members, message.sender.id).member.userName+ " " + message.content
                    else {
                        if(!message.content) newMess.text = "Cuộc gọi nhóm"
                        else{
                        const actions = [
                            "đã phân phó nhóm cho",
                            "tước quyền phó nhóm của",
                            "đã nhường quyền trưởng nhóm lại cho"
                        ];
                        const actions2 = [
                            "đã bị mời ra khỏi nhóm bởi",
                            "đã được thêm vào nhóm bởi"
                        ]
                        const actions3 = [
                            "đã kết thúc cuộc gọi.",
                            "đã rời khỏi cuộc gọi.",
                            "đã tham gia cuộc gọi."
                        ]
                        if (actions.includes(message.content)) {
                            const user = getMember(receiver.members, message.user.id).member.userName;
                            const sender = getMember(receiver.members, message.sender.id).member.userName;
                            newMess.text = `${sender} ${message.content} ${user}`;
                        } else if(actions2.includes(message.content)){
                            const user = getMember(receiver.members, message.user.id).member.userName;
                            const sender = getMember(receiver.members, message.sender.id).member.userName;
                            newMess.text = `${user} ${message.content} ${sender}`;
                        } else if(actions3.includes(message.content)){
                            const sender = getMember(receiver.members, message.sender.id).member.userName;
                            newMess.text = `${sender} ${message.content}`;
                        } else newMess.text = 'Tin nhắn không hợp lệ!'
                    }
                    }
                    newMess.user = {
                        _id: 1
                    }
                    newMess.system = true
                }
                else if (message.messageType === 'RETRIEVE')
                    newMess.text = "Tin nhắn đã bị thu hồi!";
                else if (message.messageType === 'STICKER')
                    newMess.image = message.url
                else if (message.content)
                    newMess.text = message.content
                else if (message.messageType === 'PNG'
                    || message.messageType === 'JPG'
                    || message.messageType === 'JPEG')
                    newMess.image = message.url
                else if (message.messageType === 'PDF'
                    || message.messageType === 'DOC'
                    || message.messageType === 'DOCX'
                    || message.messageType === 'XLS'
                    || message.messageType === 'XLSX'
                    || message.messageType === 'PPT'
                    || message.messageType === 'PPTX'
                    || message.messageType === 'RAR'
                    || message.messageType === 'ZIP')
                    newMess.file = message.url
                else if (message.messageType === 'VIDEO')
                    newMess.video = message.url
                else if (message.messageType === 'AUDIO')
                    newMess.audio = message.url
                else if (message.messageType === 'CALLSINGLE')
                    newMess.call = message.titleFile
                else if (message.messageType === 'CALLGROUP') {
                    newMess.call = message.titleFile
                    newMess.link = message.url
                }
                else
                    newMess.text = "Tin nhắn không hợp lệ!"
                return newMess;
            });
        }
    } catch (error) {
        console.log(error);
    }
    return messages;
}

export { getMessage };