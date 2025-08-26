import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="group">
            <img
              src={viteLogo}
              className="h-24 w-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa] group-hover:scale-110"
              alt="Vite logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" className="group">
            <img
              src={reactLogo}
              className="h-24 w-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#61dafbaa] group-hover:scale-110 animate-spin"
              alt="React logo"
            />
          </a>
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Vite + React + Tailwind
        </h1>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg mb-4"
          >
            Count is {count}
          </button>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Edit{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
              src/App.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mt-8 text-sm">
          Click on the Vite and React logos to learn more
        </p>

        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">
            ✅ Tailwind CSS is now set up and working!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
