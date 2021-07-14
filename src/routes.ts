import { NextFunction, Request, Response, Router } from "express"
import { v4 as uuidv4 } from 'uuid'
import { User, Users, Todo } from "./store/protocols/User_Protocol"
import { users } from "./store/user"
const router = Router()

function checksExistsUserAccount(req: Users, response: Response, next: NextFunction) {
    const user = users.find(u => u.username === req.headers.username)
    if (!user) {
        return response.status(400).json({ message: "User does not exist" })
    }
    req.user = user
    next()
}

router.post('/users', (req: Request, res: Response) => {
    const { name, username } = req.body
    const id = uuidv4()
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ msg: 'User with username already exists' })
    }
    const user = { id, name, username, todos: [] }
    users.push(user)
    return res.status(200).json(user)
})
router.get('/todos', checksExistsUserAccount, (req: Users, res: Response) => {
    return res.status(200).json(req.user.todos)
})
router.post('/todos', checksExistsUserAccount, (req: Users, res: Response) => {
    const { title, deadline } = req.body
    const { user } = req

    const id = uuidv4()
    const todo = { id, title, done: false, deadline: new Date(deadline), created_at: new Date() }
    user.todos.push(todo)
    return res.status(200).json(todo)
})
router.put('/todos/:id', checksExistsUserAccount, (req: Users, res: Response) => {
    const { title, deadline } = req.body
    const { user } = req

    let todo = user.todos.find(t => t.id === req.params.id)
    if (todo) {
        todo.title = title
        todo.deadline = new Date(deadline)
        return res.status(200).json(todo)
    }
    return res.status(400).json({ msg: "Todo not found" })


})
router.patch('/todos/:id/done', checksExistsUserAccount, (req: Users, res: Response) => {
    const { user } = req

    let todo = user.todos.find(t => t.id === req.params.id)
    if (todo) {
        todo.done = true
        return res.status(200).json(todo)
    }
    return res.status(400).json({ msg: "Todo not found" })
})
router.delete('/todos/:id', checksExistsUserAccount, (req: Users, res: Response) => {
    const { user } = req

    let todoExists = user.todos.some(t => t.id === req.params.id)
    if (todoExists) {
        user.todos = user.todos.filter(t => t.id !== req.params.id)
        return res.status(200).json(user.todos)
    }
    return res.status(400).json({ msg: "Todos is empty" })
})


export { router }