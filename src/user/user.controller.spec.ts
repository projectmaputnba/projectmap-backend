import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { User } from './user.schema'
import { UserService } from './user.service'

describe('UserController', () => {
    let userService: UserService
    let userController: UserController
    const testUser = new User()
    testUser.firstName = 'Pepe'

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,

                    useValue: {
                        findById: jest.fn().mockResolvedValueOnce(testUser),
                        // populate: jest.fn().mockResolvedValue(testUser),
                    },
                },
                UserService,
            ],
        }).compile()
        userService = module.get<UserService>(UserService)
        userController = module.get<UserController>(UserController)
    })

    describe('findById', () => {
        it('should find user by id', async () => {
            const spy = jest
                .spyOn(userService, 'findById')
                .mockResolvedValue(testUser)
            await userController.findById('foo')
            expect(spy).toHaveBeenCalledWith('foo')
        })
    })
})
