// import { useRef } from "react";

// interface FileUploadProps {
//   file: File | null;
//   onFileChange: (file: File | null) => void;
//   label: string;
//   placeholder: string;
//   dragActive: boolean;
//   onDrag: (e: React.DragEvent) => void;
//   onDrop: (e: React.DragEvent) => void;
//   accept?: string;
//   required?: boolean;
// }

// export default function FileUpload({
//   file,
//   onFileChange,
//   label,
//   placeholder,
//   dragActive,
//   onDrag,
//   onDrop,
//   accept = ".pdf,.docx,.doc",
//   required = false,
// }: FileUploadProps) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   return (
//     <div className="space-y-4">
//       <label className="block text-lg font-semibold text-gray-900">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div
//         className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
//           dragActive
//             ? "border-blue-500 bg-blue-50"
//             : file
//             ? "border-green-500 bg-green-50"
//             : "border-gray-300 hover:border-gray-400"
//         }`}
//         onDragEnter={onDrag}
//         onDragLeave={onDrag}
//         onDragOver={onDrag}
//         onDrop={onDrop}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           accept={accept}
//           onChange={(e) => onFileChange(e.target.files?.[0] || null)}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//         />
//         <div className="text-center">
//           {file ? (
//             <div className="space-y-2">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                 <svg
//                   className="w-8 h-8 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-green-700 font-medium text-sm">{file.name}</p>
//               <p className="text-sm text-green-600">
//                 File uploaded successfully
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
//                 <svg
//                   className="w-8 h-8 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//               </div>
//               <p className="text-gray-800 font-medium">{placeholder}</p>
//               <p className="text-sm text-gray-600">
//                 Supports PDF, DOC, DOCX files
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useRef } from "react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  label: string;
  placeholder: string;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  accept?: string;
  required?: boolean;
}

export default function FileUpload({
  file,
  onFileChange,
  label,
  placeholder,
  dragActive,
  onDrag,
  onDrop,
  accept = ".pdf,.docx,.doc",
  required = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`relative border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-sm ${
          dragActive
            ? "border-blue-500 bg-blue-50 shadow-md"
            : file
            ? "border-green-400 bg-green-50 shadow-inner"
            : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          {file ? (
            <div className="space-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-green-800 font-semibold text-sm truncate">
                {file.name}
              </p>
              <p className="text-green-600 text-xs">File uploaded successfully</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-semibold text-sm">{placeholder}</p>
              <p className="text-gray-500 text-xs">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

