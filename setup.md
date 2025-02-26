# pruff-scraping

## Stack

Este projecto esta divido en backend y frontend. Para definir la infraestructura se utilizo SAM (Serverless Application Model) de AWS.

### Backend

El backend esta desarrollado en Node.js y TypeScript. Se utilizo DynamoDB como base de datos. Fue deployado en AWS Lambda y API Gateway.

### Frontend

El frontend esta desarrollado en React.js y TypeScript, utilizando componentes de DaisyUI. Fue deployado en AWS S3 y CloudFront.

## Setup

1. Instalar SAM CLI, Docker y Node.js como se indica en el [README.md](./backend/README.md/#Deploy the sample application)
2. Crear el archivo `.env` en la carpeta `frontend`con las variables de entorno del archivo `frontend/.env.example`
3. Completar las variables de entorno en el archivo `backend/env.json`

## Local Development

Seguir los pasos del [README.md](./backend/README.md/#Test locally with dynamodb)

1. Correr el backend con `sam local start-api --env-vars env.json`
2. Correr el frontend con `npm run start`
3. Correr y crear la base de datos de dynamodb con `docker`

## Deploy

Reemplazar las variables de entorno en el archivo `template.yaml` para todos los recursos de AWS.

Para el backend seguir los pasos del [README.md](./backend/README.md/#Deploy the sample application)
Para el frontend seguir los pasos del [README.md](./frontend/README.md/#Deploy frontend)

## Recursos
Para crear este proyecto se utilizo la siguiente documentacion:
- Templates de SAM: https://github.com/aws/aws-sam-cli-app-templates/tree/master/nodejs22.x

- Ejemplo de Chromium as a Layer for AWS SAM: https://github.com/Sparticuz/chromium/tree/master/examples/aws-sam

- Guia de uso de Puppeteer: https://www.webshare.io/academy-article/puppeteer-get-element

- Guia de Schedule con AWS: https://dev.to/arbythecoder/creating-a-scheduled-lambda-function-on-aws-a-step-by-step-guide-34na

Sumado a la documentacion oficial de las tecnologias utilizadas y otros recursos de la web.
