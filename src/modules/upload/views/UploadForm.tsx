import { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';
import { uploadCSV } from '../../../shared/services/patientService';

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setMessage('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setMessage('');

    try {
      const result = await uploadCSV(file);
      setUploadStatus('success');
      setMessage(result.message || 'File uploaded successfully!');

      setTimeout(() => {
        onUploadSuccess();
        setUploadStatus('idle');
        setMessage('');
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Patient Data</h2>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {isUploading ? (
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
          ) : uploadStatus === 'error' ? (
            <XCircle className="w-12 h-12 text-red-600 mb-4" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
          )}

          <p className="text-lg font-medium text-gray-700 mb-2">
            {isUploading
              ? 'Uploading...'
              : uploadStatus === 'success'
              ? 'Upload Successful!'
              : uploadStatus === 'error'
              ? 'Upload Failed'
              : 'Drop CSV file here or click to browse'}
          </p>

          <p className="text-sm text-gray-500">
            {isUploading
              ? 'Please wait while we process your file'
              : 'Supports CSV files with patient risk data'}
          </p>
        </label>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            uploadStatus === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
