import axios from "axios";

export const addMessage = async (data) => {
  try {
    const messageResponse = await axios.post(
      "/api/messages/create",
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    if (messageResponse.status === 200) {
      return messageResponse.data.data;
    }
    throw new Error("Failed to create a message");
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (chatId) => {
  try {
    const messageResponse = await axios.get(
      "/api/messages/get",
      {
        params: {
          chatId,
        },
      },
      {
        withCredentials: true,
      }
    );
    if (messageResponse.status === 200) {
      return messageResponse.data.data;
    }
    throw new Error("Failed to get messages");
  } catch (error) {
    console.log(error);
  }
};

export const ediMessage = async (messageId, data) => {
  try {
    const messageResponse = await axios.put(
      "/api/messages/edit",
      {
        messageId,
        data,
      },
      {
        withCredentials: true,
      }
    );
    if (messageResponse.status === 200) {
      return messageResponse.data.data;
    }
    throw new Error("Failed to edit a message");
  } catch (error) {
    console.log(error);
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const messageResponse = await axios.delete(
      `/api/messages/delete/${messageId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (messageResponse.status === 200) {
      return messageResponse.data;
    }
    throw new Error("Failed to delete a message");
  } catch (error) {
    console.log(error);
  }
};
