import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboard } from "react-icons/fa";
import {
  auth,
  saveMeeting,
  fetchMeetings,
  deleteMeeting,
} from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const generateRoomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SlateSelection = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("Guest");
  const [userId, setUserId] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
  });
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.email);
        setUserId(user.uid);
        loadMeetings(user.uid);
      }
    });
  }, []);

  const loadMeetings = async (userId) => {
    const data = await fetchMeetings(userId);
    setMeetings(data);
  };

  // useEffect(() => {
  //   // Retrieve username from localStorage
  //   const storedUsername = JSON.parse(localStorage.getItem("user"))?.email;
  //   console.log(storedUsername)
  //   if (storedUsername) {
  //     setUsername(storedUsername);
  //   }
  // }, []);

  const joinRoom = () => {
    if (roomId.trim().match(/^\d{6}$/)) {
      navigate(`/room/${roomId}`);
    } else {
      alert("Please enter a valid 6-digit Room ID");
    }
  };

  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      alert("Please fill in all fields");
      return;
    }

    const dateTime = `${newMeeting.date}T${newMeeting.time}`;
    const newRoomId = generateRoomId();
    await saveMeeting(userId, newMeeting.title, dateTime, newRoomId);
    setNewMeeting({ title: "", date: "", time: "" });
    loadMeetings(userId);
  };

  const handleDeleteMeeting = async (meetingId) => {
    await deleteMeeting(meetingId);
    loadMeetings(userId);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 pt-10 bg-black">
        <div className="space-x-4 flex items-center">
          <div 
          onClick={() => navigate("/")}
          className="text-4xl font-semibold cursor-pointer"
          >
            <span className="text-[#e2ff24]">&lt;/</span>
            <span className="text-white">codeslate.io</span>
            <span className="text-[#24fe41]">&gt;</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex">
        <div className="w-[96vw] bg-[#141414] mx-[2vw] my-[3vh] p-6 rounded-2xl shadow-lg">
          {/* Top Section: Profile and Plan */}
          <div className="flex justify-between items-center bg-[#1e1e1e] px-4 rounded-lg mb-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#303030] flex items-center justify-center text-xl font-bold text-[#e2ff24] rounded-full">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white text-xl font-semibold">{username}</div>
              </div>
            </div>

            {/* Add Meeting Section */}
            <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-2xl">
              <div className="flex flex-wrap gap-4">
                {/* Meeting Title */}
                <input
                  type="text"
                  placeholder="Meeting Title"
                  value={newMeeting.title}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, title: e.target.value })
                  }
                  className="flex-grow p-2 bg-[#141414] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#24fe41]"
                />

                {/* Meeting Date */}
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, date: e.target.value })
                  }
                  className="p-2 bg-[#141414] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#24fe41]"
                />

                {/* Meeting Time */}
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, time: e.target.value })
                  }
                  className="p-2 bg-[#141414] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#24fe41]"
                />

                {/* Add Meeting Button */}
                <button
                  onClick={handleAddMeeting}
                  className="px-4 py-2 bg-[#24fe41] text-black rounded-lg shadow-lg hover:bg-[#24fe41] transition-all duration-300 cursor-pointer"
                >
                  Add Meeting
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex space-x-6 h-[58vh]">
            {/* Left Section */}
            <div className="flex gap-6 h-full space-y-6 flex-grow">
              {/* Upcoming Meetings */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg flex-1 h-full">
                <h2 className="text-white text-xl mb-4 font-semibold">Upcoming Meetings</h2>
                {meetings.length > 0 ? (
                  meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-[#141414] p-4 rounded-lg text-white flex justify-between items-center mb-2"
                    >
                      <div>
                        <p>
                          <p className="text-lg">{meeting.title}</p>
                        </p>
                        <div className="text-sm flex gap-4 opacity-60">
                        <span>{new Date(meeting.dateTime).toLocaleString()}</span>
                        {/* <span>Room ID: {meeting.roomId}</span> */}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No upcoming meetings</p>
                )}
              </div>

              {/* Join/Host Buttons with Input */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg flex-1">
                <div className="flex flex-col space-y-4">
                  <img
                    src="/interview.png"
                    className="w-full max-w-[200px] mx-auto h-auto"
                    alt="Interview"
                  />

                  {/* Input Field */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit Room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="flex-grow p-2 py-[10px] bg-[#141414] text-white border border-gray-700 rounded-lg"
                    />
                    <button
                      onClick={joinRoom}
                      className="px-4 py-2 font-semibold bg-[#24fe41] text-xl text-black rounded-md shadow-lg hover:bg-green-600 cursor-pointer"
                    >
                      Join Room
                    </button>
                  </div>

                  {/* Host Room Button */}
                  <button
                    onClick={createRoom}
                    className="w-full px-4 py-3 font-semibold bg-[#e2ff24] text-xl text-black rounded-md shadow-lg hover:bg-[#e2ff24]/80"
                  >
                    Host Room
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-[30%] bg-[#1e1e1e] p-6 rounded-lg">
              <h2 className="text-white text-xl mb-4 font-semibold">Your Activity</h2>
              <div className="space-y-4">
                {/* Activity Items */}
                <div 
                 onClick={() => navigate("/whiteboard")}
                 className="flex items-center space-x-4 w-full text-left hover:bg-gray-800 p-2 rounded-lg transition cursor-pointer"
              >
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                    <FaChalkboard />
                  </div>
                  <div>
                    <p className="text-white">Whiteboard</p>
                    <p className="text-gray-500 text-sm">
                      Open a Whiteboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlateSelection;
