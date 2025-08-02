import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_ENDPOINT = "http://localhost:4501/todo/bulkUpload";

const uploadData = async () => {
  try {
    // Read the CSV file data
    const csvData = fs.readFileSync("./tmp/todo.csv", "utf-8");

    const csvDataBlob = new Blob([csvData], { type: "text/csv" });

    // Set up the form data
    const formData = new FormData();
    formData.append("csvFile", csvDataBlob, "todo.csv");

    // console.log(formData);

    // Set up the HTTP request with Axios
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.SAMPLE_ACCESS_TOKEN}`,
      },
    };

    // Make the API request
    const response = await axios.post(API_ENDPOINT, formData, config);

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error uploading data:", error.message);
  }
};

// Call the uploadData function to initiate the API request
uploadData();
