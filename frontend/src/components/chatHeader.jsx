const ChatHeader = ({ roomId, state, handleInvite, handleClose, members }) => {
  return (
    <div className="flex items-start justify-between mb-5 gap-5">
      <div className="text-sm flex flex-col gap-1">
        <h2 className="font-medium flex gap-2">
          Room : <span>{roomId}</span>
        </h2>
        <h2 className="font-medium flex gap-2">
          Members : <span>{members}</span>
        </h2>
      </div>
      <div className="flex gap-2">
        {state?.role === "admin" && (
          <button
            onClick={handleInvite}
            className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition cursor-pointer"
          >
            Invite Friends
          </button>
        )}
        <button
          onClick={handleClose}
          className="bg-red-500 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition cursor-pointer"
        >
          {state?.role === "admin" ? "Close Room" : "Leave Room"}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
