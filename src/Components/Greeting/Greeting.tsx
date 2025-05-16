import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";

const Greeting = () => {
  const [greetingMessage, setGreetingMessage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isMade, setIsMade] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitUserName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMade(true);
  };

  let name;
  if (isMade && userName) {
    name = <span>{userName}</span>;
  }

  const openNameInput = () => {
    setIsMade(false);
  };

  useEffect(() => {
    const item = localStorage.getItem("userName");
    const loadedItem = item ? JSON.parse(item) : null;
    if (loadedItem) {
      setUserName(loadedItem);
    }
  }, []);

  useEffect(() => {
    const json = JSON.stringify(userName);
    localStorage.setItem("userName", json);
  }, [userName]);

  useEffect(() => {
    const time = new Date().getHours();
    if (time >= 5 && time < 12) {
      setGreetingMessage("Good Morning");
    } else if (time >= 12 && time < 18) {
      setGreetingMessage("Good Afternoon");
    } else {
      setGreetingMessage("Good Evening");
    }
  }, []);

  // Focus the input when it's displayed
  useEffect(() => {
    if (!isMade && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMade]);


  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !isMade
      ) {
        setIsMade(true);
      }
    },
    [isMade]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="flex justify-center flex-row items-center gap-24 w-[350px] h-[130px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-white p-6 shadow-lg text-center rounded-xl">
      <div className="flex flex-col items-center justify-center">
        <span className="mb-2 text-4xl tracking-wider select-none">
          {greetingMessage}
        </span>
        {!isMade ? (
          <form
            onSubmit={submitUserName}
            className="flex items-center justify-center text-4xl font-bold tracking-wider"
          >
            <input
              ref={inputRef} // Using ref to focus on input
              type="text"
              className="w-[250px] h-[50px] text-center border-none bg-transparent focus:outline-none rounded-md"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={12}
            />
          </form>
        ) : (
          <span
            className="w-[250px] h-[50px] flex items-center justify-center text-4xl font-bold tracking-wider text-orange-500"
            onClick={openNameInput}
          >
            {name}!
          </span>
        )}
      </div>
    </div>
  );
};

export default Greeting;
