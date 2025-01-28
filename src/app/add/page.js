"use client";
import { useRouter } from "next/navigation";

export default function AddPlant() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const wateringFrequency = e.target.wateringFrequency.value;
    const imageUrl = e.target.imageUrl.value;

    // Get the existing plants from localStorage or set an empty array if no plants are stored
    const plants = JSON.parse(localStorage.getItem("plants")) || [];

    // Create a new plant object
    const newPlant = {
      id: plants.length + 1, // Simple ID generation
      name,
      needsWatering: true, // Assuming newly added plants need watering
      wateringFrequency,
      imageUrl, // Add image URL to the plant data
    };

    // Append the new plant to the existing plants array
    plants.push(newPlant);

    // Save the updated plants array back to localStorage
    localStorage.setItem("plants", JSON.stringify(plants));

    // Simulate saving the plant and redirect to dashboard
    alert("Plant added successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a New Plant</h2>
      <form className="bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Plant Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Watering Frequency (days)</label>
          <input
            type="number"
            name="wateringFrequency"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            className="w-full p-2 border rounded"
            placeholder="Enter image URL"
          />
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Add Plant
        </button>
      </form>
    </div>
  );
}
