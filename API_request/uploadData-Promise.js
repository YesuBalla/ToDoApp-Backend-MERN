import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_ENDPOINT = "http://localhost:4501/todo/bulkUpload";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${process.env.SAMPLE_ACCESS_TOKEN}`,
  },
};

const uploadCSV = async () => {
  // Create a Promise to handle the CSV data reading
  return new Promise((resolve, reject) => {
    try {
      const csvData = fs.readFileSync("./tmp/todo.csv", "utf-8");

      const csvDataBlob = new Blob([csvData], { type: "text/csv" });

      // Set up the form data
      const formData = new FormData();
      formData.append("csvFile", csvDataBlob, "todo.csv");

      resolve(formData);
    } catch (error) {
      reject(error);
    }
  });
};

uploadCSV()
  .then(async (formData) => {
    // Make the API request
    const response = await axios.post(API_ENDPOINT, formData, config);
    console.log("Bulk upload successful:", response.data);
  })
  .catch((error) => {
    console.error("Error uploading data:", error);
  });
