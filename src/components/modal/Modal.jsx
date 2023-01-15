import { MdClose } from "react-icons/md";
import { BsLinkedin } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
const Modal = ({ setIsModalOpen }) => {
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-outside") {
      toggleModalOpen();
    }
  };

  const toggleModalOpen = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="fixed bg-gray-700 w-screen h-screen top-0 left-0 bg-opacity-90 flex flex-col backdrop-blur-sm z-1 overflow-hidden"
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
              <p>Connect me on:</p>
              <a href="mailto:prithi.das.007@gmail.com">
                <MdEmail className="text-3xl cursor-pointer" />
              </a>

              <a href="https://www.linkedin.com/in/p3jit/" target={"_blank"}>
                <BsLinkedin className="text-2xl cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
