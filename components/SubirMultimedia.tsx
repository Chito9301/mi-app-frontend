import React, { useState } from "react";

export default function SubirMultimedia() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (!file) return;
    // Agrega aquí la lógica para enviar archivo a backend o Cloudinary
    alert(`Archivo '${file.name}' listo para subir`);
  }

  return (
    <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Sube tu reto multimedia</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-3 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 text-white"
        disabled={!file}
      >
        Subir
      </button>
    </div>
  );
}