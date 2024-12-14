import React, { useState, useEffect } from "react";
import axios from "axios";
import "./airport.css"; 

const Airport = () => {
  const [airportList, setAirportList] = useState([]);
  const [cityList, setCityList] = useState([]); 
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "", 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAirport, setCurrentAirport] = useState(null);

  const apiUrl = "http://localhost:8084/api/airports";
  const cityApiUrl = "http://localhost:8084/api/cities"; 

  
  const fetchAirports = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAirportList(response.data);
    } catch (err) {
      setError(err.message || "Error fetching airport data.");
    }
  };

  
  const fetchCities = async () => {
    try {
      const response = await axios.get(cityApiUrl);
      setCityList(response.data); 
    } catch (err) {
      setError(err.message || "Error fetching city data.");
    }
  };

  useEffect(() => {
    fetchAirports();
    fetchCities(); 
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        
        const response = await axios.put(
          `${apiUrl}/${currentAirport.id}`,
          formData
        );
        setAirportList(
          airportList.map((airport) =>
            airport.id === currentAirport.id ? response.data : airport
          )
        );
        setSuccess("Airport updated successfully!");
      } else {
        
        const response = await axios.post(apiUrl, formData);
        setAirportList([...airportList, response.data]);
        setSuccess("Airport added successfully!");
      }
      setFormData({ name: "", code: "", city: "" });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Error saving airport.");
    }
  };

  
  const handleEdit = (airport) => {
    setFormData({
      name: airport.name,
      code: airport.code,
      city: airport.city ? airport.city.id : "", 
    });
    setCurrentAirport(airport);
    setIsEditing(true);
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setAirportList(airportList.filter((airport) => airport.id !== id));
      setSuccess("Airport deleted successfully!");
    } catch (err) {
      setError(err.message || "Error deleting airport.");
    }
  };

  
  const handleViewAircraft = async (airportId) => {
    try {
      const response = await axios.get(`${apiUrl}/${airportId}/aircraft`);
      const aircraftList = response.data;

      if (aircraftList.length === 0) {
        alert("No aircraft found for this airport.");
      } else {
        
        alert(
          `Aircraft associated with this airport:\n${aircraftList
            .map((aircraft) => aircraft.type)
            .join("\n")}`
        );
      }
    } catch (err) {
      setError(err.message || "Error fetching aircraft data.");
    }
  };

  return (
    <div className="airport-container">
      <h1>Airport Management</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="airport-form">
        <input
          type="text"
          placeholder="Airport Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Airport Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        >
          <option value="">Select a City</option>
          {cityList.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <button type="submit">
          {isEditing ? "Save Changes" : "Add Airport"}
        </button>
      </form>

      <div className="airport-list">
        <h2>Airports List</h2>
        {airportList.length === 0 ? (
          <p>No airports found.</p>
        ) : (
          <ul>
            {airportList.map((airport) => (
              <li key={airport.id}>
                <strong>{airport.name}</strong> - {airport.code} (
                {airport.city ? airport.city.name : "No city"} )
                <div className="actions">
                  <button
                    className="view-aircraft-button"
                    onClick={() => handleViewAircraft(airport.id)}
                  >
                    View Aircraft
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(airport)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(airport.id)}
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

export default Airport;
