import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";

const generateRoomId = () => {
  // Simple random alphanumeric string
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const NewRoom = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    setRoomId(generateRoomId());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("Room ID is required.");
      return;
    }

    socket.emit("check-room", { roomId }, (isRoomExisted) => {
      if (isRoomExisted) {
        setError(`Room with id '${roomId}' is already exist. Try another Id.`);
        console.log("room already exist");
      } else {
        socket.emit("create-room", { roomId }, (isCreated) => {
          if (isCreated) {
            navigate(`/room/${roomId}`, {
              state: { userName: userName || "Anonymous", role: "admin" },
            });
          } else {
            alert("Failed to create room.Please try again");
          }
        });
      }
    });

    setError("");
  };

  return (
    <main className="roboto flex items-center justify-center grow">
      <section className="p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Create a New Chat Room
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Set up your own chat room and invite others to join. Choose a unique
          Room ID or generate one automatically.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-left text-gray-700 mb-1"
              htmlFor="userName"
            >
              Username
            </label>
            <input
              id="userName"
              type="text"
              className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => {
                setError("");
                setUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <label
              className="block text-left text-gray-700 mb-1"
              htmlFor="roomId"
            >
              Room ID
            </label>
            <div className="flex gap-2">
              <input
                id="roomId"
                type="text"
                className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                placeholder="Enter or generate room ID"
                value={roomId}
                onChange={(e) => {
                  setError("");
                  setRoomId(e.target.value);
                }}
                required
              />
              <button
                type="button"
                className="bg-blue-600 px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                onClick={handleGenerate}
              >
                Generate
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer"
          >
            Create New Room
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewRoom;
