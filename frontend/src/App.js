import "./App.css";
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0], fileUploadedSuccessfully: false });
  };

  onFileUpload = () => {
    if (!this.state.selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const file = this.state.selectedFile;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Extract Base64 without prefix

      const jsonData = {
        queryStringParameters: {
          fileName: file.name
        },
        body: base64String,
        isBase64Encoded: true
      };

      axios
        .post(
          "https://pwpz6bseyh.execute-api.ap-south-1.amazonaws.com/dev/files",
          jsonData,
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(() => {
          this.setState({ selectedFile: null, fileUploadedSuccessfully: true });
          alert("File uploaded successfully!");
        })
        .catch((error) => {
          console.error("Upload failed:", error);
          alert("File upload failed. Please try again.");
        });
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  fileData = () => {
    if (this.state.fileUploadedSuccessfully) {
      return (
        <div>
          <br />
          <h4 style={{ color: "green", fontWeight: "bold" }}>
            ✅ File uploaded successfully!
          </h4>
        </div>
      );
    }

    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    }

    return (
      <div>
        <br />
        <h4>Choose a file and then press the Upload button</h4>
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        <h2>File Upload System</h2>
        <h3>File Upload with React and a Serverless API!</h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload</button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default App;