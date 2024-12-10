import React, { useState, useEffect } from "react";
import axios from "axios";
import "./city.css"; // Importing the CSS file

const City = () => {
  const [cityList, setCityList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    population: 0,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);

  const apiUrl = "http://localhost:8084/api/cities";

  // Fetch all cities
  const fetchCities = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCityList(response.data);
    } catch (err) {
      setError(err.message || "Error fetching city data.");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Handle form submission for creating or updating a city
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing city
        const response = await axios.put(
          `${apiUrl}/${currentCity.id}`,
          formData
        );
        setCityList(
          cityList.map((city) =>
            city.id === currentCity.id ? response.data : city
          )
        );
        setSuccess("City updated successfully!");
      } else {
        // Create new city
        const response = await axios.post(apiUrl, formData);
        setCityList([...cityList, response.data]);
        setSuccess("City added successfully!");
      }
      setFormData({ name: "", state: "", population: 0 });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Error saving city.");
    }
  };

  // Handle edit button click
  const handleEdit = (city) => {
    setFormData({
      name: city.name,
      state: city.state,
      population: city.population,
    });
    setCurrentCity(city);
    setIsEditing(true);
  };

  // Handle delete city by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setCityList(cityList.filter((city) => city.id !== id));
      setSuccess("City deleted successfully!");
    } catch (err) {
      setError(err.message || "Error deleting city.");
    }
  };

  return (
    <div className="city-container">
      <h1>City Management</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="city-form">
        <input
          type="text"
          placeholder="City Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Population"
          value={formData.population}
          onChange={(e) =>
            setFormData({
              ...formData,
              population: e.target.value,
            })
          }
          required
        />
        <button type="submit">{isEditing ? "Save Changes" : "Add City"}</button>
      </form>

      <div className="city-list">
        <h2>Cities List</h2>
        {cityList.length === 0 ? (
          <p>No cities found.</p>
        ) : (
          <ul>
            {cityList.map((city) => (
              <li key={city.id}>
                <strong>{city.name}</strong> - {city.state} ({city.population}{" "}
                people)
                <div className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(city)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(city.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default City;
