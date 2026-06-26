import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";


function Chat() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="">
          <ChatHistory />
        </div>

        <div className="flex justify-center">
          <ChatInput />
        </div>
      </div>
    </>
  );
}

export default Chat;