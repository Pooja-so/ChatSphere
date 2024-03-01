import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // Got from URL
    const senderId = req.user._id; // Got as we set req.user=user in  protectRoute function

    // console.log("Sender", req.user);
    // Finding existing conversations between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //If there is no conversation found it means that the sender and receiver are communication for the first time.So create the conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    //Whenever sender will send any message. Message object will be instantiated containing info about message
    const newMessage = new Message({ senderId, receiverId, message });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { sendMessage, getMessages };
