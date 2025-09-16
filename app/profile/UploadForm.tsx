"use client";

import { useState } from "react";
import { Loader2, UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo primero.");
      return;
    }

    // Validar tamaño y tipo
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Solo se permiten imágenes o videos.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo no puede superar los 10MB.");
      return;
    }

    setError(null);
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }/auto/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUrl(data.secure_url);
        } else {
          setError("Error al subir el archivo.");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        setError("Fallo de conexión al subir archivo.");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setError("Error inesperado al subir.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-blue-600" />
        Subir archivo
      </h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 file:text-sm file:font-semibold 
          file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
          hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subiendo...
          </>
        ) : (
          "Subir archivo"
        )}
      </button>

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {url && (
        <div className="mt-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-700 font-medium">
            ¡Archivo subido con éxito!
          </p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline break-words text-xs"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
