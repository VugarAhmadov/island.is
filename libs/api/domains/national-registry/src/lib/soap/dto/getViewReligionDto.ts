export interface GetViewReligionDto {
  message: string
  table: Table
  success: boolean
}

export interface Table {
  schema: Schema
  diffgram: Diffgram
}

export interface Diffgram {
  DocumentElement: DocumentElement
}

export interface DocumentElement {
  KennitalaOgTrufelag: KennitalaOgTrufelag
}

export interface KennitalaOgTrufelag {
  attributes: KennitalaOgTrufelagAttributes
  Kennitala: string
  Nafn: string
  Kodi: string
  Trufelag: string
}

export interface KennitalaOgTrufelagAttributes {
  'diffgr:id': string
  'msdata:rowOrder': string
  'diffgr:hasChanges': string
}

export interface Schema {
  attributes: SchemaAttributes
  element: SchemaElement
}

export interface SchemaAttributes {
  id: string
}

export interface SchemaElement {
  attributes: PurpleAttributes
  complexType: PurpleComplexType
}

export interface PurpleAttributes {
  name: string
  'msdata:IsDataSet': string
  'msdata:MainDataTable': string
  'msdata:UseCurrentLocale': string
}

export interface PurpleComplexType {
  choice: Choice
}

export interface Choice {
  attributes: ChoiceAttributes
  element: ChoiceElement
}

export interface ChoiceAttributes {
  minOccurs: string
  maxOccurs: string
}

export interface ChoiceElement {
  attributes: FluffyAttributes
  complexType: FluffyComplexType
}

export interface FluffyAttributes {
  name: string
}

export interface FluffyComplexType {
  sequence: Sequence
}

export interface Sequence {
  element: ElementElement[]
}

export interface ElementElement {
  attributes: TentacledAttributes
}

export interface TentacledAttributes {
  name: string
  'msprop:ColumnId': string
  type: string
  minOccurs: string
}
