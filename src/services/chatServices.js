import axios from "axios";

export const addChat = async (userId) => {
  try {
    const chatResponse = await axios.post(
      "/api/chats/add-chat",
      {
        userId,
      },
      {
        withCredentials: true,
      }
    );
    if (chatResponse.status === 200) {
      return chatResponse.data.chat;
    }
    throw new Error("Failed to create a chat");
  } catch (error) {
    console.log(error);
  }
};

export const getChats = async (userId) => {
  try {
    const chatResponse = await axios.post(
      "/api/chats/get-chats",
      {
        userId,
      },
      {
        withCredentials: true,
      }
    );
    if (chatResponse.status === 200) {
      return chatResponse.data.chats;
    }
    throw new Error("Failed to get chats");
  } catch (error) {
    console.log(error);
  }
};

export const ediChat = async (userId, chatId, data) => {
  try {
    const chatResponse = await axios.post(
      "/api/chats/edit-chat",
      {
        userId,
        chatId,
        data,
      },
      {
        withCredentials: true,
      }
    );
    if (chatResponse.status === 200) {
      return chatResponse.data.chat;
    }
    throw new Error("Failed to edit a chat");
  } catch (error) {
    console.log(error);
  }
};

export const deleteChat = async (userId, chatId) => {
  try {
    const chatResponse = await axios.post(
      "/api/chats/delete-chat",
      {
        userId,
        chatId,
      },
      {
        withCredentials: true,
      }
    );
    if (chatResponse.status === 200) {
      return chatResponse.data.chat;
    }
    throw new Error("Failed to delete a chat");
  } catch (error) {
    console.log(error);
  }
};
