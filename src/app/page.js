"use client";

import React, { useState } from 'react';

const FileUploadApp = () => {
  const [file, setFile] = useState(null); 
  const [validationResults, setValidationResults] = useState(null); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); 
    setValidationResults(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('กรุณาอัปโหลดไฟล์ก่อน!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/excel/validate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setValidationResults({ success: true, message: result[0] });
      } else {
        setValidationResults({ success: false, errors: result });
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="p-5 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Excel File Validator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Upload and Validate
          </button>
        </form>

        {validationResults && (
          <div className="mt-6">
            {validationResults.success ? (
              <p className="text-green-500 font-semibold">{validationResults.message}</p>
            ) : (
              <ul className="text-red-500 font-semibold space-y-2">
                {validationResults.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadApp;
