import { MdSearch } from "react-icons/md";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Tìm kiếm sản phẩm...",
}: SearchInputProps) => {
  return (
    <div className="flex-1 relative">
      <MdSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
      />
    </div>
  );
};

export default SearchInput;
