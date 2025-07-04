import React, { useState } from "react";

const MessageInput = ({ handleSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    if (!message.trim()) {
      alert("Please enter the message");
      return;
    }
    e.preventDefault();
    handleSend(message);
    setMessage("");
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoComplete="off"
        id="roomId"
        type="text"
        className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="Enter Message"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
