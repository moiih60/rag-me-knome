import React, { useState } from "react";

function ChatInput() {

  const [input, setInput] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }


  return (
    <>
      <div className="w-fit p-3 px-5 flex flex-row gap-2 border-3 items-center justify-between border-green-600 rounded-full">
            {/* User Input Field */}
          <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder="Hit your questions here..."
              className="focus:outline-none"
          />

          {/* Send User Input Button */}
        <button className="p-1 px-1.5 text-white text-sm bg-blue-700 rounded-sm cursor-pointer">
          Send
        </button>
      </div>
      

      {/* <div className="bg-green-400 p-2 rounded-md">
        Chat Input Section....
      </div> */}
    </>
  );
}

export default ChatInput;