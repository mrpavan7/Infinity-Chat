import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";
import { socket } from "../lib/socket";
import Popup from "./popup";

const Chat = () => {
  const { state } = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState(null);
  const [visible, setVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // handle local popup messages
  useEffect(() => {
    if (state?.info) {
      setPopupMessage(state?.info);
      setVisible(true);
    }
  }, [state]);

  // Popup message event listener
  useEffect(() => {
    const handlePopup = ({ message }) => {
      if (message) {
        setVisible(true);
        setPopupMessage(message);
      }
    };

    socket.on("send-popup", handlePopup);

    return () => {
      socket.off("send-popup", handlePopup);
    };
  }, [roomId]);

  // Logic to leave the room when the room is closed by Admin
  useEffect(() => {
    socket.on("room-closed", ({ message }) => {
      navigate("/", { state: { info: message } });
    });
    return () => {
      socket.off("room-closed");
    };
  }, [navigate]);

  // user automatically get redirected to home page when the room is has zero members
  useEffect(() => {
    if (members && members <= 0) {
      navigate("/");
    }
  }, [members, navigate]);

  // to get the no of members on the Initial Mount
  useEffect(() => {
    socket.emit("get-members", { roomId });
  }, [roomId]);

  // to handle setting the members by listening on the 'set-members' event from the server
  useEffect(() => {
    const handleSetMembers = ({ members }) => {
      setMembers(members);
    };
    socket.on("set-members", handleSetMembers);

    return () => {
      socket.off("set-members", handleSetMembers);
    };
  }, []);

  // to set the messages when server broadcasts the messages by 'broadcast' event
  useEffect(() => {
    const handleBroadcast = ({ message }) => {
      if (!message) return;
      setMessages((prev) => [...prev, message]);
    };
    socket.on("broadcast", handleBroadcast);

    return () => {
      socket.off("broadcast", handleBroadcast);
    };
  }, []);

  // to scroll to the latest message automatically which is at the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // function to handle copying the invite link
  const handleInvite = async () => {
    try {
      const inviteURL = window.location.origin + "/room/join/" + roomId;
      await navigator.clipboard.writeText(inviteURL);
      setPopupMessage("Invite URL Copied!");
      setVisible(true);
    } catch (err) {
      console.error("Failed to copy invite link :" + err.message);
    }
  };

  // function to handle the closing or leaving the room
  const handleClose = () => {
    if (state?.role === "admin") {
      socket.emit(
        "close-room",
        { roomId, userRole: state?.role },
        ({ success, message }) => {
          if (!success) {
            console.error(message);
          } else {
            setMessages([]);
            setMembers(null);
            navigate("/", { state: { info: message } });
          }
        }
      );
    } else {
      socket.emit(
        "leave-room",
        { roomId, userName: state?.userName || "Anonymous" },
        ({ success, message }) => {
          if (!success) {
            console.error(message);
          } else {
            setMessages([]);
            setMembers(null);
            navigate("/", { state: { info: message } });
          }
        }
      );
    }
  };

  // function to handle the sending message to the server
  const handleSend = (message) => {
    const msg = {
      content: message,
      author: socket.id,
      userName: state?.userName,
    };
    socket.emit("message", { roomId, message: msg }, ({ success, message }) => {
      if (success) {
        setMessages((prev) => [...prev, msg]);
      } else {
        console.error(message);
      }
    });
  };

  return (
    <main className="relative h-full p-5 w-full flex flex-col justify-between max-md:h-[90vh]">
      <Popup
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        {popupMessage}
      </Popup>
      <div className="pointer-events-none absolute top-16 max-sm:top-24 left-0 right-0 h-10 max-sm:h-20 bg-gradient-to-b from-[#101010] via-[#101010]/90 to-transparent z-10"></div>
      <ChatHeader
        roomId={roomId}
        state={state}
        handleInvite={handleInvite}
        handleClose={handleClose}
        members={members}
      />
      <div>
        <div className="w-full px-5 flex flex-col gap-2 py-5 overflow-y-scroll max-h-[55vh] max-md:max-h-[75vh] max-sm:max-h-[70vh] no-scrollbar">
          {messages.map((message, i) => (
            <MessageBubble
              key={i}
              message={message}
              isCurrentUser={message.author === socket.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput handleSend={handleSend} />
      </div>
    </main>
  );
};

export default Chat;
