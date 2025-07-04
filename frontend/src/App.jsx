import { Route, Routes } from "react-router-dom";
import Room from "./components/room";
import Home from "./components/home";
import Navbar from "./components/navbar";
import NewRoom from "./components/newRoom";
import JoinRoom from "./components/joinRoom";
import Chat from "./components/chat";

function App() {
  return (
    <div className="min-md:border flex flex-col bg-[#101010] min-md:border-gray-600 min-md:w-[65vw] min-md:h-[80vh] w-full h-screen max-w-5xl min-md:rounded-lg">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />}>
          <Route path="new" element={<NewRoom />} />
          <Route path="join" element={<JoinRoom />} />
          <Route path="join/:roomId" element={<JoinRoom />} />
          <Route path=":roomId" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
