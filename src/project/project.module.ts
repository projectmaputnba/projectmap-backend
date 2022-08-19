import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {FodaModule} from 'src/herramientas/foda/foda.module';
import {PestelModule} from 'src/herramientas/pestel/pestel.module';
import {ProjectController} from './project.controller';
import {ProjectSchema} from './project.schema';
import {ProjectService} from './project.service';
import {AnsoffModule} from "../herramientas/ansoff/ansoff.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Project', schema: ProjectSchema}]),
        FodaModule,
        PestelModule,
        AnsoffModule
    ],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [],
})
export class ProjectModule {
}