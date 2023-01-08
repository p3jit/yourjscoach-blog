import React, { useRef } from "react";
import { MdClose } from "react-icons/md";
import { BsLinkedin } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
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
        className="fixed bg-gray-700 w-screen h-screen top-0 left-0 bg-opacity-90 flex flex-col backdrop-blur-sm z-1 overflow-hidden"
        id="modal-outside relative"
        onClick={handleOutsideClick}
      >
        {/* Close Button */}
        <button
          className="text-white text-4xl pr-10 pt-5 self-end"
          onClick={toggleModalOpen}
        >
          <MdClose />
        </button>
        {/* Contact Form */}
        <div
          className="self-center py-10 bg-gray-800 opacity-100 w-4/5 md:w-3/5 lg:w-4/5 xl:w-2/5 rounded mt-16 p-6 md:p-10 flex flex-col gap-10"
          id="modal-inside"
        >
          <div className="flex flex-col w-full items-center text-white gap-10">
            <img
              src={"./dp.jpeg"}
              alt=""
              className="object-contain rounded-full w-28 md:w-40"
            />
            <p className="self-start flex flex-col gap-1 text-slate-200">
              <span className="text-5xl">Hi,</span> I am Prithijit Das.
              Currently working at Accenture, India as a Software Engineer.
              Thank you for vising this website where I aim to share resources
              for Javascript and its related frameworks.I hope it will help you
              gain knowledge and crack interviews in the long run.
            </p>
            <div className="flex gap-5 items-center self-start">
              <p>Connect with me on:</p>
              <MdEmail className="text-3xl cursor-pointer" />
              <BsLinkedin className="text-2xl cursor-pointer" />
            </div>
          </div>
          {/* <h1 className="text-xl md:text-3xl lg:text-4xl text-slate-200 self-center">
            Feel free to leave a message
          </h1>
          <form
            className="flex flex-col w-full gap-5 md:px-24"
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
          </form> */}
        </div>
      </div>
    </>
  );
};

export default Modal;
