import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { McKinsey, MckinseyDocument, UnidadDeNegocio } from './mckinsey.schema'
import { McKinseyDto, UnidadDeNegocioDto } from './mckinsey.dto'

@Injectable()
export class MckinseyService {
    constructor(
        @InjectModel(McKinsey.name)
        private mckinseyModel: Model<MckinseyDocument>
    ) {}

    async create(mckinseyDto: McKinseyDto) {
        const mckinsey = new this.mckinseyModel(mckinseyDto)
        return mckinsey.save()
    }

    async findById(toolId: string) {
        return this.mckinseyModel.findOne({ _id: toolId }).exec()
    }

    async editUnidadDeNegocio(
        porterId: string,
        unidadDeNegocioId: string,
        unidadDeNegocioDto: UnidadDeNegocioDto
    ) {
        const mcKinsey = await this.mckinseyModel
            .findOne({ _id: porterId })
            .exec()
        if (!mcKinsey) {
            throw new NotFoundException()
        }
        mcKinsey.unidadesDeNegocio = mcKinsey.unidadesDeNegocio.map(
            (unidadDeNegocio) => {
                if (unidadDeNegocio._id.toString() == unidadDeNegocioId) {
                    unidadDeNegocio.fuerzaCompetitiva =
                        unidadDeNegocioDto.fuerzaCompetitiva
                    unidadDeNegocio.atractivoDeMercado =
                        unidadDeNegocioDto.atractivoDeMercado
                    unidadDeNegocio.nombre = unidadDeNegocioDto.nombre
                    return unidadDeNegocio
                }
                return unidadDeNegocio
            }
        )
        return new this.mckinseyModel(mcKinsey).save()
    }

    async getAllByProjectId(projectId: string) {
        return this.mckinseyModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async removeUnidadDeNegocio(mcKinseyId: string, unidadId: string) {
        const mcKinsey = await this.mckinseyModel
            .findOne({ _id: mcKinseyId })
            .exec()
        if (!mcKinsey) {
            throw new NotFoundException()
        }
        mcKinsey.unidadesDeNegocio = mcKinsey.unidadesDeNegocio.filter(
            (unidad) => unidad._id.toString() != unidadId
        )
        return new this.mckinseyModel(mcKinsey).save()
    }

    async addUnidadDeNegocio(
        mcKinseyId: string,
        unidadDeNegocioDto: UnidadDeNegocioDto
    ) {
        const mcKinsey = await this.mckinseyModel
            .findOne({ _id: mcKinseyId })
            .exec()
        if (!mcKinsey) {
            throw new NotFoundException()
        }
        const unidadDeNegocio = new UnidadDeNegocio(
            unidadDeNegocioDto.nombre,
            unidadDeNegocioDto.fuerzaCompetitiva,
            unidadDeNegocioDto.atractivoDeMercado
        )
        mcKinsey.unidadesDeNegocio.push(unidadDeNegocio)
        return new this.mckinseyModel(mcKinsey).save()
    }

    async delete(id: string) {
        const result = await this.mckinseyModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('McKinsey not found', HttpStatus.NOT_FOUND)
    }

    async deleteAllWithProjectId(projectId: string) {
        const result = await this.mckinseyModel.deleteMany({ projectId })

        if (result && result.acknowledged) {
            return projectId
        } else {
            throw new HttpException(
                'McKinsey delete error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
