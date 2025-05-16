/* eslint-disable prefer-const */
import React, { useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import { Loader2, TrendingUp, X, Edit3 } from "lucide-react"; // Added Edit3 for custom icon
import { AlertCircle } from "lucide-react";

const coinstatsApiKey = import.meta.env.VITE_COINSTATS_API_KEY;
const baseUrl = import.meta.env.VITE_COINSTATS_BASE_URL;

// Renamed Coin to CoinOption and Currency to CurrencyOption to avoid confusion with CoinData
interface CoinOption {
  id: string;
  name: string;
  symbol: string | JSX.Element; // Allow JSX for custom icon
  color: string;
  gradient: string;
}

interface CurrencyOption {
  code: string;
  symbol: string | JSX.Element; // Allow JSX for custom icon
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  priceChange1d: number;
  priceChange1h: number;
  priceChange1w: number;
  volume: number;
  icon: string;
}

interface ApiResponse {
  result: CoinData[];
  meta: {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

const coinOptions: CoinOption[] = [
  {
    id: "bitcoin",
    name: "bitcoin",
    symbol: "BTC",
    color: "from-orange-400 to-orange-600",
    gradient: "hover:from-orange-500 hover:to-orange-700",
  },
  {
    id: "ethereum",
    name: "ethereum",
    symbol: "ETH",
    color: "from-purple-400 to-purple-600",
    gradient: "hover:from-purple-500 hover:to-purple-700",
  },
  {
    id: "custom_coin", // Identifier for the custom coin slot
    name: "Custom Coin", // Placeholder name
    symbol: <Edit3 size={18} />, // Icon for custom
    color: "from-cyan-400 to-sky-600", // Different color for custom slot
    gradient: "hover:from-cyan-500 hover:to-sky-700",
  },
];

const currencyOptions: CurrencyOption[] = [
  { code: "USD", symbol: "$" },
  { code: "INR", symbol: "₹" },
  {
    code: "custom_currency", // Identifier for custom currency slot
    symbol: <Edit3 size={18} />, // Icon for custom
  },
];

const CryptoTracker = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  const [showCustomCoinInput, setShowCustomCoinInput] =
    useState<boolean>(false);
  const [customCoinInputValue, setCustomCoinInputValue] = useState<string>("");
  const customCoinInputRef = useRef<HTMLInputElement>(null);

  const [showCustomCurrencyInput, setShowCustomCurrencyInput] =
    useState<boolean>(false);
  const [customCurrencyInputValue, setCustomCurrencyInputValue] =
    useState<string>("");
  const customCurrencyInputRef = useRef<HTMLInputElement>(null);

  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (showCustomCoinInput && customCoinInputRef.current) {
      customCoinInputRef.current.focus();
    }
  }, [showCustomCoinInput]);

  useEffect(() => {
    if (showCustomCurrencyInput && customCurrencyInputRef.current) {
      customCurrencyInputRef.current.focus();
    }
  }, [showCustomCurrencyInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCustomCoinInput &&
        customCoinInputRef.current &&
        !customCoinInputRef.current.contains(event.target as Node)
      ) {
        if (customCoinInputValue.trim()) {
          setSelectedCoin(customCoinInputValue.trim());
        } else {
          setSelectedCoin(coinOptions[0].id);
        }
        setShowCustomCoinInput(false);
        setCoinData(null);
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCustomCoinInput, customCoinInputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCustomCurrencyInput &&
        customCurrencyInputRef.current &&
        !customCurrencyInputRef.current.contains(event.target as Node)
      ) {
        if (customCurrencyInputValue.trim()) {
          setSelectedCurrency(customCurrencyInputValue.trim().toUpperCase());
        } else {
          setSelectedCurrency("");
        }
        setShowCustomCurrencyInput(false);
        setCoinData(null);
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCustomCurrencyInput, customCurrencyInputValue]);

  const fetchCoinData = async () => {
    if (!selectedCurrency || selectedCurrency === "custom_currency") {
      setError("Please select or enter a valid currency");
      return;
    }
    if (!selectedCoin || selectedCoin === "custom_coin") {
      setError("Please select or enter a valid coin");
      return;
    }

    setLoading(true);
    setError("");
    setCoinData(null);

    try {
      let coinNameForApi: string;
      const predefinedCoin = coinOptions.find(
        (co) => co.id === selectedCoin && co.id !== "custom_coin"
      );
      coinNameForApi = predefinedCoin ? predefinedCoin.name : selectedCoin;

      let currencyCodeForApi: string;
      const predefinedCurrency = currencyOptions.find(
        (co) => co.code === selectedCurrency && co.code !== "custom_currency"
      );
      currencyCodeForApi = predefinedCurrency
        ? predefinedCurrency.code
        : selectedCurrency;

      const response = await fetch(
        `${baseUrl}?currency=${currencyCodeForApi}&name=${coinNameForApi}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-KEY": coinstatsApiKey || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `API error: ${response.status}` }));
        throw new Error(
          errorData.message ||
            `Failed to fetch data (status ${response.status})`
        );
      }

      const data: ApiResponse = await response.json();

      if (data.result && data.result.length > 0) {
        const foundCoin =
          data.result.find(
            (c: CoinData) =>
              c.name.toLowerCase() === coinNameForApi.toLowerCase() ||
              c.symbol.toLowerCase() === coinNameForApi.toLowerCase()
          ) || data.result[0];

        if (foundCoin) {
          setCoinData(foundCoin);
          setShowDrawer(true);
        } else {
          throw new Error(`Data for ${coinNameForApi} not found.`);
        }
      } else {
        throw new Error(
          `No results for ${coinNameForApi} in ${currencyCodeForApi}. Check coin name/availability.`
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setCoinData(null);
      setShowDrawer(false);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const handleCustomCoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customCoinInputValue.trim()) {
      setSelectedCoin(customCoinInputValue.trim());
      setShowCustomCoinInput(false);
      setCoinData(null);
      setError("");
    } else {
      setSelectedCoin(coinOptions[0].id); // Revert to default
      setShowCustomCoinInput(false);
      setError("Custom coin name cannot be empty.");
    }
  };

  const handleCustomCurrencySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customCurrencyInputValue.trim()) {
      setSelectedCurrency(customCurrencyInputValue.trim().toUpperCase());
      setShowCustomCurrencyInput(false);
      setCoinData(null);
      setError("");
    } else {
      setSelectedCurrency(""); // Revert
      setShowCustomCurrencyInput(false);
      setError("Custom currency code cannot be empty.");
    }
  };

  const currentCoinForDrawer =
    coinOptions.find((opt) => opt.id === selectedCoin) ||
    (selectedCoin && selectedCoin !== "custom_coin"
      ? {
          id: selectedCoin,
          name: selectedCoin,
          symbol: selectedCoin.substring(0, 3).toUpperCase(),
          color: "from-gray-500 to-gray-700", // Default color for custom coin fallback
          gradient: "",
        }
      : coinOptions[2]); // Fallback to the "custom_coin" option's style if needed

  const currentCurrencyForDrawer =
    currencyOptions.find((opt) => opt.code === selectedCurrency) ||
    (selectedCurrency && selectedCurrency !== "custom_currency"
      ? {
          code: selectedCurrency,
          symbol: selectedCurrency.toUpperCase(), // For custom, display code as symbol
        }
      : { code: "", symbol: "" });

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl w-[350px] h-full max-w-md overflow-hidden relative select-none">
      {/* Main Content */}
      <div className="p-8">
        <div className="flex items-center justify-center mb-8">
          <TrendingUp className="w-8 h-8 text-emerald-500 mr-3" />
          <h2 className="text-3xl font-bold text-white">Crypto Tracker</h2>
        </div>

        <div className="space-y-6">
          {/* Coin Selection */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Select Cryptocurrency</p>
            <div className="grid grid-cols-3 gap-3">
              {coinOptions.map((coinOpt) => {
                if (coinOpt.id === "custom_coin") {
                  if (showCustomCoinInput) {
                    return (
                      <form
                        key="custom_coin_input_form"
                        onSubmit={handleCustomCoinSubmit}
                        className="col-span-1"
                      >
                        <input
                          ref={customCoinInputRef}
                          type="text"
                          value={customCoinInputValue}
                          onChange={(e) =>
                            setCustomCoinInputValue(e.target.value)
                          }
                          placeholder="Coin Name"
                          className="w-full px-3 py-3 text-sm rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border border-gray-600 placeholder-gray-400 h-full"
                        />
                        <button type="submit" className="hidden">
                          Set
                        </button>
                      </form>
                    );
                  }
                  const isCustomCoinSetAndSelected =
                    selectedCoin !== coinOptions[0].id &&
                    selectedCoin !== coinOptions[1].id &&
                    selectedCoin !== "custom_coin" &&
                    selectedCoin !== "";
                  return (
                    <button
                      key={coinOpt.id}
                      onClick={() => {
                        setShowCustomCoinInput(true);
                        setCustomCoinInputValue(
                          isCustomCoinSetAndSelected ? selectedCoin : ""
                        );
                        setSelectedCoin("custom_coin"); // Indicate custom input mode
                        setCoinData(null);
                        setError("");
                      }}
                      className={`
                        relative px-4 py-3 rounded-xl font-bold text-white
                        bg-gradient-to-br ${
                          isCustomCoinSetAndSelected
                            ? "from-teal-400 to-cyan-600 hover:from-teal-500 hover:to-cyan-700"
                            : `${coinOpt.color} ${coinOpt.gradient}`
                        }
                        transition-all duration-300 transform hover:scale-105
                        ${
                          isCustomCoinSetAndSelected ||
                          (selectedCoin === "custom_coin" &&
                            showCustomCoinInput)
                            ? "ring-4 ring-white/30 scale-105"
                            : ""
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center h-full cursor-pointer">
                        {isCustomCoinSetAndSelected
                          ? selectedCoin.toUpperCase()
                          : coinOpt.symbol}
                      </span>
                      {(isCustomCoinSetAndSelected ||
                        (selectedCoin === "custom_coin" &&
                          showCustomCoinInput)) && (
                        <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse" />
                      )}
                    </button>
                  );
                }
                // Predefined coins
                return (
                  <button
                    key={coinOpt.id}
                    onClick={() => {
                      setSelectedCoin(coinOpt.id);
                      setShowCustomCoinInput(false);
                      setCoinData(null);
                      setError("");
                    }}
                    className={`
                      relative px-4 py-3 rounded-xl font-bold text-white
                      bg-gradient-to-br ${coinOpt.color} ${coinOpt.gradient}
                      transition-all duration-300 transform hover:scale-105 cursor-pointer
                      ${
                        selectedCoin === coinOpt.id && !showCustomCoinInput
                          ? "ring-4 ring-white/30 scale-105"
                          : ""
                      }
                    `}
                  >
                    <span className="relative z-10">{coinOpt.symbol}</span>
                    {selectedCoin === coinOpt.id && !showCustomCoinInput && (
                      <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Select Currency</p>
            <div className="grid grid-cols-3 gap-3">
              {currencyOptions.map((currencyOpt) => {
                if (currencyOpt.code === "custom_currency") {
                  if (showCustomCurrencyInput) {
                    return (
                      <form
                        key="custom_currency_input_form"
                        onSubmit={handleCustomCurrencySubmit}
                        className="col-span-1"
                      >
                        <input
                          ref={customCurrencyInputRef}
                          type="text"
                          value={customCurrencyInputValue}
                          onChange={(e) =>
                            setCustomCurrencyInputValue(e.target.value)
                          }
                          placeholder="Code"
                          className="w-full px-3 py-3 text-sm rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border border-gray-600 placeholder-gray-400 h-full"
                        />
                        <button type="submit" className="hidden">
                          Set
                        </button>
                      </form>
                    );
                  }
                  const isCustomCurrencySetAndSelected =
                    selectedCurrency !== currencyOptions[0].code &&
                    selectedCurrency !== currencyOptions[1].code &&
                    selectedCurrency !== "custom_currency" &&
                    selectedCurrency !== "";
                  return (
                    <button
                      key={currencyOpt.code}
                      onClick={() => {
                        setShowCustomCurrencyInput(true);
                        setCustomCurrencyInputValue(
                          isCustomCurrencySetAndSelected ? selectedCurrency : ""
                        );
                        setSelectedCurrency("custom_currency");
                        setCoinData(null);
                        setError("");
                      }}
                      className={`
                        px-4 py-3 rounded-xl font-bold
                        transition-all duration-300 transform hover:scale-105
                        ${
                          isCustomCurrencySetAndSelected ||
                          (selectedCurrency === "custom_currency" &&
                            showCustomCurrencyInput)
                            ? "bg-teal-500 text-white ring-4 ring-teal-500/30"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center h-full cursor-pointer">
                        {isCustomCurrencySetAndSelected
                          ? selectedCurrency.toUpperCase()
                          : currencyOpt.symbol}
                      </span>
                    </button>
                  );
                }
                // Predefined currencies
                return (
                  <button
                    key={currencyOpt.code}
                    onClick={() => {
                      setSelectedCurrency(currencyOpt.code);
                      setShowCustomCurrencyInput(false);
                      setCoinData(null);
                      setError("");
                    }}
                    className={`
                      px-4 py-3 rounded-xl font-bold
                      transition-all duration-300 transform hover:scale-105 cursor-pointer
                      ${
                        selectedCurrency === currencyOpt.code &&
                        !showCustomCurrencyInput
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-500/30"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    {currencyOpt.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={fetchCoinData}
            disabled={loading}
            className={`
              w-full px-6 py-4 rounded-xl font-bold text-lg
              transition-all duration-300 transform cursor-pointer
              ${
                !selectedCurrency ||
                selectedCurrency === "custom_currency" ||
                !selectedCoin ||
                selectedCoin === "custom_coin"
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : loading
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-105 active:scale-95"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Fetching...
              </span>
            ) : (
              "Get Price"
            )}
          </button>

          {/* Error Message */}
          {error && window.innerHeight >= 900 && (
            <div className="flex items-center justify-center text-red-400 animate-shake p-2 bg-red-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Internal Bottom Drawer */}
      <div
        className={`absolute inset-x-0 bottom-0 transform transition-transform duration-300 ease-out z-10 ${
          showDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {coinData && (
          <div className="bg-gradient-to-t from-gray-800 to-gray-700 rounded-t-2xl p-6 shadow-2xl">
            <button
              onClick={closeDrawer}
              className="absolute top-3 right-3 p-1.5 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="space-y-4">
              <div className="w-10 h-1 bg-gray-500 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <img
                    src={coinData.icon}
                    alt={coinData.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                  <div // Fallback icon
                    className={`hidden w-12 h-12 rounded-full bg-gradient-to-br ${
                      currentCoinForDrawer?.color || "from-gray-500 to-gray-700"
                    } flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">
                      {coinData.symbol.substring(0, 3)}
                    </span>
                  </div>
                </div>
                <div className="text-white">
                  <p className="text-sm text-gray-400">{coinData.name}</p>
                  <p className="text-3xl font-bold">
                    {currentCurrencyForDrawer?.symbol || ""}
                    {coinData.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "1h Change", value: coinData.priceChange1h },
                  { label: "24h Change", value: coinData.priceChange1d },
                  { label: "7d Change", value: coinData.priceChange1w },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p
                      className={`text-sm font-semibold ${
                        stat.value >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stat.value >= 0 ? "+" : ""}
                      {stat.value.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 pt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Market Cap</p>
                  <p className="text-sm font-semibold text-white">
                    {currentCurrencyForDrawer?.symbol || ""}
                    {(coinData.marketCap / 1000000000).toFixed(2)}B
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">24h Volume</p>
                  <p className="text-sm font-semibold text-white">
                    {currentCurrencyForDrawer?.symbol || ""}
                    {(coinData.volume / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTracker;
