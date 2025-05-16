import React, { useState, useEffect } from "react";

const Time: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const currentDate = new Date().toDateString().slice(0, 11);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="flex justify-center flex-row items-center gap-24 w-[350px] h-[130px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-white p-6 shadow-lg text-center rounded-xl">
        <div className="flex flex-col select-none">
          <span className="text-4xl font-bold tracking-wider mb-1">
            {currentTime}
          </span>
          <span className="text-lg text-gray-300">{currentDate}</span>
        </div>
        <div className="h-full flex items-center justify-center">
          <video
            src="rbgFire.webm"
            autoPlay
            loop
            muted
            playsInline
            className="h-24 w-24 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* <div className="flex justify-center flex-col w-[350px] h-[130px] bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg text-center">
        <span className="text-4xl tracking-wide">{currentTime}</span>
        <span className="text-lg">{currentDate}</span>
      </div> */}
    </>
  );
};

export default Time;
