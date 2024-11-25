import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    ImATeapotException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { PdcaService } from 'src/herramientas/pdca/pdca.service'
import { AnsoffService } from '../herramientas/ansoff/ansoff.service'
import { BalancedScorecardService } from '../herramientas/balancedScorecard/balancedScorecard.service'
import { FodaService } from '../herramientas/foda/foda.service'
import { MckinseyService } from '../herramientas/mckinsey/mckinsey.service'
import { OkrService } from '../herramientas/okr/okr.service'
import { PestelService } from '../herramientas/pestel/pestel.service'
import { PorterService } from '../herramientas/porter/porter.service'
import { QuestionnaireService } from '../herramientas/questionnaire/questionnaire.service'
import { OrganizationChart } from './orgChart'
import { ProjectDto, UpdateUserRolesDto } from './project.dto'
import { ProjectService } from './project.service'
import { isValidStageType, isValidPermission, StageType } from './stage.schema'

@UseGuards(AuthGuard('jwt'))
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(
        private projectService: ProjectService,
        private fodaService: FodaService,
        private pestelService: PestelService,
        private ansoffService: AnsoffService,
        private porterService: PorterService,
        private mckinseyService: MckinseyService,
        private okrService: OkrService,
        private balancedService: BalancedScorecardService,
        private questionnaireService: QuestionnaireService,
        private pdcaService: PdcaService
    ) {}

    @Get('/shared')
    @ApiOperation({ summary: 'Throws an HTTP 418 error' })
    @ApiResponse({ status: 418, description: "I'm a teapot" })
    async goAway() {
        throw new ImATeapotException()
    }

    @Get('')
    @ApiOperation({ summary: 'Retrieve all projects associated with the user' })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit of projects to retrieve',
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        description: 'Offset for pagination',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term to filter projects',
    })
    @ApiResponse({ status: 200, description: 'List of user projects' })
    async getAllUserProjects(
        @Req() req: { user: { id: string } },
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('search') search: string
    ) {
        const { id } = req.user

        const [projects, total] = await this.projectService.findUserProjects(
            id,
            limit || 10,
            offset || 0,
            search
        )

        return {
            items: projects,
            total,
        }
    }

    @Get(':id/foda')
    async getFoda(@Param('id') id: string) {
        const fodas = await this.fodaService.getAllByProjectId(id)
        return fodas
    }
    @Get(':id/pestel')
    async getPestel(@Param('id') id: string) {
        const pestels = await this.pestelService.getAllByProjectId(id)
        return pestels
    }
    @Get(':id/ansoff')
    async getAnsoff(@Param('id') id: string) {
        const ansoffs = await this.ansoffService.getAllByProjectId(id)
        return ansoffs
    }
    @Get(':projectId/porter')
    async getPorter(@Param('projectId') projectId: string) {
        const porters = await this.porterService.getAllByProjectId(projectId)
        return porters
    }
    @Get(':projectId/mckinsey')
    async getMcKinsey(@Param('projectId') projectId: string) {
        const mckinseys =
            await this.mckinseyService.getAllByProjectId(projectId)
        return mckinseys
    }
    @Get(':projectId/okr-projects')
    async getOkr(@Param('projectId') projectId: string) {
        return this.okrService.getAllByProjectId(projectId)
    }
    @Get(':projectId/balanced-scorecards')
    async getBalancedScorecards(@Param('projectId') projectId: string) {
        return this.balancedService.getAllByProjectId(projectId)
    }
    @Get(':projectId/questionnaires')
    async getQuestionnaires(@Param('projectId') projectId: string) {
        return this.questionnaireService.findByProjectId(projectId)
    }
    @Get(':projectId/pdcas')
    async getPdcas(@Param('projectId') projectId: string) {
        return this.pdcaService.findByProjectId(projectId)
    }
    @Post(':id/organizational-chart')
    async saveOrganizationalChart(
        @Param('id') projectId: string,
        @Body() chart: OrganizationChart
    ) {
        return this.projectService.addChart(projectId, chart)
    }
    @Get(':id/organizational-chart')
    async getOrganizationalChart(@Param('id') projectId: string) {
        return this.projectService.getChart(projectId)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a project by ID' })
    @ApiParam({ name: 'id', description: 'ID of the project' })
    @ApiResponse({ status: 200, description: 'Project details' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async findById(@Param('id') id: string) {
        const project = await this.projectService.getOne(id)
        return project
    }

    @Get(':projectId/shared')
    @ApiOperation({ summary: 'Get users who have access to a shared project' })
    @ApiParam({ name: 'projectId', description: 'ID of the project' })
    @ApiResponse({ status: 200, description: 'List of shared users' })
    async getSharedUsers(@Param('projectId') projectId: string) {
        return this.projectService.getSharedUsers(projectId)
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(
        @Req() req: { user: { id: string } },
        @Body() projectDTO: ProjectDto
    ) {
        const { id } = req.user

        projectDTO.requestorId = id

        const project = await this.projectService.create(projectDTO)
        return project
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing project' })
    @ApiParam({ name: 'id', description: 'ID of the project to update' })
    @ApiResponse({ status: 200, description: 'Project successfully updated' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async update(@Param('id') id: string, @Body() projectDTO: ProjectDto) {
        const project = await this.projectService.update(id, projectDTO)
        return project
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project by ID' })
    @ApiParam({ name: 'id', description: 'ID of the project to delete' })
    @ApiResponse({ status: 200, description: 'Project successfully deleted' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async delete(@Param('id') id: string) {
        const projectId = await this.projectService.delete(id)
        return {
            _id: projectId,
        }
    }

    @Put(':id/roles')
    async updateUserRoles(
        @Req() header: { user: { id: string } },
        @Param('id') projectId: string,
        @Body() req: UpdateUserRolesDto
    ) {
        if (!req || !req.users) {
            throw new HttpException(
                'Missing users to update',
                HttpStatus.BAD_REQUEST
            )
        }
        req.users.forEach((user) => {
            if (!user.role || !user.userId) {
                throw new HttpException(
                    'Invalid fields',
                    HttpStatus.BAD_REQUEST
                )
            }
            if (user.role != 'coordinator' && user.role != 'participant') {
                throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST)
            }
            if (user.role == 'participant' && !Array.isArray(user.stages)) {
                throw new HttpException(
                    'Invalid fields',
                    HttpStatus.BAD_REQUEST
                )
            }
            if (user.role == 'participant') {
                user.stages.forEach((s) => {
                    if (
                        !isValidStageType(s.id) ||
                        !isValidPermission(s.permission)
                    )
                        throw new HttpException(
                            'Invalid stage or permission',
                            HttpStatus.BAD_REQUEST
                        )
                })
                if (user.stages.length != Object.keys(StageType).length) {
                    throw new HttpException(
                        'Invalid stage count',
                        HttpStatus.BAD_REQUEST
                    )
                }
            }
        })
        const project = await this.projectService.updateUserRoles(
            header.user.id,
            projectId,
            req
        )
        return project
    }
    @Post(':id/user/add')
    async addUserToProject(
        @Req() header: { user: { id: string } },
        @Param('id') projectId: string,
        @Body()
        req: {
            userEmail: string
            role: string
        }
    ) {
        const { id } = header.user
        const project = await this.projectService.addUserToProject(
            projectId,
            req.userEmail,
            req.role,
            id
        )
        return project
    }
}
