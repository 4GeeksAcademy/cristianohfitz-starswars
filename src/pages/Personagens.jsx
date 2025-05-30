import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Personagens = () => {
  const { store } = useGlobalReducer();
  const { uid } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`${store.CHARACTER_URL}/${uid}`);
        if (!response.ok) throw new Error("Character not found");
        const data = await response.json();
        setCharacter(data.result?.properties || null);
      } catch (err) {
        console.error("Error fetching character:", err);
        setError("Failed to load character data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [uid, store.CHARACTER_URL]);

  if (loading) return <p>Loading character...</p>;
  if (error) return <p>{error}</p>;
  if (!character) return <p>Character not found.</p>;

  const imageUrl = `${store.CHARACTER_IMAGE_URL}/${uid}.jpg`;

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
          alt={character.name}
          className="card-img-top"
          style={{ width: "20rem", height: "20rem", objectFit: "cover" }}
        />
        <div className="mx-auto">
          <h1 className="text-center">{character.name}</h1>
          <p className="text-center">Star Wars character details</p>
        </div>
      </section>

      <section
        className="d-flex justify-content-between m-4 p-2 flex-wrap"
        style={{ gap: "1rem" }}
      >
        {renderDetail("Name", character.name)}
        {renderDetail("Birth Year", character.birth_year)}
        {renderDetail("Gender", character.gender)}
        {renderDetail("Height", character.height)}
        {renderDetail("Skin Color", character.skin_color)}
        {renderDetail("Eye Color", character.eye_color)}
      </section>
    </main>
  );
};
