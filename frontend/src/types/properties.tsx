export enum propertyType {
  House = "Casa",
  Apartment = "Departamento",
  Land = "Terreno",
  Ofice = "Oficina-Comercial",
}

export enum neighborhood {
  Providencia = "Providencia",
  LasCondes = "Las Condes",
  Vitacura = "Vitacura",
  LaReina = "La Reina",
  Nunoa = "Nunoa",
  Penalolen = "Penalolen",
  Santiago = "Santiago",
  LoBarnechea = "Lo Barnechea",
  Pirque = "Pirque",
  Linares = "Linares",
  Chicureo = "Chicureo",
  LaLigua = "La Ligua",
  LosLagos = "Los Lagos",
  Recoleta = "Recoleta",
}

export enum transactionType {
  Buy = "Comprar",
  Rent = "Arrendar",
  Invesment = "Inversion",
}

export enum filterType {
  PropertyType = "Tipo de propiedad",
  Neighborhood = "Comuna",
  TransactionType = "Tipo de transaccion",
}

export type property = {
  place: string;
  href: string;
  img: string;
  title: string;
  priceUF: string;
  priceCL: string;
  sold: boolean;
  details: string;
};

export type filters = {
  [filterType.PropertyType]: { value: propertyType; selected: boolean }[];
  [filterType.Neighborhood]: { value: neighborhood; selected: boolean }[];
  [filterType.TransactionType]: { value: transactionType; selected: boolean }[];
  "take": number;
  "skip": number;
};

export const defaultFilters = {
  [filterType.PropertyType]: Object.values(propertyType).map((value) => ({ value, selected: false })),
  [filterType.Neighborhood]: Object.values(neighborhood).map((value) => ({ value, selected: false })),
  [filterType.TransactionType]: Object.values(transactionType).map((value) => ({ value, selected: false })),
  "take": 75,
  "skip": 0,
};
