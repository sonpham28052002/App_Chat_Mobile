let sender = null
let receiver = null

const getMember = (id) => {
    return receiver.members.find(item => item.member.id === id);
}

function addMessage(message, type){
    let date = new Date(message.senderDate);
    let newMessage = {
        _id: message.id,
        createdAt: date.setUTCHours(date.getUTCHours() + 7),
        user: {
            _id: message.sender.id,
            name: message.sender.id === sender.id ? sender.userName : type == "group"? getMember(message.sender.id).member.userName : receiver.userName,
            avatar: message.sender.id === sender.id ? sender.avt : type == "group"? getMember(message.sender.id).member.avt : receiver.avt,
        },
        pending: message.sender.id === sender.id? false : null,
        extraData:{
            react: []
        },
        replyMessage: message.replyMessage? {
            userName: message.replyMessage.sender.id == sender.id ? sender.userName : type == "group"? getMember(message.replyMessage.sender.id).member.userName : receiver.userName,
            content: message.replyMessage.messageType === 'RETRIEVE' ? "Tin nhắn đã bị thu hồi!"
                : message.replyMessage.messageType === 'Text' ? message.replyMessage.content
                    : message.replyMessage.messageType === 'PNG' || message.replyMessage.messageType === 'JPG' || message.replyMessage.messageType === 'JPEG' ? 'Hình ảnh'
                        : message.replyMessage.messageType === 'PDF' || message.replyMessage.messageType === 'DOC' || message.replyMessage.messageType === 'DOCX' || message.replyMessage.messageType === 'XLS' || message.replyMessage.messageType === 'XLSX' || message.replyMessage.messageType === 'PPT' || message.replyMessage.messageType === 'PPTX' || message.replyMessage.messageType === 'RAR' || message.replyMessage.messageType === 'ZIP' ? message.replyMessage.titleFile
                            : message.replyMessage.messageType === 'VIDEO' ? 'Video'
                                : message.replyMessage.messageType === 'AUDIO' ? 'Audio'
                                    : ''
        } : null
    };
    if (message.messageType == 'NOTIFICATION') {
        if (message.content == "đã bị mời ra khỏi nhóm bởi")
            newMessage.text = getMember(message.user.id).member.userName + " " + message.content + " " + getMember(message.sender.id).member.userName;
        else if (message.content == "đã được thêm vào nhóm bởi")
            newMessage.text = getMember(message.user.id).member.userName + " " + message.content + " " + getMember(message.sender.id).member.userName;
        else if (message.content == "đã phân phó nhóm cho")
            newMessage.text = getMember(message.user.id).member.userName + " " + message.content + " " + getMember(message.sender.id).member.userName;
        else if (message.content == "tước quyền phó nhóm của")
            newMessage.text = getMember(message.user.id).member.userName + " " + message.content + " " + getMember(message.sender.id).member.userName;
        newMessage.system = true;
    }
    else if (message.content)
        newMessage.text = message.content;
    else {
        if (message.messageType == 'CALLSINGLE')
            newMessage.call = message.titleFile
        else if (message.messageType == 'STICKER')
            newMessage.image = message.url;
        else if (message.messageType == 'PNG' || message.messageType == 'JPG' || message.messageType == 'JPEG')
            newMessage.image = message.url;
        else if (message.messageType == 'AUDIO')
            newMessage.audio = message.url;
        else if (message.messageType == 'VIDEO')
            newMessage.video = message.url;
        else if (message.messageType == 'PDF' || message.messageType == 'DOC'
            || message.messageType == 'DOCX' || message.messageType == 'XLS'
            || message.messageType == 'XLSX' || message.messageType == 'PPT'
            || message.messageType == 'PPTX' || message.messageType == 'RAR'
            || message.messageType == 'ZIP' || message.messageType == 'TXT'
            || message.messageType == 'JSON' || message.messageType == 'XML'
            || message.messageType == 'CSV' || message.messageType == 'HTML')
            newMessage.file = message.url;
    }
    return newMessage;
}

function onMessageReceive(message, s, r) {
    sender = s;
    receiver = r;
    return receiver.members? addMessage(message, "group") : addMessage(message, "single");
}

export { onMessageReceive };