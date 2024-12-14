import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home.css"; 

const Home = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://localhost:8084/")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((err) => {
        setError(err.message || "Error fetching data.");
      });
  }, []);

  return (
    <div className="container">
      <h1 className="heading">Travel API Home</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <p className="message">{message}</p>
      )}
      <div className="button-container">
        <button className="button" onClick={() => navigate("/aircraft")}>
          Aircraft
        </button>
        <button className="button" onClick={() => navigate("/airport")}>
          Airport
        </button>
        <button className="button" onClick={() => navigate("/city")}>
          City
        </button>
        <button className="button" onClick={() => navigate("/passenger")}>
          Passenger
        </button>
      </div>
    </div>
  );
};

export default Home;
