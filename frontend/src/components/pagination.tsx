import { useContext } from "react";
import { PropertiesContext } from "../context/propertiesProvider";
import { defaultFilters } from "../types/properties";

export const Pagination = () => {
  const { filters, setFilters, setSearchStatus, searchStatus, hasMoreProperties } = useContext(PropertiesContext);

  const handleLoadMore = () => {
    setFilters({ ...filters, skip: filters.skip + defaultFilters.take });
    setSearchStatus("loadMore");
  };

  if (searchStatus === "isLoading" || !hasMoreProperties) {
    return <></>;
  }
  return (
    <button className="btn" onClick={handleLoadMore}>
      Cargar mas
      {searchStatus === "loadMore" ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <span className="text-xl"> + </span>
      )}
    </button>
  );
};
