export default function ActionButton<T = {}>({
  Icon,
  label,
  className,
  disabled,
  ...props
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`relative px-6 py-3 bg-gradient-to-br from-gray-700 to-gray-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg ${
        disabled
          ? "opacity-70 cursor-not-allowed"
          : "hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-opacity-75"
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-300 rounded-lg ${
          disabled ? "opacity-0" : "opacity-0 group-hover:opacity-10"
        }`}
      />

      <span className="flex items-center space-x-2">
        <Icon
          className={`h-5 w-5 transition-transform ${
            disabled ? "" : "group-hover:scale-110"
          }`}
        />
        <span className="text-sm tracking-wide">{label}</span>
      </span>
    </button>
  );
}
