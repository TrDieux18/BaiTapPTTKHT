import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Category {
  value: string;
  label: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}

const CategorySelect = ({
  value,
  onChange,
  categories,
}: CategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((cat) => cat.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (categoryValue: string) => {
    onChange(categoryValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative min-w-[200px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-between"
      >
        <span>{selectedCategory?.label || "Chọn danh mục"}</span>
        <MdKeyboardArrowDown
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => handleSelect(category.value)}
              className={`w-full px-4 py-3 text-left text-slate-100 hover:bg-slate-700 transition-colors ${
                category.value === value ? "bg-slate-700" : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
