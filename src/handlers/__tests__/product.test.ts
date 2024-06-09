import request from 'supertest'
import app from '../../server'

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const res = await request(app).post('/api/products').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(app).post('/api/products').send({
            name: "Keyboard - Testing",
            price: 0
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price is a number and greater than 0', async () => {
        const res = await request(app).post('/api/products').send({
            name: "Keyboard - Testing",
            price: "hola"
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(3)

    })


    it('should create a new product', async () => {
        const res = await request(app).post('/api/products').send({
            name: "Keyboard - Testing",
            price: 200
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {
    it('should check if api/products url exists', async () => {
        const response = await request(app).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const response = await request(app).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app).get(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Product not found!')

    })

    it('should check a valid ID in the URL', async () => {
        const res = await request(app).get('/api/products/not-valid-url')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Invalid Id')
    })

    it('get a JSON response for a single product', async () => {
        const res = await request(app).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('should check a valid ID in the URL', async () => {
        const res = await request(app)
            .put(`/api/products/no-valid-url`)
            .send({
                name: "Monitor Nuevo",
                price: 444,
                availability: true
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Invalid Id')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send({
                    name: "Monitor Nuevo",
                    price: 444,
                    availability: true
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Product not found!')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should display validation error message when update a product', async () => {
        const res = await request(app).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(6)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(app)
            .put('/api/products/1')
            .send({
                name: "Monitor Nuevo",
                price: 0,
                availability: true
            })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Invalid price')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should update an existing product with valid data', async () => {
        const res = await request(app)
            .put(`/api/products/1`)
            .send({
                    name: "Monitor Nuevo",
                    price: 444,
                    availability: true
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')

    })
})

describe('PATCH /api/products/:id', () =>{
    it('should check a valid Id', async () => {
        const res = await request(app).patch('/api/products/not-valid-id')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('Invalid Id')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should return 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app).patch(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Product not found!')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async ()=>{
        const res = await request(app).patch('/api/products/1')
        
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.availability).toBe(false)

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid Id', async () => {
        const res = await request(app).delete('/api/products/not-valid')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('Invalid Id')

        expect(res.status).not.toBe(200)
    })

    it('should return 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app).delete(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Product not found!')

        expect(res.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(app).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe('Removed Product')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})