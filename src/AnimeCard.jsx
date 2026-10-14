function AnimeCard({ anime }) {
  const title = anime.title_english || anime.title || "Untitled"
  const image =
    anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
  const score = anime.score
  const meta = [
    anime.type,
    anime.episodes ? `${anime.episodes} eps` : null,
    anime.year,
  ].filter(Boolean)

  return (
    <article className="card">
      <div className="poster">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="no-image">No image</div>
        )}
        {score ? <span className="badge">★ {score}</span> : null}
      </div>
      <div className="info">
        <h3 title={title}>{title}</h3>
        {meta.length > 0 && <p>{meta.join(" · ")}</p>}
      </div>
    </article>
  )
}

export default AnimeCard