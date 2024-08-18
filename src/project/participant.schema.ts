import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from 'src/user/user.schema'
import { Sphere } from './sphere.schema'

@Schema()
export class Participant {
    @Prop({ type: String })
    user: User

    @Prop({ type: Object })
    spheres: Sphere[]
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
