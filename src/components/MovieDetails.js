import { useEffect, useRef, useState } from 'react'
import StarRating from './StarRating'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import { KEY } from '../App'
import { useKey } from './useKey'

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [userRating, setUserRating] = useState('')

  const countRef = useRef(0)

  useEffect(
    function () {
      if (userRating) countRef.current++
    },
    [userRating]
  )

  const isWatched = watched.some(movie => movie.imdbID === selectedId)
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecision: countRef.current,
    }

    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useKey('Escape', onCloseMovie)

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true)
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          )

          if (!res.ok) throw new Error('Failed to load movie')

          const data = await res.json()
          setMovie(data)
        } catch (error) {
          console.error(error.message)
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }
      getMovieDetails()
    },
    [selectedId]
  )

  useEffect(
    function () {
      if (!title) return
      document.title = `Movie | ${title}`

      return function () {
        document.title = 'usePopcorn'
        // console.log(`Cleanup effect for movie ${title}`)
      }
    },
    [title]
  )

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of the ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                    defaultRating={Number(userRating)}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated the movie {watchedUserRating}{' '}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
