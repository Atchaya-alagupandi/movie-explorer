import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import "./App.css";

const API_KEY = "85ea407d";


// ================= HOME PAGE =================

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (!search.trim()) {
      setError("Please enter a movie name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError("No movies found");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Category filter
  const filteredMovies =
    category === "All"
      ? movies
      : movies.filter((movie) =>
          movie.Type?.toLowerCase() === category.toLowerCase()
        );


  return (
    <div className="container">

      <h1>🎬 Movie Explorer</h1>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMovies();
            }
          }}
        />

        <button onClick={searchMovies}>
          Search
        </button>
      </div>


      {/* Category */}
      <div className="filters">

        <button onClick={() => setCategory("All")}>
          All
        </button>

        <button onClick={() => setCategory("movie")}>
          Movies
        </button>

        <button onClick={() => setCategory("series")}>
          Series
        </button>

        <button onClick={() => setCategory("episode")}>
          Episodes
        </button>

      </div>


      {/* Loading */}
      {loading && (
        <h2 className="message">
          Loading movies...
        </h2>
      )}


      {/* Error */}
      {error && (
        <h2 className="error">
          ⚠️ {error}
        </h2>
      )}


      {/* Movie Cards */}
      <div className="movie-grid">

        {filteredMovies.map((movie) => (

          <div className="movie-card" key={movie.imdbID}>

            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.Title}
            />

            <div className="movie-info">

              <h3>{movie.Title}</h3>

              <p>📅 {movie.Year}</p>

              <p>🎭 {movie.Type}</p>

              <Link to={`/movie/${movie.imdbID}`}>
                View Details
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


// ================= MOVIE DETAILS =================

function MovieDetails() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const getMovieDetails = async () => {

      try {

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );

        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError("Movie details not found");
        }

      } catch (err) {

        setError("Failed to load movie details");

      } finally {

        setLoading(false);

      }

    };

    getMovieDetails();

  }, [id]);


  if (loading) {
    return (
      <h2 className="message">
        Loading movie details...
      </h2>
    );
  }


  if (error) {
    return (
      <h2 className="error">
        ⚠️ {error}
      </h2>
    );
  }


  return (

    <div className="details">

      <Link to="/" className="back">
        ← Back
      </Link>

      <div className="details-content">

        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450"
          }
          alt={movie.Title}
        />

        <div>

          <h1>{movie.Title}</h1>

          <p>
            <strong>Year:</strong> {movie.Year}
          </p>

          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>

          <p>
            <strong>Runtime:</strong> {movie.Runtime}
          </p>

          <p>
            <strong>Director:</strong> {movie.Director}
          </p>

          <p>
            <strong>Actors:</strong> {movie.Actors}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {movie.imdbRating}
          </p>

          <p>
            <strong>Language:</strong> {movie.Language}
          </p>

          <p>
            <strong>Plot:</strong> {movie.Plot}
          </p>

        </div>

      </div>

    </div>

  );
}


// ================= APP =================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;