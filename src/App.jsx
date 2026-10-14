import { useEffect, useState } from "react"
import AnimeCard from "./AnimeCard"

const API_URL = "https://api.tenrai.org/v1/anime"
const DEFAULT_QUERY = "one man"

function App() {
  const [animes, setAnimes] = useState([])
  const [term, setTerm] = useState("")
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch whenever `query` changes. AbortController cancels stale requests,
  // so a slow earlier response can never overwrite a newer one.
  useEffect(() => {
    const controller = new AbortController()

    const getAnime = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(
          `${API_URL}?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        )
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        const data = await response.json()
        setAnimes(Array.isArray(data.data) ? data.data : [])
      } catch (err) {
        if (err.name === "AbortError") return
        setError(err.message || "Something went wrong")
        setAnimes([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    getAnime()
    return () => controller.abort()
  }, [query])

  // Search-as-you-type: wait 500ms after the user stops typing.
  useEffect(() => {
    const trimmed = term.trim()
    if (!trimmed) return
    const timer = setTimeout(() => setQuery(trimmed), 500)
    return () => clearTimeout(timer)
  }, [term])

  // Pressing Enter or clicking Search searches immediately.
  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = term.trim()
    if (trimmed) setQuery(trimmed)
  }

  const handleClear = () => {
    setTerm("")
    setQuery(DEFAULT_QUERY)
  }

  return (
    <main className="app">
      <h1>Anime Search</h1>

      <form className="search" onSubmit={handleSubmit} role="search">
        <div className="search-field">
          <input
            type="search"
            placeholder="Search for anime e.g Naruto"
            aria-label="Search anime"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          {term && (
            <button
              type="button"
              className="clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className="submit">Search</button>
      </form>

      {!loading && !error && animes.length > 0 && (
        <p className="status">
          {animes.length} result{animes.length > 1 ? "s" : ""} for “{query}”
        </p>
      )}

      {loading && (
        <div className="grid" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="message error">
          <h2>Couldn’t load results</h2>
          <p>{error}</p>
          <button onClick={() => setQuery((q) => q + " ")}>Try again</button>
        </div>
      )}

      {!loading && !error && animes.length === 0 && (
        <div className="message">
          <h2>No results found</h2>
          <p>Try a different title or spelling.</p>
        </div>
      )}

      {!loading && !error && animes.length > 0 && (
        <div className="grid">
          {animes.map((anime, index) => (
            <AnimeCard key={anime.mal_id ?? anime.id ?? index} anime={anime} />
          ))}
        </div>
      )}
    </main>
  )
}

export default App