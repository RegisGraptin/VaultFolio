import { ReactNode } from "react";

export default function LoadingButton({
  children,
  isLoading,
  onClick,
  ...props
}: {
  children: ReactNode;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      {...props}
      className={`w-full rounded-md bg-slate-800 py-2 px-4 text-white shadow-md transition-all ${
        isLoading
          ? "cursor-not-allowed opacity-75 hover:bg-slate-800"
          : "hover:bg-slate-700"
      }`}
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
