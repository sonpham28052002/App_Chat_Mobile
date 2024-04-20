const getMember = (id) => {
    return receiver.members.find(item => item.member.id === id);
}

function onRetrieveMessage(messages, message) {
    const index = messages.findIndex((item) => item._id === message.id)
    let date = new Date(message.senderDate);
    let dataSend = {
        index: index,
        mess: {
            _id: message.sender.id,
            text: "Tin nhắn đã bị thu hồi!",
            createdAt: date.setUTCHours(date.getUTCHours() + 7),
            user: {
                _id: sender.id,
                name: sender.userName,
                avatar: sender.avt,
            }
        }
    }
    return dataSend;
}

export { onRetrieveMessage };