import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popup from "./popup";

const Home = () => {
  const { state } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.info) {
      setIsVisible(true);
    }
  }, [state]);

  return (
    <main className="relative roboto flex items-center justify-center grow p-10 max-sm:p-4">
      <Popup onClose={() => setIsVisible(false)} visible={isVisible}>
        {state?.info}
      </Popup>
      <section className="max-w-3xl text-center py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl max-sm:text-3xl font-black">Infinity Chat</h1>
          <h2 className="text-4xl max-sm:text-2xl font-bold text-gray-500">
            Experience Effortless Conversations
          </h2>
          <p className="text-lg max-sm:text-sm text-gray-600">
            Infinity Chat lets you connect, collaborate, and share in real time.
            Instantly join a chat room or create your own space to start
            meaningful conversations with anyone, anywhere.
          </p>
        </div>
        <div className="flex justify-center gap-6 max-sm:flex-col">
          <button
            onClick={() => navigate("/room/join")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Join Existing Room
          </button>
          <button
            onClick={() => {
              navigate("/room/new");
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer"
          >
            Create New Room
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
