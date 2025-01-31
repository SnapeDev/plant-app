"use client";
import React, { useState, useEffect } from "react";
import { Droplet, X, Leaf } from "lucide-react"; // Import the necessary icons

export default function Dashboard() {
  const [plants, setPlants] = useState([]);

  // Fetch plants from the backend API on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch(
          "https://plant-app-backend-5cp1.onrender.com/api/plants",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlants();
  }, []);

  // Handle watering a plant
  const handleWaterPlant = async (id) => {
    try {
      const response = await fetch(
        `https://plant-app-backend-5cp1.onrender.com/api/plants/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            needsWatering: false,
            lastWatered: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update plant");
      }

      const updatedPlants = await fetch(
        "https://plant-app-backend-5cp1.onrender.com/api/plants",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
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
      const response = await fetch(
        `https://plant-app-backend-5cp1.onrender.com/api/plants/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete plant");
      }

      const updatedPlants = await fetch(
        "https://plant-app-backend-5cp1.onrender.com/api/plants",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await updatedPlants.json();

      setPlants(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to determine if a plant needs watering
  const isOverdueForWatering = (plant) => {
    if (!plant.lastWatered) return true;

    const lastWateredDate = new Date(plant.lastWatered);
    const today = new Date();
    const differenceInDays = Math.floor(
      (today - lastWateredDate) / (1000 * 3600 * 24)
    );

    return differenceInDays >= plant.wateringFrequency;
  };

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return "Not yet watered";
    const lastWateredDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today - lastWateredDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays === 0
      ? "Watered today"
      : `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 font-playfair text-center">
        My Plants
      </h2>
      <div className="flex justify-center space-x-6 overflow-x-auto pb-6">
        {plants.map((plant) => (
          <div
            key={plant._id}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-52"
          >
            <div
              className="w-48 h-48 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${plant.imageUrl})` }}
            />
            <span className="mt-3 text-xl font-medium">{plant.name}</span>

            <p className="text-sm text-gray-500 mt-2">
              Last watered:{" "}
              {isOverdueForWatering(plant)
                ? "Needs watering!"
                : calculateDaysAgo(plant.lastWatered)}
            </p>
            <p className="text-sm text-gray-500">
              Needs watering every {plant.wateringFrequency} days
            </p>

            <button
              className="mt-3 px-6 py-3 rounded text-black flex items-center gap-2"
              disabled={!isOverdueForWatering(plant)}
              onClick={() => handleWaterPlant(plant._id)}
            >
              {isOverdueForWatering(plant) ? (
                <Droplet className="w-6 h-6 text-blue-600 fill-current" />
              ) : (
                <Leaf className="w-6 h-6 text-green-700 fill-current" />
              )}
            </button>
            <button
              className="mt-3 px-6 py-3 text-black rounded flex items-center gap-2"
              onClick={() => handleDelete(plant._id)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
