import React from "react";
const PopupDialog = ({ isOpen, onClose, onConfirm }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(event.target[0].value);
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center font-open-sans">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <form
        className="relative bg-white w-96 p-6 rounded-lg shadow-xl z-50"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-center mb-4">
          Are you sure ?
        </h2>
        <div className="md:col-span-2 sm:col-span-2 lg:col-span-5 xs:col-span-2 font-open-sans mb-6">
          <label
            htmlFor="rejectionMessage"
            className="block text-sm text-text font-medium leading-6 text-gray-900"
          >
            Rejection Message
          </label>
          <div className="mt-2">
            <textarea
              id="rejectionMessage"
              name="rejectionMessage"
              autoComplete="off"
              rows={3}
              className=" rounded-md block w-full box-border max-w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset bg-textbg focus:ring-primary-100 sm:text-sm sm:leading-6 placeholder:font-open-sans"
              placeholder="Enter message"
              required
            />
          </div>
        </div>
        <div className="flex justify-center gap-5 font-open-sans">
          <button
            type="submit"
            className="bg-primary-100 hover:bg-primary-300 w-24 hover:bg-blue-700 text-white font-semibold px-4 py-2 mr-2 rounded font-open-sans"
          >
            Yes
          </button>
          <button
            type="button"
            className="bg-red-500 w-24 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded font-open-sans"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupDialog;
