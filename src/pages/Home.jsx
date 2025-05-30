import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const useFetchWithUIDs = (url, imageKey, type, dispatchType, dispatch) => {
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
        const details = await Promise.all(
          data.results.map((item) =>
            fetch(`${url}/${item.uid}`).then((res) => res.json())
          )
        );
        const enrichedData = details.map((item, index) => ({
          ...item.result.properties,
          uid: data.results[index].uid,
        }));
        dispatch({ type: dispatchType, payload: enrichedData });
      })
      .catch((err) => console.error(`Error fetching ${type}:`, err));
  }, [url, dispatchType, dispatch]);
};

const CardSection = ({ title, data, imageBaseUrl, routePrefix, infoFields, dispatch, type }) => {
  const navigate = useNavigate();

  return (
    <>
      <h1>{title}</h1>
      <div className="d-flex overflow-auto" style={{ scrollSnapType: "x mandatory", gap: "1rem", paddingBottom: "1rem" }}>
        {data.map((item) => (
          <div key={item.uid} className="card m-2" style={{ width: "18rem", flexShrink: 0 }}>
            <img
              src={`${imageBaseUrl}/${item.uid}.jpg`}
              onError={(e) => (e.target.src = "https://placehold.co/400x200?text=No+Image")}
              className="card-img-top"
              alt={item.name}
            />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              {infoFields.map((field) => (
                <p className="card-text" key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}: {item[field]}
                </p>
              ))}
              <div className="d-flex justify-content-between gap-1">
                <button className="btn btn-outline-primary" onClick={() => navigate(`/${routePrefix}-info/${item.uid}`)}>
                  Read More
                </button>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => dispatch({ type: "ADD_FAVORITE", payload: item.name })}
                >
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  useFetchWithUIDs(store.CHARACTER_URL, store.CHARACTER_IMAGE_URL, "characters", "SET_CHARACTERS", dispatch);
  useFetchWithUIDs(store.PLANETS_URL, store.PLANETS_IMAGE_URL, "planets", "SET_PLANETS", dispatch);
  useFetchWithUIDs(store.VEHICLE_URL, store.VEHICLE_IMAGE_URL, "vehicles", "SET_VEHICLES", dispatch);

  return (
    <div className="p-2">
      <CardSection
        title="Characters"
        data={store.characters}
        imageBaseUrl={store.CHARACTER_IMAGE_URL}
        routePrefix="character"
        infoFields={["gender", "hair_color", "eye_color"]}
        dispatch={dispatch}
        type="character"
      />
      <CardSection
        title="Planets"
        data={store.planets}
        imageBaseUrl={store.PLANETS_IMAGE_URL}
        routePrefix="planet"
        infoFields={["population", "terrain"]}
        dispatch={dispatch}
        type="planet"
      />
      <CardSection
        title="Vehicles"
        data={store.vehicles}
        imageBaseUrl={store.VEHICLE_IMAGE_URL}
        routePrefix="vehicle"
        infoFields={["model", "passengers"]}
        dispatch={dispatch}
        type="vehicle"
      />
    </div>
  );
};
