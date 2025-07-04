import React from "react";

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <>
      {isCurrentUser ? (
        <div className="w-fit max-w-lg py-2 px-3 bg-gray-900 rounded-lg rounded-br-none flex flex-col self-end wrap-anywhere">
          <p className="text-sm p-1">{message?.content}</p>
        </div>
      ) : (
        <div className="w-fit py-2 px-3 bg-gray-900 rounded-lg rounded-bl-none flex flex-col self-start">
          <p className="text-xs text-gray-500">{message?.userName}</p>
          <p className="text-sm p-1">{message?.content}</p>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
