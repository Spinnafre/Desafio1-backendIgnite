import supertest from 'supertest'
import { validate } from 'uuid'
import { app } from '../app'

describe('Users', () => {
    test('should be able to create a new user', async () => {
        const response = await supertest(app)
        .post('/users')
        .send({
            name: 'John Doe',
            username: 'johndoe'
        })
        
        expect(response.statusCode).toBe(200)
        expect(validate(response.body.id)).toBe(true)
        expect(response.body).toMatchObject({
            name: 'John Doe',
            username: 'johndoe',
            todos: []
        })
    })
    test('should not be able to create a new user when username already exists', async () => {
        await supertest(app)
        .post('/users')
        .send({
            name: 'John Doe',
            username: 'johndoe'
        })

        const response = await supertest(app)
        .post('/users')
        .send({
            name: 'John Doe',
            username: 'johndoe'
        })
        expect(response.body.msg).toEqual('User with username already exists')

    })
})

