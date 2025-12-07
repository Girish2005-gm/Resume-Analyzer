// export default function Footer() {
//   return (
//     <footer className="bg-white border-t border-gray-200 mt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="text-center text-gray-500">
//           <p>© 2025 Resume-JD-Reviewer. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
        <p className="text-gray-500 text-sm">
          © 2025 Resume-JD-Reviewer. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 text-sm transition"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 text-sm transition"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 text-sm transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
