import { useState } from 'react'
import Box from './components/Box'
import ErrorMessage from './components/ErrorMessage'
import Loader from './components/Loader'
import Logo from './components/Logo'
import Main from './components/Main'
import MovieDetails from './components/MovieDetails'
import MovieList from './components/MovieList'
import NavBar from './components/NavBar'
import Search from './components/Search'
import NumResults from './components/NumResults'
import WatchSummary from './components/WatchSummary'
import WatchedMoviesList from './components/WatchedMoviesList'
import { useMovies } from './components/useMovies'
import { useLocalStorageState } from './components/useLocalStorageState'

export const average = arr => arr.reduce((acc, cur) => acc + cur, 0)
// arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export const KEY = '417138f5'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query)
  const [watched, setWatched] = useLocalStorageState([], 'watched')

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
