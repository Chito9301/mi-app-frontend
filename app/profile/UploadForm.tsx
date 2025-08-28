"use client";
import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setUrl(data.secure_url);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
      >
        {loading ? "Subiendo..." : "Subir archivo"}
      </button>

      {url && (
        <div className="mt-4">
          <p className="font-medium">Archivo subido con éxito:</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline break-words"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}