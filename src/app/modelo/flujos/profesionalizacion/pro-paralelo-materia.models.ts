export interface ProMateriaParaleloDto {
  codSemestreMateriaParalelo: number
  codSemestreMateria: number
  codParalelo: number
  nombreParalelo: string
  nombreMateria: string
  codProyecto: number,
  nombreProyecto: string

}

export interface ProMateriaParaleloCreateUpdateDto {
  codSemestreMateriaParalelo: number
  codSemestreMateria: number
  codParalelo: number,
  codProyecto: number

}

export const defaultParaleloMateria: ProMateriaParaleloDto = {
  codSemestreMateriaParalelo: 0,
  codSemestreMateria: 0,
  codParalelo: 0,
  nombreParalelo: '',
  nombreMateria: '',
  nombreProyecto: '',
  codProyecto: 0

}
