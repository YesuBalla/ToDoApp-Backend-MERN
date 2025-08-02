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

const uploadCSV = (callback) => {
  try {
    const csvData = fs.readFileSync("./tmp/todo.csv", "utf-8");

    const csvDataBlob = new Blob([csvData], { type: "text/csv" });

    // Set up the form data
    const formData = new FormData();
    formData.append("csvFile", csvDataBlob, "todo.csv");

    // Call the callback function with the formData
    callback(null, formData);
  } catch (error) {
    // Call the callback function with the error
    callback(error, null);
  }
};

uploadCSV((error, formData) => {
  if (error) {
    console.error("Error uploading data:", error);
  } else {
    // Make the API request
    axios
      .post(API_ENDPOINT, formData, config)
      .then((response) => {
        console.log("Bulk upload successful:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
      });
  }
});
