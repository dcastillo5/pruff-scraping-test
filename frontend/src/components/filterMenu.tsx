import { useContext } from "react";
import { defaultFilters, filterType } from "../types/properties";
import { PropertiesContext } from "../context/propertiesProvider";

export type filterProps = {
  type: filterType;
  options: { value: string; selected: boolean }[];
  setFilter: (filterType: filterType, value: string) => void;
};

const MenuButtons = () => {
  const { filters, setSearchStatus, setFilters, searchStatus } = useContext(PropertiesContext);

  const handleSearch = () => {
    setFilters({ ...filters, take: defaultFilters.take, skip: defaultFilters.skip });
    setSearchStatus("search");
  };
  const cleanFilters = () => {
    setFilters(defaultFilters);
  };

  const isDisabled = searchStatus === "isLoading";

  return (
    <div className="join join-vertical lg:join-horizontal lg:space-x-2 space-y-2 p-2">
      <button
        className="join-item btn btn-xs	btn-outline hover:text-white max-w-max disabled:bg-gray-200"
        onClick={handleSearch}
        disabled={isDisabled}
      >
        Buscar
        {isDisabled ? (
          <span className="w-4 h-4 loading loading-spinner"></span>
        ) : (
          <svg
            className="w-4 h-4 text-gray-800 hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        )}
      </button>
      <button className="join-item btn btn-xs	btn-outline hover:text-white max-w-max" onClick={cleanFilters}>
        Limpiar
        <svg
          className="w-4 h-4 text-gray-800 hover:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
          />
        </svg>
      </button>
    </div>
  );
};

const Filter = ({ type, options, setFilter }: filterProps) => {
  return (
    <li>
      <h2 className="menu-title">{type}</h2>
      <ul>
        {options.map((option) => (
          <li className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{option.value}</span>
              <input
                name={option.value}
                type="checkbox"
                className="checkbox checkbox-xs"
                onChange={(e) => {
                  setFilter(type, option.value);
                }}
                checked={option.selected}
              />
            </label>
          </li>
        ))}
      </ul>
    </li>
  );
};

export const FilterMenu = () => {
  const { filters, setFilters } = useContext(PropertiesContext);

  const handleMultipleSelect = (filterType: filterType, value: string) => {
    const new_filter = filters[filterType].map((option) => {
      if (option.value === value) {
        return { ...option, selected: !option.selected };
      }
      return option;
    });
    setFilters({ ...filters, [filterType]: new_filter });
  };

  const handleUniqueSelect = (filterType: filterType, value: string) => {
    const new_filter = filters[filterType].map((option) => {
      if (option.value === value) {
        return { ...option, selected: !option.selected };
      }
      return { ...option, selected: false };
    });
    setFilters({ ...filters, [filterType]: new_filter });
  };

  return (
    <ul className="menu bg-base-200 rounded-box w-72">
      <MenuButtons />
      <Filter
        type={filterType.TransactionType}
        options={filters[filterType.TransactionType]}
        setFilter={handleUniqueSelect}
      />
      <Filter
        type={filterType.PropertyType}
        options={filters[filterType.PropertyType]}
        setFilter={handleUniqueSelect}
      />
      <Filter
        type={filterType.Neighborhood}
        options={filters[filterType.Neighborhood]}
        setFilter={handleMultipleSelect}
      />
    </ul>
  );
};
