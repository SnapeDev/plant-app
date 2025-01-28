"use client";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [plants, setPlants] = useState([]);

  // Load plants from localStorage or use default plants if not found
  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("plants"));

    if (storedPlants?.length > 0) {
      setPlants(storedPlants);
    } else {
      // Default plants if nothing is in localStorage
      const defaultPlants = [
        {
          id: 1,
          name: "Monsterra",
          needsWatering: true,
          imageUrl: "/monsterra.jpg",
        },
        {
          id: 2,
          name: "Succulent",
          needsWatering: false,
          imageUrl: "/succulent.jpg",
        },
        {
          id: 3,
          name: "Swiss Cheese",
          needsWatering: false,
          imageUrl: "/swiss.jpg",
        },
      ];
      setPlants(defaultPlants);
      // Save the default plants to localStorage for future visits
      localStorage.setItem("plants", JSON.stringify(defaultPlants));
    }
  }, []);

  // Handle deleting a plant
  const handleDelete = (id) => {
    const updatedPlants = plants.filter((plant) => plant.id !== id);
    setPlants(updatedPlants); // Update the state immediately
    localStorage.setItem("plants", JSON.stringify(updatedPlants)); // Persist in localStorage
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">My Plants</h2>
      <div className="flex justify-center space-x-6 overflow-x-auto pb-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-52"
          >
            <div
              className="w-48 h-48 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${plant.imageUrl})` }}
            />
            <span className="mt-3 text-xl font-medium">{plant.name}</span>
            <button className={`mt-3 px-6 py-3 rounded text-black`}>
              {plant.needsWatering ? "Water Now" : "All Good"}
            </button>
            <button
              className="mt-3 px-6 py-3 bg-red-500 text-white rounded"
              onClick={() => handleDelete(plant.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
