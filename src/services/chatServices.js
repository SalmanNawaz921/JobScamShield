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
    const chatResponse = await axios.get(
      `/api/chats/get-chats`,
      {
        params: {
          userId,
        },
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

export const ediChat = async (chatId, data) => {
  try {
    const chatResponse = await axios.put(
      "/api/chats/edit-chat",
      {
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

export const deleteChat = async (chatId) => {
  try {
    const chatResponse = await axios.delete("/api/chats/delete-chat", {
      data: { chatId }, // Data goes in the 'data' property
      withCredentials: true,
    });
    if (chatResponse.status === 200) {
      return chatResponse.data.chat;
    }
    throw new Error("Failed to delete a chat");
  } catch (error) {
    console.log(error);
  }
};
