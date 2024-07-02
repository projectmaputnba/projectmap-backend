import { ApiProperty } from '@nestjs/swagger'
import { Area, Importancia, Intensidad, Tendencia } from './enums'

export class PestelDto {
    @ApiProperty()
    titulo: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    factores: {
        factor: string
        area: string
        descripcion: string
        importancia: string
        intensidad: string
        tendencia: string
    }[]
}

export class FactorDto {
    @ApiProperty({ enum: Area })
    area: Area

    @ApiProperty()
    descripcion: string

    @ApiProperty({ enum: Importancia })
    importancia: Importancia

    @ApiProperty({ enum: Intensidad })
    intensidad: Intensidad

    @ApiProperty({ enum: Tendencia })
    tendencia: Tendencia
}
