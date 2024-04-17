function onRetrieveMessage(payload) {
    let message = JSON.parse(payload.body)
    if (message.messageType === 'RETRIEVE') {
        const index = [...messages].findIndex((item) => item._id === message.id)
        if (index === -1) getMessage();
        if (index !== -1) {
            let date = new Date(message.senderDate);
            dispatch(retreiveMess({
                index: index, mess: {
                    _id: message.sender.id,
                    text: "Tin nhắn đã bị thu hồi!",
                    createdAt: date.setUTCHours(date.getUTCHours() + 7),
                    user: {
                        _id: sender.id,
                        name: sender.userName,
                        avatar: sender.avt,
                    }
                }
            }));
        }
        hideModal();
        // updateMess();
    }
}

export { onRetrieveMessage };