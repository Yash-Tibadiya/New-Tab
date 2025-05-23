import { useState, useEffect, useRef } from "react";
import "./App.css";
import Time from "./Components/Time/Time";
import Todo from "./Components/Todo/Todo";
import Weather from "./Components/Weather/Weather";
import Greeting from "./Components/Greeting/Greeting";
import CryptoTracker from "./Components/Crypto/Crypto"; // Assuming these components exist
import Bookmarks from "./Components/Bookmarks/Bookmarks"; // Assuming these components exist
import { Image } from "lucide-react";

function App() {
  const [bgUrl, setBgUrl] = useState<string>(() => {
    const storedBgUrl = localStorage.getItem("bgUrl");
    return (
      storedBgUrl ||
      "https://static.moewalls.com/videos/preview/2025/sakura-field-minecraft-preview.webm"
    );
    // "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  });
  const [showModal, setShowModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setInputUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setInputUrl(""); // Clear URL input if a file is selected
    } else {
      // Handle case where user cancels file dialog
      setSelectedFile(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    if (e.target.value && selectedFile) {
      setSelectedFile(null); // Clear file if URL is typed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleChangeBg = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Approx 5MB limit for base64 string. localStorage might struggle with more.
        if (result.length > 5 * 1024 * 1024) {
          alert(
            `File is large (${(selectedFile.size / 1024 / 1024).toFixed(
              2
            )} MB, resulting in a ${(result.length / 1024 / 1024).toFixed(
              2
            )} MB Data URL). Local storage may not save it reliably or performance might be affected. Consider using smaller files.`
          );
        }
        setBgUrl(result);
        handleCloseModal(); // Resets inputs and closes modal
      };
      reader.onerror = () => {
        console.error("Error reading file.");
        alert("Error reading file. Please try again.");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(selectedFile);
    } else if (inputUrl.trim()) {
      try {
        // Basic check: try to parse it as a URL.
        // This doesn't guarantee it's a valid image/video URL, but catches some malformed inputs.
        new URL(inputUrl.trim());
        setBgUrl(inputUrl.trim());
        handleCloseModal(); // Resets inputs and closes modal
      } catch {
        alert("Invalid URL. Please enter a valid image or video URL.");
        // setInputUrl(""); // Optionally clear the invalid input
      }
    }
  };

  useEffect(() => {
    if (bgUrl) {
      // Only save if bgUrl is not empty/null
      try {
        localStorage.setItem("bgUrl", bgUrl);
      } catch (error) {
        console.error("Error saving bgUrl to localStorage:", error);
        alert(
          "Could not save background preference. Local storage might be full or disabled. Large images/videos are more likely to cause this."
        );
      }
    }
  }, [bgUrl]);

  const isVideo =
    bgUrl &&
    (bgUrl.toLowerCase().startsWith("data:video/") ||
      bgUrl.toLowerCase().endsWith(".mp4") ||
      bgUrl.toLowerCase().endsWith(".webm"));

  return (
    <>
      <div
        className="app-wrapper"
        style={{
          backgroundImage: isVideo || !bgUrl ? "none" : `url('${bgUrl}')`,
        }}
      >
        {isVideo && bgUrl && (
          <video
            key={bgUrl} // Add key to force re-render if src changes
            src={bgUrl}
            autoPlay
            loop
            muted
            playsInline // Important for videos on mobile browsers
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              left: 0,
              top: 0,
              zIndex: -1,
            }}
            onError={(e) => {
              console.error("Video load error:", e);
              // Optionally, clear bgUrl or show a fallback if video fails to load
            }}
          />
        )}
        <button
          className="absolute top-5 right-6 z-10 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm transition-all duration-200 hover:shadow-md"
          onClick={handleOpenModal}
          title="Change background"
        >
          <Image className="p-1" />
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 mx-4 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-5">
                Change Background
              </h3>

              <label
                htmlFor="bg-url-input"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Enter Image/Video URL
              </label>
              <input
                id="bg-url-input"
                type="text"
                placeholder="https://example.com/image.jpg or video.mp4"
                value={inputUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-600" />
                <span className="mx-3 text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-600" />
              </div>

              <div className="mb-5">
                {" "}
                {/* Container for file input and its info */}
                <label
                  htmlFor="bg-file-input"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Upload Image/Video from Device{" "}
                  <span className="text-red-500">{`( Size < 4MB )`}</span>
                </label>
                <input
                  id="bg-file-input"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-400 mt-2">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleChangeBg}
                  disabled={!inputUrl.trim() && !selectedFile}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Set
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-600 cursor-pointer"
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
