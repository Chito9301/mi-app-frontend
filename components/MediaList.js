// components/MediaList.js
import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { fetchMedia } from "../utils/api";

// Componente MediaList: muestra una lista de media obtenida del backend
// Mejora: accesibilidad mínima y comentarios para mantenibilidad
import { fetchMedia } from "../utils/api";

export default function MediaList() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedia()
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p aria-busy="true">Cargando media...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <section aria-labelledby="media-list-title">
      <h2 id="media-list-title">Media subida</h2>
      <ul>
        {media.map((item) => (
          <li key={item._id} tabIndex={0} aria-label={`Media: ${item.title}`}>
            <strong>{item.title}</strong> - {item.description}
            <br />
            <img src={item.mediaUrl} alt={item.title} width={150} />
          </li>
        ))}
      </ul>
    </section>
  );
}
