// declare var activeCard: string;
import { Parsed } from '@pathwaymd/pathway-ui2'

export type AirtableId = string
export type JSONString = string

export type AirtableRecord = {
  id: string
  fields: {
    name: string
    blocks: AirtableId[]
    calculator_id?: AirtableId
    finding_id?: AirtableId
    reference_id?: AirtableId
    dosage_id?: AirtableId
    disease_id?: AirtableId
    test_id?: AirtableId
    keypoint_id?: AirtableId
    pathway_id?: AirtableId
    presentation_id?: AirtableId
    specialty_id?: AirtableId
    handout_id?: AirtableId
    block_id?: AirtableId
    period_id?: AirtableId
  }
  createdTime: string
}

export type QualifierTypes = {
  id: string
  fields: {
    cluster: string
    disease: string
    name: string
    title: string
    title2: string
  }
  createdTime: string
}

export type Position = {
  x: number
  y: number
}

export type SelectTypes = {
  name: string
  id: string
}

export type BranchTypes = {
  id: string
  name: string
  type: string
}

export type BranchData = {
  system: string
  variable: string
  filter: string
  value: string
  units: string
  criteria_id: string
}

export type BranchProps = {
  id: number
  data: BranchData
}
export type FilterData = {
  condition: string
  system: string
  variable: string
  filter: string
  value: string
  units: string
  criteria_id: string
}

export type PeriodData = {
  condition: SelectTypes[]
  name: ExpressionTypes[]
  filter: SelectTypes[]
  value: string
}

export type FilterProps = {
  id: number
  data: FilterData
}

export type SystemTypes = {
  id: string
  name: string
}

export type FilterTypes = {
  id: string
  fields: {
    id: string
    name: string
    scale_types: string[]
    verb: string
    adverb: string
    filter_id: string
  }
  createdTime: string
}

export type ExpressionTypes = {
  base: string
  code: string
  component: string
  criteria: string[]
  expression_id: string
  id: string
  name: string
  scale_type: string
  system: string
  units: string
  blocks: string[]
}

export type CriteriaTypes = {
  id: string
  expression: string[]
  filter: string[]
  value: string
  criterion_id: string
  _expression_units: string
  blocks: string[]
  name: string
  _expression_name: string
  _filter_name: string
}

export type TableData = {
  id: string
  fields: {
    CLASS: string
    COMPONENT: string
    LOINC_NUM: string
    LONG_COMMON_NAME: string
    METHOD_TYP: string
    PROPERTY: string
    SCALE_TYP: string
    SYSTEM: string
    TIME_ASPCT: string
    EXAMPLE_UNITS: string
    DisplayName: string
  }
  createdTime: string
}

export type CardData = {
  id: number
  savedId: string
  name: string
  lefticon: string
  desc: string // description of left card
  templateTitle: string // which variable is related with the card and it is multi or single selection
  template: string // description of right card
  begin: string // begin words of action cards
  hasSelectInput: boolean // enable or selecting
  isMulti: boolean // toggle single or multi selecting
  hasTextInput: boolean // enable or unable text inputs
  selectedTitle: string // title of the custom cards
  selectedText: string // text of the custom cards
  selectedOptions: AirtableRecord[] // selected options for action cards
  selectedOptionSecond: AirtableRecord[] // selected second period options for schedule cards
  selectedQualifiers: QualifierTypes[] // selected options for record cards
  selectedContactMethods: ContactMethodData[] // selected options for record cards
  selectedReferences: AirtableRecord[] // selected References for all cards except for start, and end
  selectedKeypoints: AirtableRecord[] // selected Keypoints for all cards except for start, and end
  selectedBranchPoint: SystemTypes[] // selected branch point for the branch cards
  selectedBranchVariable: TableData[] // selected branch variable for the branch cards
  selectedBranches: BranchProps[] // added branches for the branch cards
  selectedFilters: FilterProps[] // added filters for the filter cards
  selectedPeriods: AirtableRecord[] //added periods for the Repeat Timer cards
  position: Position // position of the right cards
  parentId: number // parent's id
  parentSavedId: string // parent's savedId
  childrenIds: number[] // contains children's id
  childrenSavedIds: string[] // contains children's savedId
  childrenCnt: number // children's cnt
  isOpenProps: Boolean // the propwrap window is opened or closed
  isBranch: boolean // parent card is branch or not
  addedBranch: string // displayed on the branch's left-top data, e.g, =18, contains male, ...
  addedFilter: string // first child: Y, other child: N, for the filter card's children
}

export type BlockData = {
  id: string // added Block id
  fields: {
    protocol: AirtableId[]
    edges: AirtableId[]
    block_type: AirtableId[]
    block_type_mke?: AirtableId[]
    diseases: AirtableId[] // Action-Use
    diseases_mke?: AirtableId[] // Action-Use
    qualifiers: AirtableId[] // Action-Record
    qualifiers_mke?: AirtableId[]
    findings: AirtableId[] // Action-Elicit
    findings_mke?: AirtableId[] // Action-Use
    dosages: AirtableId[] // Action-Prescribe
    dosages_mke?: AirtableId[] // Action-Prescribe
    tests: AirtableId[] // Action-Order
    tests_mke?: AirtableId[] // Action-Order
    specialties: AirtableId[] // Action-Schedule
    specialties_mke?: AirtableId[] // Action-Schedule
    calculators: AirtableId[] // Action-Use
    calculators_mke?: AirtableId[] // Action-Use
    expressions: AirtableId[] // Filter, Branch
    keypoints: AirtableId[] //Action-Apply
    keypoints_mke?: AirtableId[] //Action-Apply
    presentations: AirtableId[] // Action-Differential
    presentations_mke?: AirtableId[] // Action-Differential
    pathways: AirtableId[] // Action-Link
    pathways_mke?: AirtableId[] // Action-Link
    references: AirtableId[] //Action-Custom
    references_mke?: AirtableId[] //Action-Custom
    periods: AirtableId[] // Trigger-Repeat timer
    periods_mke?: AirtableId[] // Trigger-Repeat timer
    handouts: AirtableId[] // Connect-Educate
    handouts_mke?: AirtableId[]
    branches: JSONString
    filters: JSONString
    custom: JSONString
    note: JSONString
    added_branch: string // parentCardType !== Branch ? 'N' : 'Y'
    contact_methods: AirtableId[] // Action-Record
  }
  createdTime: string
}

export type BlockTypes = {
  id: string
  fields: {
    id: string
    block_type_id: string
    type: string
    subtype: string
    name: string
    description: string
    block_template_intro: string
    block_template_body: string
    targetResource: string
    has_select_input: boolean
    has_text_input: boolean
    is_select_input_multi: boolean
    select_input_title: string
    text_input_title: string
    icon: string
    block_icon: string
    blocks: string[]
  }
  createdTime: string
}

export type ContactMethodData = {
  id: string
  fields: {
    id: string
    name: string
    description: string
    Blocks: AirtableId[]
  }
  createdTime: string
}

export type CardProps = {
  data: CardData
}

export type RightCardProps = {
  data: CardData
  isMoving: Boolean
  isSelected: Boolean
  updatedId: number
  onProp: Function
  onDeleteCard: Function
  onOver: Function
  onLeave: Function
  onMouseDown: Function
  onMouseMove: Function
  onMouseUp: Function
  onChangeProp: Function
}

export type LeftCardProps = {
  id: number
  lefticon: string
  name: string
  desc: string
  selectType: string
  targetResource?: string
}

export type ArrowData = {
  id: number
  parentId: number
  selfId: number
  line: string
  triangle: string
}

export type ArrowProps = {
  data: ArrowData
  isSelected: Boolean
}

export type GlobalWrapProps = {
  data: boolean
  title: string
  subTitle: string
}

export type CanvasProps = {
  isLeftTabOpen: Boolean
  isAddStart: Boolean
  blockTypes: BlockTypes[]
  selBundle: BundleType | undefined
  selProtocol: ProtocolType | undefined
  onChangeProp: Function
  onPropsView: Function
  onSaveCards: Function
  onSaveBlocks: Function
  onDeleteCard: Function
}

export type GlobalData = {
  properties: {
    bundle: BundleType
    protocol: ProtocolType
  }
  blocks: CardData[]
}

export type BundleType = {
  createdTime: string
  fields: {
    bundle_id: string
    name: string
    history: string[]
    protocols: string[]
    filters_inclusion: string
    filters_exclusion: string
    expressions_inclusion: string[]
    expressions_exclusion: string[]
  }
  id: string
}

export type ProtocolType = {
  createdTime: string
  fields: {
    name: string
    bundles: string[]
    id: string
  }
  id: string
}

export type PatientType = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: string
  pronouns: string
  phoneNumber: string
  email: string
  address: string
  city: string
} | null

export type UserType = {
  id: string
  name: string
  title: string
  licenseNumber: string
} | null

export type NoteType = {
  date: string
  title: string
  pdf: any
} | null

export type BundleHistoryType = {
  bundle: string[]
  bundleName: string
  status: string
  expires: boolean
  startedDate: string
  completedDate: string
  eligibleDate: string
  expiresDate: string
} | null

export type ExpressionData = {
  id: string
  fields: {
    name: string
    type: string
    units: string
    component: string
    expression_id: string
  }
}

type CriterionData = {
  id: string
  fields: {
    expression: string
    filter: string
    value: string
    criterion_id: string
  }
}

type TestData = {
  id: string
  fields: {
    name: string
    test_id: string
  }
}

type Criterion = {
  blockId: string
  key: string
  expressionId: string
  text: string
  operator: {
    id: string
    name: string
  }
  value: string
  units: string
  name: string
}

type Criteria = Criterion[]

type TargetData = {
  operator: string
  value: string
  units?: string
}

interface CriterionDetail {
  name: string
  operator: {
    id: string
    name: string
    symbol: string
  }
  value: string
  units?: string
}
