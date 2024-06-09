import { Router } from "express"
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()
/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties : 
 *                  id:
 *                      type: number
 *                      description : The Product ID    
 *                      example: 1
 *                  name: 
 *                      type: string
 *                      description : The Product name    
 *                      example: Monitor de 45 Pulgadas
 *                  price:
 *                      type: number
 *                      description : The Product Price    
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description : The Product availability    
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags: 
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: number
 *          responses: 
 *              200:
 *                  description: Successful Response
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found 
 *              400:
 *                  description: Bad Request - Invalid ID
 */
router.get('/:id',
    param('id').isInt().withMessage('Invalid Id'),
    handleInputErrors,
    getProductById)


/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags: 
 *          - Products
 *      description: Return a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          name: 
 *                              type: string
 *                              example: 'Keyboard black'
 *                          price:
 *                              type: number
 *                              example: 599
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product' 
 *          400:
 *             description: Bad Request - Invalid input data
 */
router.post('/',

    // Validacion
    body('name')
        .notEmpty().withMessage("product name is required"),

    body('price')
        .isNumeric().withMessage('Value no validate')
        .notEmpty().withMessage("product name is required")
        .custom(value => value > 0).withMessage('Invalid price'),
    handleInputErrors,

    createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags: 
 *          - Products
 *      description: Returns the updated product
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to update
 *          required: true
 *          schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          name: 
 *                              type: string
 *                              example: 'Keyboard black'
 *                          price:
 *                              type: number
 *                              example: 599
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *                          
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 *          
 */
router.put('/:id',
    // Validacion
    param('id').isInt().withMessage('Invalid Id'),
    body('name')
        .notEmpty().withMessage("product name is required"),

    body('price')
        .isNumeric().withMessage('Invalid value')
        .notEmpty().withMessage("price is required")
        .custom(value => value > 0).withMessage('Invalid price'),
    body('availability').isBoolean().withMessage('Invalid availability').notEmpty().withMessage("availability is required"),
    handleInputErrors,
    updateProduct
)


/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability 
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to update
 *          required: true
 *          schema:
 *              type: number
 *      
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *                          
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
router.patch('/:id',
    param('id').isInt().withMessage('Invalid Id'),
    handleInputErrors,
    updateAvailability
)


/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a product by a given ID
 *      tags:
 *        - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in : path
 *          name: id
 *          description: The ID of the product to update
 *          required: true
 *          schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: string
 *                          example: "Removed Product"  
 *                                  
 *
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found   
 */
router.delete('/:id',
    param('id').isInt().withMessage('Invalid Id'),
    handleInputErrors,
    deleteProduct
)

export default router
