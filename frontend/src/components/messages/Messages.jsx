import { useRef, useEffect } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages(); // It will listen for any incoming messages from the socket
  const lastMessageRef = useRef();

  // Need to write within the setTimeout because of rendering time
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    // overflow-auto gives scrollbar
    <div className="px-4 flex-1 overflow-auto">
      {/* Case 1: Show skeleton when it is loading i.e. still fetching the data */}
      {loading &&
        [...Array(4)].map((_, index) => {
          <MessageSkeleton key={index} />;
        })}
      {/* Case 2: Show a text message when there no messages between the sender and the receiver */}
      {!loading && messages.length === 0 && (
        <p className="text-center text-white ">
          Send a message to start the conversation
        </p>
      )}
      {/* Case 3: There are messages and not loading */}
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
    </div>
  );
};
export default Messages;
