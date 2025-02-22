import { useState } from "react";

interface PopupButtonProps<T = {}> {
  ButtonComponent: React.ComponentType<{ onClick: () => void }>;
  ModalComponent: React.ComponentType<{ onClose: () => void } & T>;
  modalProps?: T;
}

const PopupButton = <T,>({
  ButtonComponent,
  ModalComponent,
  modalProps,
}: PopupButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  const onModalClose = () => {
    setIsOpen(false); // Close the modal
    if (modalProps && typeof (modalProps as any).onClose === "function") {
      (modalProps as any).onClose(); // Call the additional onClose function
    }
  };

  return (
    <>
      <ButtonComponent onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          aria-hidden={!isOpen}
        >
          {/* Order in the props are important here */}
          <ModalComponent {...(modalProps as T)} onClose={onModalClose} />
        </div>
      )}
    </>
  );
};

export default PopupButton;
