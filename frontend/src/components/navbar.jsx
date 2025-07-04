import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-5 p-3 border-b border-gray-600">
      <div className="flex gap-2 items-center">
        <div className="w-3 aspect-square rounded-full bg-green-500"></div>
        <div className="w-3 aspect-square rounded-full bg-yellow-500"></div>
        <div
          onClick={() => navigate("/")}
          className="w-3 aspect-square rounded-full bg-red-500"
        ></div>
      </div>
      {/* <p className="text-xl font-bold">Chatty</p> */}
    </div>
  );
};

export default Navbar;
