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

  return (
    <>
      <ButtonComponent onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          aria-hidden={!isOpen}
        >
          <ModalComponent
            onClose={() => setIsOpen(false)}
            {...(modalProps as T)}
          />
        </div>
      )}
    </>
  );
};

export default PopupButton;
