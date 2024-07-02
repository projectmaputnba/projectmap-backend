import mongoose from 'mongoose'
import { User } from './user.schema'
import { UserService } from './user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

describe('UserController', () => {
    let userModel: mongoose.Model<User>
    let userService: UserService
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(User.name),
                    useValue: mongoose.Model, // <-- Use the Model Class from Mongoose
                },
                UserService,
            ],
        }).compile()
        userModel = module.get<mongoose.Model<User>>(getModelToken(User.name))
        userService = module.get<UserService>(UserService)
    })

    describe('findByPayload', () => {
        it('should find user by an email', async () => {
            const testUser = new User()
            testUser.firstName = 'Pepe'
            const spy = jest
                .spyOn(userModel, 'findOne')
                .mockResolvedValue(testUser as User)

            await userService.findByPayload({ email: 'foo@bar.com' })
            // expect(await userController.findById('foo')).toBe(testUser)
            expect(spy).toHaveBeenCalled()
        })
    })
})
