const convertMessageGiftedChatToMessage = (giftedMessage, senderId, receiverId, getFileExtension) => {
    let chatMessage = {
        id: giftedMessage._id,
        senderDate: new Date(giftedMessage.createdAt),
        react: [...giftedMessage.extraData.react]
    };
    chatMessage.sender = { id: giftedMessage.user._id}
    chatMessage.receiver = giftedMessage.user._id === senderId?
        { id: receiverId } : { id: senderId }
    if (giftedMessage.text) {
        chatMessage.content = giftedMessage.text
        chatMessage.messageType = "Text"
    }
    else { // image, file, video, audio
        const u = giftedMessage.image ? giftedMessage.image : giftedMessage.file ? giftedMessage.file : giftedMessage.video ? giftedMessage.video : giftedMessage.audio;
        const uri = u.substring(u.lastIndexOf("/") + 1);
        const type = uri.substring(uri.lastIndexOf(".") + 1);
        const title = uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_")) + "." + type;
        const size = uri.substring(uri.lastIndexOf("_") + 1, uri.indexOf("."));

        chatMessage.titleFile = title;
        chatMessage.size = (parseInt(size) / 1024).toFixed(2);
        if (giftedMessage.image) {
            chatMessage.messageType = type.toUpperCase();
            chatMessage.url = giftedMessage.image;
        } else if (giftedMessage.file) {
            chatMessage.messageType = getFileExtension(giftedMessage.file).toUpperCase();
            chatMessage.url = giftedMessage.file;
        } else if (giftedMessage.video) {
            chatMessage.messageType = "VIDEO";
            chatMessage.url = giftedMessage.video;
        } else if (giftedMessage.audio) {
            chatMessage.messageType = "AUDIO";
            chatMessage.url = giftedMessage.audio;
        }
    }
    return chatMessage;
}

export { convertMessageGiftedChatToMessage }