import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi : '3.0.2',
        tags: [
            {
                name : 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis : ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link{
            content: url('https://www.eventur.com/wp-content/uploads/2019/02/api-icon.png');
            background-color: white;
            border-radius: 5px;
            height: 110px;
            width: auto;
        }

        .swagger-ui .topbar{
            background-color: #003A5B;
            padding: 20px
        }
    `,
    customSiteTitle: 'Documentacion REST API Express / TS - Products'
}

export default swaggerSpec
export {
    swaggerUiOptions
}