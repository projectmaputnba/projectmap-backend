import { SituacionDelMercado } from './situacionDelMercado'
import { SituacionDelProducto } from './situacionDelProducto'
import { Exito } from './exito'
import { Estrategia } from './estrategia'
import { ApiProperty } from '@nestjs/swagger'

export class AnsoffDto {
    @ApiProperty()
    projectId: string

    @ApiProperty()
    titulo: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    productos: AnsoffProductDto[]
}

export class AnsoffProductDto {
    @ApiProperty()
    _id: string

    @ApiProperty()
    nombre: string

    @ApiProperty({ enum: SituacionDelMercado })
    situacionDelMercado: SituacionDelMercado

    @ApiProperty({ enum: SituacionDelProducto })
    situacionDelProducto: SituacionDelProducto

    @ApiProperty({ enum: Exito })
    exito: Exito

    @ApiProperty({ enum: Estrategia })
    estrategia: Estrategia
}
