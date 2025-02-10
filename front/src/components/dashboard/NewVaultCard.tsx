"use client";

import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

const NewVaultCard = () => {
  const [open, setOpen] = useState(false);
  const [vaultName, setVaultName] = useState("");

  const handleOpen = () => setOpen(!open);
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const colors = ["red", "blue", "green", "purple", "yellow"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  function createNewVault() {
    console.log("Create a new vault: '" + vaultName + "' - " + selectedColor)
  }

  return (
    <>
      <div
        className="relative w-full max-w-sm p-6 rounded-xl border-2 border-dashed border-gray-400 transition-all hover:shadow-lg text-center flex flex-col items-center justify-center cursor-pointer"
        onClick={handleOpen}
      >
        <FaPlusCircle className="text-gray-500 text-4xl mb-3" />
        <h3 className="text-lg font-semibold text-gray-600">Create New Vault</h3>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          aria-hidden={!open}
        >
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm bg-white">
            {/* Modal Header */}
            <div className="relative flex items-center justify-center h-24 bg-slate-800 text-white">
              <h3 className="text-2xl">Create new Vault</h3>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-4 p-6">
              <div className="w-full max-w-sm">
                <label className="block mb-2 text-sm text-slate-600">Vault Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Vault Name"
                  value={vaultName}
                  onChange={e => setVaultName(e.target.value)}
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block mb-2 text-sm text-slate-600">Choose a Color</label>
                <div className="flex justify-center gap-3">
                  {colors.map((color) => {
                    
                    return (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-xl cursor-pointer border-2 transition-all bg-${color}-100 text-${color}-800 ${
                          selectedColor === color ? `scale-110 border-${color}-300` : "border-transparent"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      />
                  )})}
                  
                </div>
              </div>

              
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button
                className="w-full rounded-md bg-slate-800 py-2 px-4 text-white shadow-md hover:bg-slate-700"
                type="button"
                onClick={() => createNewVault()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewVaultCard;
