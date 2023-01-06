import React, { useRef } from "react";
import { MdClose } from "react-icons/md";
const Modal = ({ setIsModalOpen }) => {
  const formRef = useRef();

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-outside") {
      setIsModalOpen(false);
    }
  };

  const toggleModalOpen = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <>
      <div
        className="fixed bg-gray-700 w-screen h-screen top-0 left-0 bg-opacity-90 flex flex-col"
        id="modal-outside"
        onClick={handleOutsideClick}
      >
        {/* Close Button */}
        <button
          className="text-white text-4xl pr-10 pt-5 self-end"
          onClick={toggleModalOpen}
        >
          <MdClose />
        </button>
        {/* Search Container */}
        <div
          className="self-center bg-gray-800 opacity-100 w-4/5 md:w-3/5 lg:w-4/5 xl:w-2/5 rounded mt-16 p-6 md:p-10 flex flex-col gap-10 items-center"
          id="modal-inside"
        >
          <h1 className="text-xl md:text-3xl lg:text-4xl text-slate-200 self-center">
            Leave a message
          </h1>
          <form
            className="flex flex-col w-full gap-5 lg:px-32"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="">
              <label htmlFor="name"></label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                className="w-full rounded-md bg-slate-300 p-3 outline-none"
              />
            </div>
            <div>
              <label htmlFor="email"></label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="w-full rounded-md bg-slate-300 p-3 outline-none"
              />
            </div>
            <div>
              <label htmlFor="subject"></label>
              <input
                type="text"
                placeholder="Subject"
                id="subject"
                className="w-full rounded-md bg-slate-300 p-3 outline-none"
              />
            </div>
            <textarea
              name="message"
              id="message"
              className="w-full rounded-md bg-slate-300 p-3 min-h-[100px] max-h-[300px] outline-none"
              placeholder="Message"
            ></textarea>
            <button
              type="submit"
              className="bg-slate-400 rounded-md p-2 text-slate-700 text-md md:text-lg font-medium"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
