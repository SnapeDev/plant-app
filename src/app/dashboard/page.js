"use client";
import React, { useState, useEffect } from "react";
import { Droplet, X, Leaf } from "lucide-react"; // Import the necessary icons

export default function Dashboard() {
  const [plants, setPlants] = useState([]);

  // Fetch plants from the backend API on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        // Fetch plants from your backend (adjust the URL if needed)
        const response = await fetch("http://localhost:3001/api/plants");
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        const data = await response.json();
        setPlants(data); // Set the fetched plants in state
      } catch (error) {
        console.error(error);
        // Optionally, you can handle error state here
      }
    };

    fetchPlants(); // Fetch the plants when the component is mounted
  }, []);

  // Handle watering a plant
  const handleWaterPlant = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/plants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          needsWatering: false,
          lastWatered: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plant");
      }

      // After updating the plant, fetch the plants again to reflect the changes
      const updatedPlants = await fetch("http://localhost:3001/api/plants");
      const data = await updatedPlants.json();
      setPlants(data);
      alert("Plant watered successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deleting a plant
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/plants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete plant");
      }

      // After deleting, fetch the updated plant list
      const updatedPlants = await fetch("http://localhost:3001/api/plants");
      const data = await updatedPlants.json();
      setPlants(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to calculate days ago
  const calculateDaysAgo = (dateString) => {
    if (!dateString) return "Not yet watered"; // If no watering date exists
    const lastWateredDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today - lastWateredDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert time difference to days
    return differenceInDays === 0
      ? "Watered today"
      : `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">My Plants</h2>
      <div className="flex justify-center space-x-6 overflow-x-auto pb-6">
        {plants.map((plant) => (
          <div
            key={plant._id} // Use _id from MongoDB as the key
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-52"
          >
            <div
              className="w-48 h-48 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${plant.imageUrl})` }}
            />
            <span className="mt-3 text-xl font-medium">{plant.name}</span>

            {/* Last Watered Info with "days ago" */}
            <p className="text-sm text-gray-500 mt-2">
              Last watered: {calculateDaysAgo(plant.lastWatered)}
            </p>

            {/* Watering Frequency Info */}
            <p className="text-sm text-gray-500">
              Needs watering every {plant.wateringFrequency} days
            </p>

            <button
              className="mt-3 px-6 py-3 rounded text-black flex items-center gap-2"
              disabled={!plant.needsWatering}
              onClick={() => handleWaterPlant(plant._id)} // Use _id to identify the plant
            >
              {plant.needsWatering ? (
                <Droplet className="w-6 h-6 text-blue-600 fill-current" /> // Water icon
              ) : (
                <Leaf className="w-6 h-6 text-green-700 fill-current" /> // Plant icon
              )}
            </button>
            <button
              className="mt-3 px-6 py-3 text-black rounded flex items-center gap-2"
              onClick={() => handleDelete(plant._id)} // Use _id for deleting the plant
            >
              <X className="w-6 h-6" /> {/* X icon for delete */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
