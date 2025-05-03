import axios from "axios";

export const addBotResponse = async (data) => {
  console.log(data, "data in addBotResponse");
  try {
    const botResponseResponse = await axios.post(
      "/api/botResponses/create",
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    if (botResponseResponse.status === 200) {
      return botResponseResponse.data.data;
    }
    throw new Error("Failed to create a botResponse");
  } catch (error) {
    console.log(error);
  }
};

export const getBotResponses = async (chatId) => {
  console.log(chatId, "chatId of getBotResponses");
  try {
    const botResponseResponse = await axios.get(
      "/api/botResponses/get",
      {
        params: {
          chatId,
        },
      },
      {
        withCredentials: true,
      }
    );
    if (botResponseResponse.status === 200) {
      return botResponseResponse.data.data;
    }
    throw new Error("Failed to get botResponses");
  } catch (error) {
    console.log(error);
  }
};

export const ediBotResponse = async (botResponseId, data) => {
  try {
    const botResponseResponse = await axios.put(
      "/api/botResponses/edit",
      {
        botResponseId,
        data,
      },
      {
        withCredentials: true,
      }
    );
    if (botResponseResponse.status === 200) {
      return botResponseResponse.data.data;
    }
    throw new Error("Failed to edit a botResponse");
  } catch (error) {
    console.log(error);
  }
};

export const deleteBotResponse = async (botResponseId) => {
  try {
    const botResponseResponse = await axios.delete(
      `/api/botResponses/delete/${botResponseId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (botResponseResponse.status === 200) {
      return botResponseResponse.data;
    }
    throw new Error("Failed to delete a botResponse");
  } catch (error) {
    console.log(error);
  }
};
