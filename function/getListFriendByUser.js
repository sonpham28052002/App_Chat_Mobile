import axios from "axios";

const getFriendByUser = async (id, friendId) => {
    let response = null;
    let api = `https://deploybackend-production.up.railway.app/users/getUserById?id=${id}`;
    response = await axios.get(api);
    let friend={};
    try {
        if (response.data) {
            let friends = response.data.friendList;
            friend = friends.find(friend => friend.user.id === friendId);
        }
    } catch (error) {
        console.log(error);
    }
    return friend;
}

export { getFriendByUser };