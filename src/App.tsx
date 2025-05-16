import React, { useState } from "react";
import "./App.css";
import Time from "./Components/Time/Time";
import Todo from "./Components/Todo/Todo";
import Weather from "./Components/Weather/Weather";
import Greeting from "./Components/Greeting/Greeting";
import CryptoTracker from "./Components/Crypto/Crypto";
import Bookmarks from "./Components/Bookmarks/Bookmarks";
import { Image } from "lucide-react";

function App() {
  const [bgUrl, setBgUrl] = useState(
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [showModal, setShowModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChangeBg = () => {
    if (inputUrl.trim()) {
      setBgUrl(inputUrl.trim());
      setInputUrl("");
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        className="app-wrapper"
        style={{
          backgroundImage: `url('${bgUrl}')`,
        }}
      >
        {/* Button to open modal */}
        <button
          className="absolute top-5 right-6 z-10 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm transition-all duration-200 hover:shadow-md"
          onClick={handleOpenModal}
          title="Change background"
        >
          <Image className="p-1" />
        </button>
        {/* Modal for input */}
        {showModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 mx-4 border border-gray-800">
              <input
                type="text"
                placeholder="Enter image URL"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg mb-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleChangeBg}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Set
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="App">
          <div className="item1">
            <Bookmarks />
          </div>
          <div className="item2">
            <Time />
          </div>
          <div className="item3">
            <Greeting />
          </div>
          <div className="item4">
            <Weather />
          </div>
          <div className="item5">
            <Todo />
          </div>
          <div className="item6">
            <CryptoTracker />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
