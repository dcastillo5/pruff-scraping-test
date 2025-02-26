export const buildEmailContent = (searchHistory: any) => {
  const emailContent = `
        <h1>Hola!</h1>
        <p>Estas son las busquedas personalizadas de propiedades que has realizado hoy:</p>
        <ol>
        ${searchHistory?.map((history: any) => {
          return `
            <li>
              <ul>
                <li>Tipo: ${history.propertyType}</li>
                <li>Comunas: ${history.neighboorhood}</li>
                <li>Transaccion: ${history.transactionType}</li>
              </ul>
            </li>`;
        })}
        </ol>`;
  return emailContent;
};
