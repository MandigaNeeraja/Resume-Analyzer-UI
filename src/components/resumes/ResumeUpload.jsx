import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../ui/Button";

export default function ResumeUpload({ onUpload, disabled, uploading }) {
  const [queuedFiles, setQueuedFiles] = useState([]);

  useEffect(() => {
    if (!uploading) setQueuedFiles([]);
  }, [uploading]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      setQueuedFiles(acceptedFiles);
      onUpload?.(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
    disabled,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          disabled
            ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
            : isDragActive
              ? "border-primary-500 bg-primary-50"
              : "border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-primary-50/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
          ☁️
        </div>
        <p className="text-base font-semibold text-slate-800 mb-1">
          {isDragActive ? "Drop files here" : "Drag & Drop your resumes here"}
        </p>
        <p className="text-sm text-slate-500 mb-4">Supported formats: PDF, DOCX — multiple files allowed</p>
        <Button type="button" disabled={disabled} onClick={(e) => e.stopPropagation()}>
          Choose Files
        </Button>
      </div>

      {queuedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase">Selected files</p>
          {queuedFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg text-sm">
              <span>📄</span>
              <span className="text-slate-700">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
