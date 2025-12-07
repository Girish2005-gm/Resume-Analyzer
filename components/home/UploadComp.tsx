"use client";
import axios from "axios";
import { useState } from "react";
import ResultComponent from "./resultComponent";
import FileUpload from "../forms/FileUpload";
import JobDescriptionInput from "../forms/JobDescriptionInput";

export default function UploadComp() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(
    null
  );
  const [jdInputType, setJdInputType] = useState<"file" | "text">("file");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resume || (!jobDescriptionText && !jobDescriptionFile)) {
      alert("Please upload a resume and provide a job description");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (resume) formData.append("resume", resume);
      if (jobDescriptionText)
        formData.append("jobDescriptionText", jobDescriptionText);
      if (jobDescriptionFile)
        formData.append("jobDescriptionFile", jobDescriptionFile);

      const res = await axios.post("/api/getData", formData);

      if (res.data?.message === "Success") {
        setResult(res.data.data);
      } else {
        console.error("API error response:", res.data);
        alert("Server returned an error. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        error?.response?.data?.error ||
          "Analysis failed due to a server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent, type: "resume" | "jd") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (type === "resume") setResume(files[0]);
      else setJobDescriptionFile(files[0]);
    }
  };

  return (
    <div className="space-y-10">
      {/* Upload Form */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Upload Your Documents
            </h3>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Upload your resume and job description to get started with the
              analysis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Resume Upload */}
            <FileUpload
              file={resume}
              onFileChange={setResume}
              label="Resume"
              placeholder="Drop your resume here or click to browse"
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={(e) => handleDrop(e, "resume")}
              required
            />

            {/* Job Description */}
            <JobDescriptionInput
              inputType={jdInputType}
              onInputTypeChange={setJdInputType}
              textValue={jobDescriptionText}
              onTextChange={setJobDescriptionText}
              file={jobDescriptionFile}
              onFileChange={setJobDescriptionFile}
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={(e) => handleDrop(e, "jd")}
            />

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !resume ||
                  (!jobDescriptionText && !jobDescriptionFile)
                }
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-16 rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      {result && <ResultComponent data={result} />}
    </div>
  );
}
