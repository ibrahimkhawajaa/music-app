import axios from "axios";
import { useState, useRef } from "react";
import {
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import Loader from "./components/ui/Loader.jsx";

function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track whether the song is playing or paused
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // form validation
    var inputValue = document.getElementById("searchInput").value;
    if (inputValue === "") {
      toast.error("Enter a Artist Name.");
      return;
    }

    setLoading(true);

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
      setLoading(false);
    }
  };

  const Heart = (item) => {
    console.log(item);
  };

  // Function for playerAudio

  const prevSong = () => {
    const prevIndex = data.findIndex((song) => song.id === currentSong.id) - 1;
    if (prevIndex >= 0) {
      setCurrentSong(data[prevIndex]);
    } else {
      setCurrentSong(data[data.length - 1]);
    }
    setIsPlaying(true); // Set isPlaying to true when the song starts playing
  };

  const nextSong = () => {
    const nextIndex = data.findIndex((song) => song.id === currentSong.id) + 1;
    if (nextIndex < data.length) {
      setCurrentSong(data[nextIndex]);
    } else {
      setCurrentSong(data[0]);
    }
    setIsPlaying(true);
  };

  const playSong = () => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true); // Set isPlaying to true when the song starts playing
      const img = document.getElementById('audioImg');
      img.classList.add('animate-spin'); 
    }
  };
  const pauseSong = () => {
    const img = document.getElementById('audioImg');
    img.classList.remove('animate-spin');    
    if (currentSong && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false); // Set isPlaying to false when the song is paused
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="m-auto h-screen">
        <Navbar />

        {/* search box */}
        <form
          id="searchForm"
          onSubmit={handleSubmit}
          className="w-[85%] m-auto relative flex flex-col items-center justify-center max-w-2xl gap-2 px-2 py-2 mx-auto mt-10 bg-white border shadow-2xl mb-14 min-w-sm md:flex-row rounded-2xl focus-within:border-gray-300"
          for="search-bar"
        >
          <input
            id="searchInput"
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
        {/* data api getting */}
        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
          <div className="flex flex-wrap gap-4 w-[85%] m-auto justify-center items-center">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center gap-1 p-2 text-left w-80"
                onClick={() => {
                  setCurrentSong(item);
                  playSong();
                }}
              >
                <img
                  src={item.album.cover_big}
                  alt=""
                  className="w-60"
                  loading="lazy"
                />

                <h1 className="text-3xl font-Robo ">{item.title}</h1>
                <div className="flex items-center justify-center gap-2 p-1 text-left">
                  <a
                    href={item.link}
                    className="text-[12px] pb-2 "
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    listen to full song{" "}
                    <span className="text-[green]">here!</span>
                  </a>
                  <button onClick={() => Heart(item)} className="mb-1">
                    nice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="relative text-center top-10 ">no result found...</h1>
        )}
        {/* audio player bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-300">
          <div className="flex items-center justify-center gap-4">
            {currentSong ? (
              <>
                <img
                  src={currentSong.album.cover_big}
                  alt=""

          id="audioImg"
                  className=" w-20 h-20 rounded-full animate-spin duration-1000"
                />
                <div className="flex flex-col items-start justify-center">
                  <h1 className="text-xl font-Robo">{currentSong.title}</h1>
                  <p className="text-gray-600">{currentSong.artist.name}</p>
                </div>
                <audio
                  ref={audioRef}
                  src={currentSong.preview}
                  onEnded={nextSong}
                  autoPlay
                />
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={prevSong}
                    className="text-2xl text-gray-600 hover:text-gray-800"
                  >
                    <AiOutlineDoubleLeft />
                  </button>
                  {isPlaying ? ( // Show pause button if the song is playing
                    <button
                      onClick={pauseSong}
                      className="text-2xl text-gray-600 hover:text-gray-800"
                    >
                      <AiOutlinePauseCircle />
                    </button>
                  ) : (
                    // Show play button if the song is paused
                    <button
                      onClick={playSong}
                      className="text-2xl text-gray-600 hover:text-gray-800"
                    >
                      <AiOutlinePlayCircle />
                    </button>
                  )}
                  <button
                    onClick={nextSong}
                    className="text-2xl text-gray-600 hover:text-gray-800"
                  >
                    <AiOutlineDoubleRight />
                  </button>
                </div>
              </>
            ) : (
              <h1 className="text-xl font-Robo">No song selected</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
