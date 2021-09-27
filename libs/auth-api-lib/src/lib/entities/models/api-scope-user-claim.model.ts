import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ApiScope } from './api-scope.model'

@Table({
  tableName: 'api_scope_user_claim',
})
export class ApiScopeUserClaim extends Model<ApiScopeUserClaim> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => ApiScope)
  @ApiProperty()
  apiScopeName!: string

  @BelongsTo(() => ApiScope)
  apiScope!: ApiScope

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  claimName!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
