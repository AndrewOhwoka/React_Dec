import React, { useState, useEffect } from "react";
import axios from "axios";
import "./aircraft.css"; // CSS file for styling

const Aircraft = () => {
  const [aircraftList, setAircraftList] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    airlineName: "",
    numberOfPassengers: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAircraft, setCurrentAircraft] = useState(null);

  const apiUrl = "http://localhost:8084/api/aircraft";

  // Fetch all aircraft data
  const fetchAircraft = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAircraftList(response.data);
    } catch (err) {
      setError(err.message || "Error fetching aircraft data.");
    }
  };

  useEffect(() => {
    fetchAircraft();
  }, []);

  // Handle form submission for creating or updating a new aircraft
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing aircraft
        const response = await axios.put(
          `${apiUrl}/${currentAircraft.id}`,
          formData
        );
        setAircraftList(
          aircraftList.map((aircraft) =>
            aircraft.id === currentAircraft.id ? response.data : aircraft
          )
        );
        setSuccess("Aircraft updated successfully!");
      } else {
        // Create new aircraft
        const response = await axios.post(apiUrl, formData);
        setAircraftList([...aircraftList, response.data]);
        setSuccess("Aircraft added successfully!");
      }
      setFormData({ type: "", airlineName: "", numberOfPassengers: "" });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Error saving aircraft.");
    }
  };

  // Handle edit button click
  const handleEdit = (aircraft) => {
    setFormData({
      type: aircraft.type,
      airlineName: aircraft.airlineName,
      numberOfPassengers: aircraft.numberOfPassengers,
    });
    setCurrentAircraft(aircraft);
    setIsEditing(true);
  };

  // Handle delete aircraft by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setAircraftList(aircraftList.filter((aircraft) => aircraft.id !== id));
      setSuccess("Aircraft deleted successfully!");
    } catch (err) {
      setError(err.message || "Error deleting aircraft.");
    }
  };

  // Handle viewing aircraft details by ID
  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`);
      alert(
        `Aircraft Details:\nType: ${response.data.type}\nAirline: ${response.data.airlineName}\nPassengers: ${response.data.numberOfPassengers}`
      );
    } catch (err) {
      setError(err.message || "Error fetching aircraft details.");
    }
  };

  // Handle viewing passengers of an aircraft by ID
  const handleViewPassengers = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}/passengers`);
      alert(
        `Passengers:\n${response.data
          .map((p) => `${p.firstName} ${p.lastName}`)
          .join("\n")}`
      );
    } catch (err) {
      setError(err.message || "Error fetching passengers.");
    }
  };

  return (
    <div className="aircraft-container">
      <h1>Aircraft Management</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="aircraft-form">
        <input
          type="text"
          placeholder="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Airline Name"
          value={formData.airlineName}
          onChange={(e) =>
            setFormData({ ...formData, airlineName: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Number of Passengers"
          value={formData.numberOfPassengers}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfPassengers: e.target.value,
            })
          }
          required
        />
        <button type="submit">
          {isEditing ? "Save Changes" : "Add Aircraft"}
        </button>
      </form>

      <div className="aircraft-list">
        <h2>Aircraft List</h2>
        {aircraftList.length === 0 ? (
          <p>No aircraft found.</p>
        ) : (
          <ul>
            {aircraftList.map((aircraft) => (
              <li key={aircraft.id}>
                <strong>{aircraft.type}</strong> - {aircraft.airlineName} (
                {aircraft.numberOfPassengers} passengers)
                <div className="actions">
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(aircraft.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="view-passengers-button"
                    onClick={() => handleViewPassengers(aircraft.id)}
                  >
                    View Passengers
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(aircraft)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(aircraft.id)}
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

export default Aircraft;
