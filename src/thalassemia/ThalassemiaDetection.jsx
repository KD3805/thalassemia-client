import React, { useState } from "react";
import axios from "axios";
import useFormValidation from "../hooks/useFormValidation";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { FilledButton, InputField, OutlinedButton } from "../custom/CustomComponents";

const ThalassemiaDetection = () => {
  const [file, setFile] = useState(null);
  const [extractedParams, setExtractedParams] = useState(null);
  // const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null); // State to store the selected file name

  const { formData, setFormData, errors, handleInputChange, validateForm } =
    useFormValidation({});

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedParams(null);
    setFormData({});
    setPrediction(null);
    setError(null);
    setSelectedFileName(e.target.files[0].name); // Update the selected file name
  };

  // Function to remove the selected file
  const handleRemoveFile = () => {
    setFile(null);
    setSelectedFileName(null); // Clear the selected file name
  };

  // Upload file and extract parameters from backend (/upload-report/)
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "https://thalassemia-detection.onrender.com/upload-report/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Expect the backend to return { extracted_parameters: { ... } }
      setExtractedParams(response.data.extracted_parameters);
      setFormData(response.data.extracted_parameters); // Pre-populate the form
    } catch (err) {
      console.error(err);
      setError("Error uploading the file or extracting parameters.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes for review/editing of extracted parameters
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // Submit the reviewed parameters for prediction (/predict-report/)
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://thalassemia-detection.onrender.com/predict-report/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Expect response data like { prediction: 0 or 1, report_id: ..., parameters: { ... } }
      setPrediction(response.data.prediction);
      if (response.data.prediction !== null) {
        if (response.data.prediction === 0) {
          Swal.fire("Good job!", "Likely to be a normal individual", "success");
        } else {
          Swal.fire({ icon: "info", title: "Opps!", text: "Likely to be an alpha thalassemia carrier" });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error during prediction. Please check your input and try again.")
      // setError(
      //   "Error during prediction. Please check your input and try again."
      // );
    } finally {
      setLoading(false);
      handleRollback()
    }
  };

  // Handle drag and drop event in the 'Choose file select section'
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setExtractedParams(null);
    setFormData({});
    setPrediction(null);
    setError(null);
    setSelectedFileName(droppedFile.name); // Update the selected file name
  };

  const handleRollback = () => {
    setFile(null);
    setExtractedParams(null);
    setFormData({});
    setPrediction(null);
    setError(null);
    setSelectedFileName(null);
  };

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
      <div className="page-title text-3xl text-red-700 font-bold mt-10 text-center">
        Thalassemia Detection
      </div>

      <Toaster toastOptions={{ duration: 4000 }} />

      <div className="flex justify-center items-center max-h-full py-10">
        {extractedParams && Object.keys(extractedParams).length > 0 ? (
          <div className="w-full max-w-5xl red-bg-gradient text-white p-10 rounded-xl shadow-lg border-2 border-red-800">
            <h4 className="text-2xl font-extrabold mb-10 text-center">
              Review & Update Extracted Parameters
            </h4>
            <form>
              <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-4 text-lg">
                {Object.keys(formData).length > 0 ? (
                  Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <InputField
                        type="text"
                        label={key}
                        placeholder={`Enter ${key}`}
                        id={key}
                        value={value}
                        error={key}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))
                ) : (
                  <p>No parameters extracted.</p>
                )}
              </div>
            </form>
            <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
              <OutlinedButton
                type="button"
                onClick={handlePredict}
                disabled={loading}
                loading={loading}
                text="Detect"
                w="w-48"
              />

              <button
                type="reset"
                className="cursor-pointer w-48 px-6 py-2 border border-white rounded bg-gray-200 text-black hover:border-black hover:bg-gray-300 transition-all duration-300"
                disabled={loading}
                onClick={handleRollback}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center max-w-lg w-full mx-auto gap-4 h-[80vh]">
            {/* Choose file select section */}
            <div className="w-full py-8 px-12 rounded-lg border border-gray-400 border-dashed" onDragOver={handleDragOver} onDrop={handleDrop}>
              <div className="flex flex-col gap-3 text-center">
                <div className="flex flex-col justify-center items-center gap-0">
                  <p className="text-xl font-semibold">Upload Blood Report</p>
                  <p className="text-base font-medium text-gray-400">
                    Drag & Drop your PDF Report File Here
                  </p>
                </div>
                <small className="text-base font-medium text-gray-400">
                  or
                </small>
                <div className="flex flex-col justify-center items-center">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    id="blood-report"
                    onChange={handleFileChange}
                    hidden
                  />
                  <label
                    htmlFor="blood-report"
                    className="max-w-full w-fit text-base font-semibold text-center py-1 px-8 rounded-sm text-red-500 bg-red-50 cursor-pointer"
                  >
                    Choose File
                  </label>

                  {/* {loading && <p>Loading...</p>} */}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {selectedFileName && (
                    <div className="w-full mt-2 flex justify-between items-center">
                      <p className="truncate max-w-md">
                        {selectedFileName}
                      </p>
                      {!loading && (<button
                        onClick={handleRemoveFile}
                        className="w-fit pl-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload button */}
            <FilledButton
              type="button"
              onClick={handleFileUpload}
              disabled={loading}
              loading={loading}
              text="Upload"
              w="w-48"
            />
            {loading && <h4 className="m-0 p-0 text-base font-medium text-gray-600">It may take a while, please wait...</h4>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThalassemiaDetection;
