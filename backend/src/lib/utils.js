export const sendMessage = () => {};

export function isRoomExists(io, roomId) {
  const rooms = io.sockets.adapter.rooms;
  return rooms.has(roomId);
}

export function isMember(io, roomId, socket) {
  return io.sockets.adapter.rooms.get(roomId).has(socket.id);
}
