"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import imageCompression from "browser-image-compression"; // Import the image compression library

export default function AddPlant() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null); // For previewing the uploaded image
  const [loading, setLoading] = useState(false); // Loading state to prevent multiple submissions

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const wateringFrequency = e.target.wateringFrequency.value;
    const imageFile = e.target.image.files[0]; // Get the uploaded file

    // Handle file preview and compression
    if (imageFile) {
      try {
        setLoading(true); // Set loading state

        // Compress the image before converting to base64
        const options = {
          maxSizeMB: 0.5, // Set the max file size to 0.5MB
          maxWidthOrHeight: 800, // Set the max width or height
        };
        const compressedImage = await imageCompression(imageFile, options);

        // Convert the compressed image to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageUrl = reader.result; // Base64 string of the compressed image

          // Prepare plant data
          const plantData = {
            name,
            wateringFrequency: parseInt(wateringFrequency),
            imageUrl, // Add base64 image data
            needsWatering: true, // Assuming newly added plants need watering
          };

          try {
            // Send the plant data to the backend
            const response = await fetch("http://localhost:3001/api/plants", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(plantData),
            });

            if (!response.ok) {
              throw new Error("Failed to add plant");
            }

            alert("Plant added successfully!");
            router.push("/dashboard"); // Redirect to dashboard after success
          } catch (error) {
            alert("Error adding plant: " + error.message);
          } finally {
            setLoading(false); // Reset loading state
          }
        };

        reader.readAsDataURL(compressedImage); // Convert the compressed image to base64
      } catch (error) {
        alert("Image compression failed!");
        console.error(error);
      }
    } else {
      alert("Please upload an image for the plant.");
    }
  };

  // Handle image file input change to preview the image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update image preview
      };
      reader.readAsDataURL(file);
    }
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
          <label className="block mb-2">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading} // Disable button when loading
        >
          {loading ? "Adding Plant..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
}
