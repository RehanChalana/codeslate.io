import { useState } from "react";
import { useNavigate } from "react-router-dom";

const generateRoomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SlateSelection = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim().match(/^\d{6}$/)) {
      navigate(`/room/${roomId}`);
    } else {
      alert("Please enter a valid 6-digit Room ID");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <button
        onClick={createRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
      >
        Create Room
      </button>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter 6-digit Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default SlateSelection;
