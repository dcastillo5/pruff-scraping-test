import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { defaultFilters, filters, filterType, property, propertyType } from "../types/properties";
import { User } from "../App";

const APP_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
type searchStatus = "search" | "ready" | "loadMore" | "isLoading";
type contextType = {
  properties: property[];
  setProperties: Dispatch<SetStateAction<property[]>>;
  filters: filters;
  setFilters: (filters: filters) => void;
  searchStatus: searchStatus;
  setSearchStatus: (status: searchStatus) => void;
  hasMoreProperties: boolean;
  setFavorites: (href: string) => void;
};

export const PropertiesContext = createContext<contextType>({
  properties: [],
  setProperties: () => {},
  filters: defaultFilters,
  setFilters: () => {},
  searchStatus: "search",
  setSearchStatus: () => {},
  hasMoreProperties: false,
  setFavorites: () => {},
});

const parseFilters = (filters: filters) => {
  return {
    ...filters,
    propertyType: filters[filterType.PropertyType]
      .filter((filter) => filter.selected)
      ?.map((filter) => filter.value)[0],
    neighborhood: filters[filterType.Neighborhood]
      .filter((filter) => filter.selected)
      ?.map((filter) => filter.value.toLowerCase().split(" ").join("-"))
      .join(","),
    transactionType: filters[filterType.TransactionType]
      .filter((filter) => filter.selected)
      ?.map((filter) => filter.value)[0],
  };
};

const buildURL = (filters: filters) => {
  const { propertyType, neighborhood, transactionType, take, skip } = parseFilters(filters);

  let url = `${APP_API_ENDPOINT}/properties?take=${take}&skip=${skip}&`;
  if (transactionType) {
    url += `transactionType=${transactionType}&`;
  }
  if (propertyType) {
    url += `propertyType=${propertyType}&`;
  }
  if (neighborhood) {
    url += `neighborhood=${neighborhood}&`;
  }
  return url;
};

export const PropertiesProvider = ({
  children,
  user,
  setUser,
}: {
  children: React.ReactNode;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  const [searchStatus, setSearchStatus] = useState<searchStatus>("search");
  const [filters, setFilters] = useState(defaultFilters);
  const [properties, setProperties] = useState<property[]>([]);
  const [hasMoreProperties, setHasMoreProperties] = useState(false);

  const setFavorites = (href: string) => {
    fetch(`${APP_API_ENDPOINT}/favorite`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        favoriteProperty: href,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error saving favorite property");
        }
        return res.json();
      })
      .then((data) => {
        const message = data.message;
        if (message === "Property removed from favorites") {
          setUser({
            ...user,
            favoriteProperties: user.favoriteProperties?.filter((property) => property !== href),
          });
          setProperties(
            properties.map((property) => (property.href === href ? { ...property, favorite: false } : property))
          );
          return;
        } else if (message === "Property added to favorites") {
          const favoriteProperties = user.favoriteProperties || [];
          setUser({ ...user, favoriteProperties: [...favoriteProperties, href] });
          setProperties(
            properties.map((property) => (property.href === href ? { ...property, favorite: true } : property))
          );
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (searchStatus !== "search" && searchStatus !== "loadMore") {
      return;
    }
    const url = buildURL(filters);
    if (searchStatus === "search") {
      setSearchStatus("isLoading");
    }

    fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error fetching properties");
        }
        return res.json();
      })
      .then((data) => {
        const loadedProperties = data.body.properties.map((property: property) => {
          return {
            ...property,
            favorite: user.favoriteProperties?.includes(property.href),
          };
        });

        if (searchStatus === "loadMore") {
          if (loadedProperties.length > 0) {
            setProperties([...properties, ...loadedProperties]);
          }
        } else {
          setProperties(loadedProperties);
        }
        setHasMoreProperties(data.body.hasMoreProperties);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setSearchStatus("ready");
      });

    fetch(`${APP_API_ENDPOINT}/search-history`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        propertyType: parseFilters(filters).propertyType,
        neighborhood: parseFilters(filters).neighborhood,
        transactionType: parseFilters(filters).transactionType,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error saving search history");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Search history saved", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [filters, searchStatus, properties]);

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        setProperties,
        filters,
        setFilters,
        searchStatus,
        setSearchStatus,
        hasMoreProperties,
        setFavorites,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};
