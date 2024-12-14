import React, { useState, useEffect } from "react";
import axios from "axios";
import "./passengers.css";

const Passenger = () => {
  const [passengerList, setPassengerList] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    cityId: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassenger, setCurrentPassenger] = useState(null);
  const [cities, setCities] = useState([]); 

  const apiUrl = "http://localhost:8084/api/passengers";
  const cityApiUrl = "http://localhost:8084/api/cities"; 

  
  
  const fetchPassengers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPassengerList(response.data);
    } catch (err) {
      setError(err.message || "Error fetching passenger data.");
    }
  };

  
  const fetchCities = async () => {
    try {
      const response = await axios.get(cityApiUrl);
      setCities(response.data);
    } catch (err) {
      setError(err.message || "Error fetching city data.");
    }
  };

  useEffect(() => {
    fetchPassengers();
    fetchCities();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        
        const response = await axios.put(
          `${apiUrl}/${currentPassenger.id}`,
          formData
        );
        setPassengerList(
          passengerList.map((passenger) =>
            passenger.id === currentPassenger.id ? response.data : passenger
          )
        );
        setSuccess("Passenger updated successfully!");
      } else {
        
        const response = await axios.post(apiUrl, formData);
        setPassengerList([...passengerList, response.data]);
        setSuccess("Passenger added successfully!");
      }
      setFormData({ firstName: "", lastName: "", phoneNumber: "", cityId: "" });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Error saving passenger.");
    }
  };

  
  const handleEdit = (passenger) => {
    setFormData({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      phoneNumber: passenger.phoneNumber,
      cityId: passenger.city ? passenger.city.id : "", // Assuming the city object has an id
    });
    setCurrentPassenger(passenger);
    setIsEditing(true);
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setPassengerList(
        passengerList.filter((passenger) => passenger.id !== id)
      );
      setSuccess("Passenger deleted successfully!");
    } catch (err) {
      setError(err.message || "Error deleting passenger.");
    }
  };

  return (
    <div className="passenger-container">
      <h1>Passenger Management</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="passenger-form">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
        <select
          value={formData.cityId}
          onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
          required
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <button type="submit">
          {isEditing ? "Save Changes" : "Add Passenger"}
        </button>
      </form>

      <div className="passenger-list">
        <h2>Passengers List</h2>
        {passengerList.length === 0 ? (
          <p>No passengers found.</p>
        ) : (
          <ul>
            {passengerList.map((passenger) => (
              <li key={passenger.id}>
                <strong>
                  {passenger.firstName} {passenger.lastName}
                </strong>{" "}
                - {passenger.phoneNumber}
                <div className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(passenger)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(passenger.id)}
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

export default Passenger;
