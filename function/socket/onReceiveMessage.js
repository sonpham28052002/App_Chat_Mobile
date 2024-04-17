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
            // name: message.sender.id === sender.id ? sender.userName : receiver.userName,
            // avatar: message.sender.id === sender.id ? sender.avt : receiver.avt,
        },
    };
    if (message.content)
        newMessage.text = message.content;
    else {
        if (message.messageType == 'PNG' || message.messageType == 'JPG' || message.messageType == 'JPEG')
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