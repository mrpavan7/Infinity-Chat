import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../lib/socket";

const JoinRoom = () => {
  const params = useParams();
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState(params?.roomId || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("Room ID is required.");
      return;
    }

    socket.emit("check-room", { roomId }, (isRoomExisted) => {
      if (!isRoomExisted) {
        setError("Room not exist");
      } else {
        socket.emit(
          "join-room",
          { roomId, userName: userName || "Anonymous" },
          (isJoined) => {
            if (isJoined) {
              navigate(`/room/${roomId}`, {
                state: {
                  userName: userName || "Anonymous",
                  role: "member",
                  info: `You joined the room: ${roomId}`,
                },
              });
            } else {
              console.log("Failed to join the Room");
            }
          }
        );
      }
    });

    setError("");
  };

  return (
    <main className="roboto flex items-center justify-center grow">
      <section className="p-8 max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Join a Room & Start Chatting
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter a room ID to connect with others instantly. You can use your
          name or stay anonymous—it's up to you!
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
              className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-left text-gray-700 mb-1"
              htmlFor="roomId"
            >
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => {
                setError("");
                setRoomId(e.target.value);
              }}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Join Room
          </button>
        </form>
      </section>
    </main>
  );
};

export default JoinRoom;
