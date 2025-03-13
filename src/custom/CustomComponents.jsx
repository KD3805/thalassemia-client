import { CgSpinner } from "react-icons/cg";

/**
 * InputField Component for cleaner JSX
 */
const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  max,
  readOnly = false,
}) => (
  <div>
    <label htmlFor={id} className="block font-bold">
      {label} <span className="text-red-300">*</span>
    </label>
    <input
      type={type}
      id={id}
      className={`w-full p-2 border rounded text-black bg-white focus:outline-none ${readOnly
        ? "bg-transparent border-gray-300 text-gray-200 focus:outline-none"
        : "focus:ring focus:ring-blue-300"
        }`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      max={max}
      readOnly={readOnly}
    />
    {error && <small className="text-sm text-zinc-200">{error}</small>}
  </div>
);

/**
 * SelectField Component for Dropdowns
 */
const SelectField = ({ label, id, options, value, error, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block font-bold">
      {label} <span className="text-red-300">*</span>
    </label>
    <select
      id={id}
      className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-blue-300"
      value={value}
      onChange={onChange}
    >
      <option value="">-Select {label}-</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <small className="text-zinc-200">{error}</small>}
  </div>
);

/**
 * TextAreaField Component
 */
const TextAreaField = ({
  label,
  id,
  placeholder,
  value,
  error,
  onChange,
  mandatory = true,
}) => (
  <div>
    <label htmlFor={id} className="block font-bold">
      {label}
      {mandatory && <span className="text-red-300">*</span>}
    </label>
    <textarea
      id={id}
      rows={3}
      className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-blue-300"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <small className="text-zinc-200">{error}</small>}
  </div>
);

const OutlinedButton = ({
  type = "submit",
  disabled = false,
  loading = false,
  onClick = () => { },
  text = "submit",
  w = "w-full"
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled} // Disable button during loading or if OTP expired
    className={`flex items-center font-bold justify-center ${w} h-10 px-6 py-2 rounded shadow cursor-pointer focus:outline-none  transition-all duration-300 ${loading
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-white border-2 border-red-700 text-red-700 hover:bg-red-400 hover:text-white hover:border-none"
      }`}
  >
    {loading ? <CgSpinner size={20} className="animate-spin" /> : text}
  </button>
);

const FilledButton = ({
  type = "submit",
  disabled = false,
  loading = false,
  onClick = () => {},
  text = "submit",
  w = "w-full"
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`cursor-pointer flex items-center font-bold justify-center ${w} h-10 px-6 py-2 rounded shadow focus:outline-none transition-all duration-300 
      ${loading
        ? "bg-gray-300 cursor-not-allowed"
        : "border-2 border-red-500 bg-red-500 text-white hover:bg-red-700  hover:border-none"
      }`}
  >
    {loading ? <CgSpinner size={20} className="animate-spin" /> : text}
  </button>
);


export { InputField, SelectField, TextAreaField, OutlinedButton, FilledButton };
