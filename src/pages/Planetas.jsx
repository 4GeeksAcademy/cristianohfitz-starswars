import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Planetas = () => {
  const { store } = useGlobalReducer();
  const { uid } = useParams();
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        const response = await fetch(`${store.PLANETS_URL}/${uid}`);
        if (!response.ok) throw new Error("Planet not found");
        const data = await response.json();
        setPlanet(data.result?.properties || null);
      } catch (err) {
        console.error("Error fetching planet:", err);
        setError("Failed to load planet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanet();
  }, [uid, store.PLANETS_URL]);

  if (loading) return <p>Loading planet...</p>;
  if (error) return <p>{error}</p>;
  if (!planet) return <p>Planet not found.</p>;

  const imageUrl = `${store.PLANETS_IMAGE_URL}/${uid}.jpg`;

  const renderDetail = (label, value) => (
    <div>
      <h3 className="text-danger text-center">{label}</h3>
      <p className="text-danger text-center">{value || "Unknown"}</p>
    </div>
  );

  return (
    <main className="container">
      <section className="d-flex justify-content-around m-4 p-2 border-bottom border-danger">
        <img
          src={imageUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x200?text=No+Image";
          }}
          alt={planet.name}
          className="card-img-top"
          style={{ width: "20rem", height: "20rem", objectFit: "cover" }}
        />
        <div className="mx-auto">
          <h1 className="text-center">{planet.name}</h1>
          <p className="text-center">Star Wars planet details</p>
        </div>
      </section>

      <section
        className="d-flex justify-content-between m-4 p-2 flex-wrap"
        style={{ gap: "1rem" }}
      >
        {renderDetail("Name", planet.name)}
        {renderDetail("Climate", planet.climate)}
        {renderDetail("Population", planet.population)}
        {renderDetail("Orbital Period", planet.orbital_period)}
        {renderDetail("Rotation Period", planet.rotation_period)}
        {renderDetail("Diameter", planet.diameter)}
      </section>
    </main>
  );
};
