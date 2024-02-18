import axios from "axios";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Loader from "./components/ui/Loader.jsx";

function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when search is submitted
    try {
      const options = {
        method: "GET",
        url: "https://deezerdevs-deezer.p.rapidapi.com/search",
        params: { q: search },
        headers: {
          "X-RapidAPI-Key":
            "de4d025948mshfa7f9812de86600p1d2a75jsn8c238adf85b2",
          "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading back to false after data retrieval
    }
  };

  return (
    <div className="m-auto">
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center justify-center max-w-2xl gap-2 px-2 py-2 mx-auto mt-10 bg-white border shadow-2xl mb-14 min-w-sm md:flex-row rounded-2xl focus-within:border-gray-300"
        for="search-bar"
      >
        <input
          id="search-bar"
          placeholder="your keyword here"
          className="flex-1 w-full px-6 py-2 text-black bg-white rounded-md outline-none"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="relative w-full px-6 py-3 overflow-hidden transition-all duration-100 bg-black border border-black md:w-auto fill-white active:scale-95 will-change-transform rounded-xl disabled:opacity-70"
        >
          Search
        </button>
      </form>
      {loading ? (
        <Loader /> // Display loader while loading data
      ) : data.length > 0 ? (
        <div className="flex flex-wrap gap-4 w-[85%] m-auto justify-center items-center">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col gap-1 p-1 w-80">
              <img
                src={item.album.cover_big}
                alt=""
                className="w-60"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "your-placeholder-image-url"; // Placeholder image URL
                }}
              />
              <h1 className="text-3xl font-Robo">{item.title}</h1>
              <a
                href={item.link}
                className="text-[12px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                listen to full song{" "}
                <span className="text-[green]">here!</span>
              </a>
              <audio src={item.preview} controls />
            </div>
          ))}
        </div>
      ) : (
       <h1>no result found...</h1> // Display loader if data is not yet loaded
      )}
    </div>
  );
}

export default App;