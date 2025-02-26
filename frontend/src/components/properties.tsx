import { useContext } from "react";
import { PropertiesContext } from "../context/propertiesProvider";

type propertyType = {
  place: string;
  href: string;
  img: string;
  title: string;
  priceUF: string;
  priceCL: string;
  sold: boolean;
  details: string;
  favorite?: boolean;
};

const PropertyItem = ({
  property,
  handleFavoriteClick,
}: {
  property: propertyType;
  handleFavoriteClick: (href: string) => void;
}) => {
  return (
    <tr key={`${property.title}-${property.place}-${property.sold}`}>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14">
              <img src={property.img} alt={property.title} />
            </div>
          </div>
          <div>
            <div className="font-bold">{property.title}</div>
            <div className="text-sm opacity-50">{property.place}</div>
          </div>
        </div>
      </td>
      <td>
        {property.priceUF ? (
          <span className="badge badge-ghost badge-sm h-fit">{property.priceUF}</span>
        ) : (
          <div className="divider w-20"></div>
        )}
      </td>
      <td>
        {property.priceCL ? (
          <span className="badge badge-ghost badge-sm h-fit">{property.priceCL}</span>
        ) : (
          <div className="divider w-20"></div>
        )}
      </td>
      <td>
        {property.sold ? (
          <span className="badge badge-warning	badge-sm h-fit">No disponible</span>
        ) : (
          <span className="badge badge-success	badge-sm h-fit">Disponible</span>
        )}
      </td>
      <td>
        <a href={property.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-xs">
          Ver detalles
        </a>
      </td>
      <td>
        <button className="btn btn-circle btn-ghost" onClick={() => handleFavoriteClick(property.href)}>
          {property.favorite ? (
            <svg
              className="w-6 h-6 text-red-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-800"
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
                d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
              />
            </svg>
          )}
        </button>
      </td>
    </tr>
  );
};
export const Properties = () => {
  const { properties, searchStatus, setFavorites } = useContext(PropertiesContext);
  if (searchStatus === "isLoading") {
    return (
      <div className="flex justify-center w-full h-full">
        <span className="loading loading-dots loading-lg justify-center"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="table">
        <thead>
          <tr>
            <th>Propiedad</th>
            <th>Precio UF</th>
            <th>Precio CLP</th>
            <th>Disponibilidad</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {properties?.map((property) => (
            <PropertyItem property={property} handleFavoriteClick={setFavorites} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
