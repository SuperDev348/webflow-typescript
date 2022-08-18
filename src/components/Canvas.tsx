import React, {
  DragEvent,
  MouseEvent,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { Box } from '@chakra-ui/react'
import { NotificationManager } from 'react-notifications';

import RightCard from './RightCard'
import Arrow from './Arrow'
import {
  BLOCK_TYPES,
  START_BLOCK_TYPE,
  Right_Card,
  Filter_System,
} from '../data'
import {
  ArrowData,
  CardData,
  Position,
  CanvasProps,
  BlockData,
  AirtableRecord,
  FilterProps,
} from '../types'
import { multiToTemplate, decapitalize } from '../service/string'
import siteConfig from '../config/site.config'
import {
  cardWidth,
  cardHeight,
  paddingX,
  paddingY,
  paddingLeft,
  paddingTop,
} from '../config/card.config'
import { useBuilder } from '../provider/builder'
import { apiGetToken } from '../api/index'
import { create as createBlock, update as updateBlock, remove as removeBlock } from '../api/block'
import { get as getQualifier } from '../api/qualifier'
import { get as getHandout } from '../api/handout'
import { get as getPeriod } from '../api/period'
import { get as getTest } from '../api/test'
import { get as getKeypoint } from '../api/keypoint'
import { get as getReference } from '../api/reference'
import { get as getFinding } from '../api/finding'
import { get as getPresentation } from '../api/presentation'
import { get as getPathway } from '../api/pathway'
import { get as getDosage } from '../api/dosage'
import { get as getDisease } from '../api/disease'
import { get as getSpecialty } from '../api/specialty'
import { get as getCalculator } from '../api/calculator'

const Canvas = (props: CanvasProps) => {
  let result: any[] = []
  const { builderState } = useBuilder()
  const { isAddStart, isLeftTabOpen, selProtocol, blockTypes } = props
  const [rootPosition, setRootPosition] = useState<Position>()
  const [hasFirstCard, setHasFirstCard] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isRealMoving, setIsRealMoving] = useState(false)
  const [isCanvasClicking, setIsCanvasClicking] = useState(false)
  const [moveFirstChild, setMoveFirstChild] = useState(false)
  const [cnt, setCnt] = useState(0)
  const [parentId, setParentId] = useState(-1)
  const [parentSavedId, setParentSavedId] = useState('')
  const [selectedId, setSelectedId] = useState(-1)
  const [selectedSavedId, setSelectedSavedId] = useState('')
  const [updatedId, setUpdatedId] = useState(-1)
  const [updatedSavedId, setUpdatedSavedId] = useState('')
  const [selectedCards, setSelectedCards] = useState<CardData[]>([])
  const [rightCards, setRightCards] = useState<CardData[]>([])
  const [selectedBlocks, setSelectedBlocks] = useState<BlockData[]>([])
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [arrows, setArrows] = useState<ArrowData[]>([])
  const [selectedArrows, setSelectedArrows] = useState<ArrowData[]>([])

  const formatParent = () => {
    setParentId(-1)
    setParentSavedId('')
  }
  const formatCanvasState = () => {
    setParentId(-1)
    setParentSavedId('')
    setSelectedId(-1)
    setSelectedSavedId('')
    setUpdatedId(-1)
    setUpdatedSavedId('')
  }
  const drawArrows = useCallback((elements: CardData[]): ArrowData[] => {
    const res = elements.map((element, index) => {
      const tempParent = elements.find(({ id }) => id === element.parentId)
      let line = ''
      let triangle = ''
      if (tempParent) {
        const parentPositionX = tempParent.position.x
        const parentPositionY = tempParent.position.y
        const selfPositionX = element?.position?.x
        line = `M${parentPositionX + 159} ${parentPositionY + 122} L${parentPositionX + 159
          } ${parentPositionY + 162} L${selfPositionX + 159} ${parentPositionY + 162
          } L${selfPositionX + 159} ${parentPositionY + 202}`
        triangle = `M${selfPositionX + 159} ${parentPositionY + 200} L${selfPositionX + 154
          } ${parentPositionY + 196} L${selfPositionX + 164} ${parentPositionY + 196
          } Z`
      }
      return {
        id: index,
        parentId: element.parentId,
        selfId: index,
        line: line,
        triangle: triangle,
      }
    })
    return res
  }, [])
  const setCardsData = useCallback(async (elementIndex: number, elements: any[]): Promise<any> => {
    if (rightCards.length > 0) {
      const tempRoot = rightCards.find(({ id }) => id === 1)
      if (tempRoot) {
        setRootPosition(tempRoot.position)
      }
    }
    const tempElement = elements.find(element => element.index === elementIndex)
    if (!tempElement)
      return
    const childrenSavedIds = tempElement.fields.edges
    const blockType = blockTypes.find(({ id }) => id === tempElement.fields.block_type[0])
    if (!blockType)
      return
    const tempCard: CardData = {
      id: elementIndex,
      savedId: tempElement.id,
      name: blockType.fields.subtype ? blockType.fields.subtype : '',
      lefticon: blockType.fields.block_icon
        ? `${siteConfig.baseUrl}/assets/${blockType.fields.block_icon}`
        : '',
      desc: blockType.fields.description ? blockType.fields.description : '',
      templateTitle: blockType.fields.select_input_title
        ? blockType.fields.select_input_title
        : '',
      template: blockType.fields.block_template_body
        ? blockType.fields.block_template_body
        : '',
      begin: blockType.fields.block_template_intro
        ? blockType.fields.block_template_intro
        : '',
      hasSelectInput: blockType.fields.has_select_input
        ? blockType.fields.has_select_input
        : false,
      isMulti: blockType.fields.is_select_input_multi
        ? blockType.fields.is_select_input_multi
        : false,
      hasTextInput: blockType.fields.has_text_input
        ? blockType.fields.has_text_input
        : false,
      selectedTitle: '',
      selectedText: '',
      selectedOptions: [],
      selectedOptionSecond: [],
      selectedQualifiers: [],
      selectedReferences: [],
      selectedContactMethods: [],
      selectedKeypoints: [],
      selectedBranchPoint: [],
      selectedBranchVariable: [],
      selectedBranches: [],
      selectedFilters: [],
      selectedPeriods: [],
      isBranch: tempElement.fields.added_branch === 'N' ? false : true,
      addedBranch: !(
        tempElement.fields.added_branch === 'Y' ||
        tempElement.fields.added_branch === 'N'
      )
        ? tempElement.fields.added_branch
        : '',
      addedFilter: '',
      position: {
        x: -1,
        y: -1,
      },
      parentId: 0,
      parentSavedId: '',
      childrenIds: [],
      childrenSavedIds: childrenSavedIds ? childrenSavedIds : [],
      childrenCnt: childrenSavedIds ? childrenSavedIds.length : 0,
      isOpenProps: false,
    }
    if (!(
      blockType.fields.block_type_id === BLOCK_TYPES.Structure.Start ||
      blockType.fields.block_type_id === BLOCK_TYPES.Structure.End
    )) {
      const tmpReferences = tempElement?.fields?.references
      if (tmpReferences)
        tempCard.selectedReferences = builderState.references.filter(({ id }) => tmpReferences.includes(id))
      const tmpKeypoints = tempElement?.fields?.keypoints
      if (tmpKeypoints)
        tempCard.selectedKeypoints = builderState.keypoints.filter(({ id }) => tmpKeypoints.includes(id))
    }
    let tempOptions: AirtableRecord[] = []
    let tempIds: string[] = []
    switch (blockType.fields.block_type_id) {
      case BLOCK_TYPES.Connect.Educate:
        tempIds = tempElement?.fields?.handouts
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getHandout(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("handouts", tempOptions)
        }
        break
      case BLOCK_TYPES.Trigger.RepeatTimer:
        tempIds = tempElement?.fields?.periods
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getPeriod(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("periods", tempOptions)
        }
        break
      case BLOCK_TYPES.Trigger.Await:
        tempIds = tempElement?.fields?.tests
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getTest(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("tests", tempOptions)
        }
        break
      case BLOCK_TYPES.Structure.Branch:
        if (tempElement.fields.expressions) {
          const tempExpression = builderState.expressions.find(
            ({ id }) => id === tempElement.fields.expressions[0],
          )
          if (tempExpression) {
            const tempSystem = Filter_System.find(
              system => system.name === tempExpression.system,
            )
            if (tempSystem) {
              tempCard.selectedBranchPoint = [tempSystem]
              let tableURL = tempExpression.system
              let formulaText = `?filterByFormula=${encodeURIComponent(
                `FIND('${tempExpression.component}',{COMPONENT})`,
              )}`
              apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.ioincId}/${tableURL}${formulaText}`)
                .then((res: any) => {
                  tempCard.selectedBranchVariable = [res.records[0]]
                })
                .catch((err: any) => {
                  console.log(err)
                })
            }
            tempCard.template = `${tempExpression.system === 'Calculators' ? tempExpression.component : decapitalize(tempExpression.component)}`
          }
        }
        if (tempElement.fields.branches) {
          tempIds = JSON.parse(tempElement.fields.branches)
          let tempBranches = []
          if (tempIds) {
            tempBranches = builderState.criterias.filter(({ id }) => tempIds.includes(id))
          }
          tempBranches = tempBranches.map((item) => {
            return {
              system: item._expression_name[0].split('/')[1],
              variable: item._expression_name[0].split('/')[2],
              filter: item._filter_name[0],
              value: item.value,
              units: item._expression_units,
              criteria_id: item.criterion_id,
            }
          })
          const tempSelectedBranches = tempBranches.map((item, index) => {
            return {
              id: index + 1,
              data: item
            }
          })
          tempCard.begin = 'If '
          tempCard.selectedBranches = tempSelectedBranches
        }
        break
      case BLOCK_TYPES.Structure.Filter:
        if (tempElement.fields.filters) {
          let tempData = JSON.parse(tempElement.fields.filters)
          let tempFilters = []
          for (let i = 0; i < tempData[0].operands.length; i++) {
            let tempCriteria = builderState.criterias.find(
              ({ id }) => id === tempData[0].operands[i],
            )
            if (tempCriteria) {
              tempFilters.push({
                condition: i === 0 ? 'Where' : 'and',
                system: tempCriteria._expression_name[0].split('/')[1],
                variable: tempCriteria._expression_name[0].split('/')[2],
                filter: tempCriteria._filter_name[0],
                value: tempCriteria.value,
                units: tempCriteria._expression_units,
                criteria_id: tempCriteria.criterion_id,
              })
            }
          }
          for (let i = 0; i < tempData[1].operands.length; i++) {
            let tempCriteria = builderState.criterias.find(
              ({ id }) => id === tempData[1].operands[i],
            )
            if (tempCriteria) {
              tempFilters.push({
                condition: 'or',
                system: tempCriteria._expression_name[0].split('/')[1],
                variable: tempCriteria._expression_name[0].split('/')[2],
                filter: tempCriteria._filter_name[0],
                value: tempCriteria.value,
                units: tempCriteria._expression_units,
                criteria_id: tempCriteria.criterion_id,
              })
            }
          }
          let tempSelectedFilters: FilterProps[] = []
          let tempTemplate: string = ''
          for (let i = 0; i < tempFilters.length; i++) {
            if (i === 0)
              tempTemplate += `${tempFilters[i]?.system === 'Calculators' ?
                tempFilters[i]?.variable : decapitalize(tempFilters[i]?.variable)} ${decapitalize(tempFilters[i]?.filter)} ${decapitalize(
                  tempFilters[i]?.value,
                )} ${tempFilters[i].units ? tempFilters[i].units : ''}`
            else
              tempTemplate += `, ${decapitalize(
                tempFilters[i]?.condition,
              )} ${decapitalize(
                tempFilters[i]?.system,
              )} \u2192 ${decapitalize(
                tempFilters[i]?.variable,
              )} ${decapitalize(tempFilters[i]?.filter)} ${decapitalize(
                tempFilters[i]?.value,
              )} ${tempFilters[i].units ? tempFilters[i].units : ''}`
            tempSelectedFilters.push({
              id: i + 1,
              data: {
                condition: tempFilters[i].condition,
                system: tempFilters[i].system,
                variable: tempFilters[i].variable,
                filter: tempFilters[i].filter,
                value: tempFilters[i].value,
                units: tempFilters[i].units ? tempFilters[i].units : '',
                criteria_id: tempFilters[i].criteria_id,
              },
            })
          }
          tempCard.selectedFilters = tempSelectedFilters
          tempCard.template = tempTemplate
        }
        break
      case BLOCK_TYPES.Action.Apply:
        tempIds = tempElement?.fields?.diseases
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getKeypoint(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("diseases", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Custom:
        tempIds = tempElement?.fields?.references
        let title = ""
        if (tempElement?.fields?.custom) {
          const custom = JSON.parse(tempElement?.fields?.custom)
          title = custom.title
        }
        tempCard.template = title
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getReference(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
        }
        const tempSelectedData = JSON.parse(tempElement.fields.custom || '{}')
        tempCard.selectedTitle = tempSelectedData.title
        tempCard.selectedText = tempSelectedData.text
        break
      case BLOCK_TYPES.Action.Elicit:
        tempIds = tempElement?.fields?.findings
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getFinding(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("findings", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Differential:
        tempIds = tempElement?.fields?.presentations
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getPresentation(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("presentations", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Link:
        tempIds = tempElement?.fields?.pathways
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getPathway(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("pathways", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Note:
        const tempNote = JSON.parse(tempElement.fields.note || '{}')
        tempCard.selectedTitle = tempNote.title
        tempCard.selectedText = tempNote.text
        tempCard.template = tempNote.title
        break
      case BLOCK_TYPES.Action.Order:
        tempIds = tempElement?.fields?.tests
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getTest(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("tests", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Prescribe:
        tempIds = tempElement?.fields?.dosages
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getDosage(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("dosages", tempOptions)
        }
        break
      case BLOCK_TYPES.Action.Record:
        tempIds = tempElement?.fields?.diseases
        let template = ""
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getDisease(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          template = multiToTemplate("diseases", tempOptions)
        }
        tempIds = tempElement?.fields?.qualifiers
        if (tempIds) {
          const tempSelectedQualifiers = await Promise.all(tempIds.map(async (id) => {
            const res = await getQualifier(id)
            return res
          }))
          tempCard.selectedQualifiers = tempSelectedQualifiers
          template = template + " - " + multiToTemplate("qualifers", tempSelectedQualifiers)
        }
        tempCard.template = template
        break
      case BLOCK_TYPES.Action.Schedule:
        tempIds = tempElement?.fields?.specialties
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getSpecialty(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("specialties", tempOptions)
        }
        tempIds = tempElement?.fields?.periods
        if (tempIds) {
          const tempSelectedOptionSecond = await Promise.all(tempIds.map(async (id) => {
            const res = await getPeriod(id)
            return res
          }))
          tempCard.selectedOptionSecond = tempSelectedOptionSecond
        }
        break
      case BLOCK_TYPES.Action.Use:
        tempIds = tempElement?.fields?.calculators
        if (tempIds) {
          tempOptions = await Promise.all(tempIds.map(async (id) => {
            const res = await getCalculator(id)
            return res
          }))
          tempCard.selectedOptions = tempOptions
          tempCard.template = multiToTemplate("calculators", tempOptions)
        }
        break
      case BLOCK_TYPES.Connect.Contact:
        tempIds = tempElement?.fields?.contact_methods
        if (tempIds) {
          const tempSelectedContactMethods = builderState.contact_methods.filter(({ id }) => tempIds.includes(id))
          tempCard.selectedContactMethods = tempSelectedContactMethods
          tempCard.template = multiToTemplate("calculators", tempSelectedContactMethods)
        }
        break
    }

    const tempParent = elements.find(element =>
      element.fields.edges?.includes(tempElement.id),
    )
    if (tempParent) {
      tempCard.parentId = tempParent.index
      tempCard.parentSavedId = tempParent.id
      if (
        tempParent.fields.block_type_mke?.includes(
          BLOCK_TYPES.Structure.Filter,
        )
      ) {
        let childIndex = tempParent.fields.edges.indexOf(tempCard.savedId)
        if (childIndex === 0) {
          tempCard.addedFilter = 'Yes'
        } else {
          tempCard.addedFilter = 'No'
        }
      }
    } else if (
      blockType.fields.block_type_id !== BLOCK_TYPES.Structure.Start
    ) {
      return
    }

    for (let i = 0; i < tempCard.childrenSavedIds.length; i++) {
      const tempChild = elements.find(
        element => element.id === tempCard.childrenSavedIds[i],
      )
      if (!tempChild) return
      tempCard.childrenIds.push(tempChild.index)
      if (result.find(temp => temp.id === tempChild.index))
        return
      const res = await setCardsData(tempChild.index, elements)
      result.concat(res)
    }
    result.push(tempCard)
  },
    [
      blockTypes,
      builderState,
      props,
    ])
  const getElementWidth = useCallback(
    (elementId: number, elements: CardData[]): number => {
      const tempCard = elements.find(({ id }) => id === elementId)
      if (!tempCard) return 0
      const childrenIds = tempCard.childrenIds
      if (!childrenIds || childrenIds.length === 0) return 1
      let childWidth = 0
      for (let i = 0; i < childrenIds.length; i++) {
        const child = childrenIds[i]
        childWidth += getElementWidth(child, elements)
      }
      if (childWidth > 0) return childWidth
      else return 1
    },
    [],
  )
  const addPositionToChildren = useCallback(
    (elementId: number, parentPosition: Position, newCards: CardData[]) => {
      const element = newCards.find(({ id }) => elementId === id)
      if (!element) return
      const children = element.childrenIds
      if (!children || children.length === 0) return
      const width = getElementWidth(elementId, newCards)
      let tmp = 0
      for (let i = 0; i < children.length; i++) {
        const childId = children[i]
        const childLen = getElementWidth(childId, newCards)
        const offset = tmp + (childLen * 338) / 2
        tmp += childLen * 338
        const child = newCards.find(({ id }) => id === childId)
        if (child) {
          const { position } = child
          position.x = parentPosition.x - (width * 338) / 2 + offset
          position.y = parentPosition.y + 200
          addPositionToChildren(childId, position, newCards)
        }
      }
    },
    [getElementWidth],
  )
  const rearrange = useCallback(
    rightCards => {
      const newCards = [...rightCards]
      const rootElement = newCards.find(({ id }) => id === 1)
      if (rootElement) {
        if (rootElement.position.x === -1 && rootElement.position.y === -1) {
          if (rootPosition) {
            rootElement.position = rootPosition
          } else {
            rootElement.position.x = 380
            rootElement.position.y = 30
            setRootPosition({ x: 380, y: 30 })
          }
        }
        // const width = getElementWidth(1, newCards)
        // const offset = ((paddingX + cardWidth) * (width - 1)) / 2
        // if (offset > rootElement.position.x) {
        //   rootElement.position.x = offset
        //   rootElement.position.y = paddingY
        //   setRootPosition({ x: offset, y: paddingY })
        // }
        addPositionToChildren(1, rootElement.position, newCards)
      }
      return newCards
    },
    [getElementWidth, addPositionToChildren, rootPosition],
  )
  const reconstruct = async tempBlocks => {
    const rootElement = tempBlocks.find(
      (tempBlock: any) => tempBlock?.index === 1,
    )
    if (rootElement) {
      if (rightCards.length > 0) {
        const tempRoot = rightCards.find(({ id }) => id === 1)
        if (tempRoot) {
          setRootPosition(tempRoot.position)
        }
      }
      await setCardsData(1, tempBlocks)
      if (result.length > 0) {
        setHasFirstCard(true)
        setCnt(result.length + 1)
        const _newCards = rearrange(result) 
        setRightCards(_newCards)
        // props.onSaveCards(rearrange(result))
        setArrows(drawArrows(_newCards))
      }
      result = []
    }
  }
  const updateParent = (idToUpdate: number, savedIdToUpdate: string) => {
    setParentId(idToUpdate)
    setParentSavedId(savedIdToUpdate)
  }
  const viewProps = (id: number) => {
    const newCards = [...rightCards]
    const tempCards = newCards.filter(newCard => newCard.id !== id)
    if (tempCards) {
      for (let i = 0; i < tempCards.length; i++) {
        if (tempCards[i].isOpenProps) {
          tempCards[i].isOpenProps = false
        }
      }
    }
    const tempCard = newCards.find(newCard => newCard.id === id)
    if (tempCard) {
      tempCard.isOpenProps = !tempCard.isOpenProps
    }
    setRightCards(newCards)
    props.onPropsView(newCards, id)
  }
  const deleteCard = (id: number, savedId: string) => {
    if (id > 0) {
      const newCards = [...rightCards]
      const newBlocks = [...blocks]
      const tempSelectedIds = getElements(id, newCards)
      const tempSelectedBlockIds = getBlockIds(savedId, newBlocks)
      const tempSelCard = newCards.find(newCard => newCard.id === id)
      if (tempSelCard) {
        const tempParentCard = newCards.find(
          ({ id }) => id === tempSelCard.parentId,
        )
        const tempParentBlock = newBlocks.find(
          ({ id }) => id === tempSelCard.parentSavedId,
        )
        if (tempParentCard) {
          tempParentCard.childrenIds = tempParentCard.childrenIds.filter(
            b => b !== id,
          )
          tempParentCard.childrenCnt--
        }
        if (tempParentBlock) {
          tempParentBlock.fields.edges = tempParentBlock.fields.edges.filter(
            b => b !== savedId,
          )
        }
        const nonSelectedCards = rearrange(
          newCards.filter(({ id }) => !tempSelectedIds.includes(id)),
        )
        const nonSelectedBlocks = newBlocks.filter(
          ({ id }) => !tempSelectedBlockIds.includes(id),
        )
        const selectedBlocks = newBlocks.filter(({ id }) =>
          tempSelectedBlockIds.includes(id),
        )
        const newArrows = drawArrows(nonSelectedCards)
        if (tempSelCard.isOpenProps) {
          tempSelCard.isOpenProps = false
          props.onPropsView(nonSelectedCards, id)
        }
        setSelectedCards([])
        setSelectedArrows([])
        setSelectedBlocks([])
        setIsMoving(false)
        setRightCards(nonSelectedCards)
        setBlocks(nonSelectedBlocks)
        setArrows(newArrows)
        if (id === 1) {
          setHasFirstCard(false)
          setCnt(0)
        }
        setSelectedId(-1)
        setSelectedSavedId('')
        deleteBlocks(selectedBlocks)
        props.onDeleteCard(nonSelectedCards)
      }
    }
  }
  const getElements = useCallback(
    (elementId: number, elements: CardData[]): number[] => {
      const tempCard = elements.find(({ id }) => id === elementId)
      const childrenIds = tempCard?.childrenIds
      if (!childrenIds || childrenIds?.length === 0) {
        return [elementId]
      }
      let result: number[] = []
      for (let i = 0; i < childrenIds.length; i++) {
        const child = childrenIds[i]
        const childElements = getElements(child, elements)
        if (result.find(temp => temp === elementId))
          result = [...result, ...childElements]
        else result = [...result, elementId, ...childElements]
      }
      if (result.length > 0) return result
      else return []
    },
    [],
  )
  const getBlockIds = useCallback(
    (elementId: string, elements: BlockData[]): string[] => {
      const tempBlock = elements.find(({ id }) => id === elementId)
      if (tempBlock) {
        const edgeIds = tempBlock.fields.edges
        if (!edgeIds || edgeIds.length === 0) {
          return [elementId]
        }
        let result: string[] = []
        for (let i = 0; i < edgeIds.length; i++) {
          const child = edgeIds[i]
          const childElements = getBlockIds(child, elements)
          if (result.find(temp => temp === elementId))
            result = [...result, ...childElements]
          else result = [...result, elementId, ...childElements]
        }
        if (result.length > 0) return result
        else return []
      } else return []
    },
    [],
  )
  const updateBranchBlock = async (element: BlockData) => {
    await updateBlock({
      records: [{
        id: element.id,
        fields: {
          added_branch: element.fields.added_branch,
        }
      }]
    })
  }
  const deleteBlocks = async (blocksData: BlockData[]) => {
    await Promise.all(blocksData.map(async (block) => {
      await removeBlock(block.id)
    }))
  }
  const saveBlockAndCard = async (card: CardData, block: BlockData) => {
    const res = await createBlock({ records: [{ fields: block.fields }] })
    card.savedId = res.records[0].id
    setArrows(drawArrows([...rightCards, card]))
    if (!hasFirstCard) {
      setCnt(2)
      props.onSaveCards([card])
      props.onSaveBlocks([], res.records[0])
    } else {
      setCnt(cnt + 1)
      const newCards = [...rightCards]
      const updateCard = newCards.find(({ id }) => id === parentId)
      if (updateCard) {
        updateCard.childrenSavedIds.push(res.records[0].id)
      }
      props.onSaveCards([...newCards, card])
      const newBlocks = [...blocks]
      const tmpBlock = newBlocks.find(({ id }) => id === parentSavedId)
      if (tmpBlock) {
        if (!tmpBlock.fields.edges) {
          tmpBlock.fields = { ...tmpBlock.fields, edges: [] }
        }
        if (!tmpBlock.fields.edges.includes(res.records[0].id))
          tmpBlock.fields.edges.push(res.records[0].id)
        await updateBlock({
          records: [{
            id: tmpBlock.id,
            fields: {
              edges: tmpBlock.fields.edges
            }
          }]
        })
        props.onSaveBlocks(newBlocks, res.records[0])
      }
    }
  }
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const { pageX, pageY, dataTransfer } = event
      const activeCard = dataTransfer.getData('activeCard')
      const activeBranch = dataTransfer.getData('activeBranch')
      if (activeCard) {
        const activeData = JSON.parse(activeCard)
        // type END
        // if (Right_Card[activeData.id - 1].id === 'reclGPhiwyIhGMuO6') {
        //   setRootPosition({ x: 380, y: paddingY })
        // }
        if (!hasFirstCard) {
          if (Right_Card[activeData.id - 1].id !== START_BLOCK_TYPE)
            return
          if (!isAddStart) {
            NotificationManager.warning('warning', 'Please open or create a new protocol to start adding blocks.', 3000);
            return
          }
          setHasFirstCard(true)
          const cardData: CardData = {
            id: 1,
            savedId: '',
            name: Right_Card[activeData.id - 1].name,
            lefticon: Right_Card[activeData.id - 1].lefticon,
            desc: Right_Card[activeData.id - 1].desc,
            templateTitle: Right_Card[activeData.id - 1].templateTitle,
            template: Right_Card[activeData.id - 1].template,
            begin: Right_Card[activeData.id - 1].begin,
            hasSelectInput: Right_Card[activeData.id - 1].hasSelectInput,
            isMulti: Right_Card[activeData.id - 1].isMulti,
            hasTextInput: Right_Card[activeData.id - 1].hasTextInput,
            selectedTitle: '',
            selectedText: '',
            selectedOptions: [],
            selectedOptionSecond: [],
            selectedQualifiers: [],
            selectedReferences: [],
            selectedContactMethods: [],
            selectedKeypoints: [],
            selectedBranchPoint: [],
            selectedBranchVariable: [],
            selectedBranches: [],
            selectedFilters: [],
            selectedPeriods: [],
            isBranch: false,
            addedBranch: '',
            addedFilter: '',
            position: {
              x: pageX - 450,
              y: pageY - 135,
            },
            parentId: 0,
            parentSavedId: '',
            childrenIds: [],
            childrenSavedIds: [],
            childrenCnt: 0,
            isOpenProps: false,
          }
          const blockData: BlockData = {
            id: '',
            fields: {
              // bundle_name: selBundle ? selBundle.fields.name : '',
              block_type: [Right_Card[activeData.id - 1].id],
              diseases: [],
              qualifiers: [],
              findings: [],
              dosages: [],
              specialties: [],
              tests: [],
              // _text_template: Right_Card[activeData.id-1].template,
              // output_value: '',
              // criteria: '',
              calculators: [],
              keypoints: [],
              pathways: [],
              expressions: [],
              presentations: [],
              // recommendation_match: '',
              // output_name: '',
              // condition: '',
              references: [],
              periods: [],
              handouts: [],
              branches: '',
              filters: '',
              custom: '',
              note: '',
              added_branch: 'N',
              edges: [],
              protocol: selProtocol ? [selProtocol.id] : [],
              contact_methods: [],
            },
            createdTime: '',
          }
          saveBlockAndCard(cardData, blockData)
          formatCanvasState()
        } else if (parentId > 0 && parentSavedId !== '') {
          const newChilds = [...rightCards]
          const childToUpdate = newChilds.find(({ id }) => id === parentId)
          if (childToUpdate) {
            const childrenCount = childToUpdate.childrenCnt
            if (
              childToUpdate.name !== 'Filter' &&
              childToUpdate.name !== 'Branch'
            ) {
              if (childrenCount > 0) return
            }
            for (let i = 0; i < childrenCount; i++) {
              const childs = newChilds.find(
                ({ id }) => id === childToUpdate.childrenIds[i],
              )
              if (childs) {
                childs.position.x -= 169
              }
            }
            childToUpdate.childrenCnt++
            childToUpdate.childrenIds.push(cnt)
            setRightCards(newChilds)
            const cardData: CardData = {
              id: cnt,
              savedId: '',
              name: Right_Card[activeData.id - 1].name,
              lefticon: Right_Card[activeData.id - 1].lefticon,
              desc: Right_Card[activeData.id - 1].desc,
              templateTitle: Right_Card[activeData.id - 1].templateTitle,
              template: Right_Card[activeData.id - 1].template,
              begin: Right_Card[activeData.id - 1].begin,
              hasSelectInput: Right_Card[activeData.id - 1].hasSelectInput,
              isMulti: Right_Card[activeData.id - 1].isMulti,
              hasTextInput: Right_Card[activeData.id - 1].hasTextInput,
              selectedTitle: '',
              selectedText: '',
              selectedOptions: [],
              selectedOptionSecond: [],
              selectedQualifiers: [],
              selectedReferences: [],
              selectedContactMethods: [],
              selectedKeypoints: [],
              selectedBranchPoint: [],
              selectedBranchVariable: [],
              selectedBranches: [],
              selectedFilters: [],
              selectedPeriods: [],
              isBranch: childToUpdate.name === 'Branch' ? true : false,
              addedBranch: '',
              addedFilter: '',
              position: {
                x: childToUpdate.position.x + 169 * childrenCount,
                y: childToUpdate.position.y + 200,
              },
              parentId: parentId,
              parentSavedId: parentSavedId,
              childrenIds: [],
              childrenSavedIds: [],
              childrenCnt: 0,
              isOpenProps: false,
            }
            const blockData: BlockData = {
              id: '',
              fields: {
                // bundle_name: selBundle ? selBundle.fields.name : '',
                block_type: [Right_Card[activeData.id - 1].id],
                diseases: [],
                qualifiers: [],
                findings: [],
                dosages: [],
                tests: [],
                specialties: [],
                // _text_template: Right_Card[activeData.id-1].template,
                // output_value: '',
                // criteria: '',
                expressions: [],
                calculators: [],
                keypoints: [],
                pathways: [],
                presentations: [],
                // recommendation_match: '',
                // output_name: '',
                // condition: '',
                references: [],
                periods: [],
                handouts: [],
                branches: '',
                filters: '',
                custom: '',
                note: '',
                added_branch: childToUpdate.name === 'Branch' ? 'Y' : 'N',
                edges: [],
                protocol: selProtocol ? [selProtocol.id] : [],
                contact_methods: [],
              },
              createdTime: '',
            }
            setCnt(cnt + 1)
            saveBlockAndCard(cardData, blockData)
            formatCanvasState()
          }
        }
      } else if (activeBranch) {
        const activeBranchData = JSON.parse(activeBranch)
        if (hasFirstCard && parentId > 0) {
          const newChilds = [...rightCards]
          const childToUpdate = newChilds.find(({ id }) => id === parentId)
          if (childToUpdate) {
            if (childToUpdate.isBranch === true) {
              let tempBranch = activeBranchData.data.filter.replace('...', '')
              if (activeBranchData?.data?.value) {
                tempBranch += ' ' + activeBranchData?.data?.value
              }
              if (activeBranchData?.data?.units) {
                tempBranch += ' ' + activeBranchData?.data?.units
              }
              childToUpdate.addedBranch = tempBranch
              const newBlocks = [...blocks]
              const blockToUpdate = newBlocks.find(
                ({ id }) => id === childToUpdate.savedId,
              )
              if (blockToUpdate) {
                blockToUpdate.fields.added_branch = tempBranch
                updateBranchBlock(blockToUpdate)
              }
              formatCanvasState()
            }
          }
        }
      } else {
        formatCanvasState()
      }
    },
    [cnt, selProtocol, hasFirstCard, parentId, parentSavedId, rightCards],
  )
  const handleMouseDown = (selId: number, selSavedId: string) => {
    if (selId > -1 && selSavedId !== '') {
      setIsMoving(true)
      setSelectedId(selId)
      setSelectedSavedId(selSavedId)

      if (selId === 1) setMoveFirstChild(true)
      else setMoveFirstChild(false)
    }
  }
  const handleMouseMove = useCallback(
    (
      movementX: number,
      movementY: number,
      pageX: number,
      pageY: number,
      ratio: number,
      updateId: number,
      updateSavedId: string,
    ) => {
      if (isMoving) {
        if (moveFirstChild) {
          const newChilds = [...rightCards]

          for (let i = 0; i < newChilds.length; i++) {
            const { position } = newChilds[i]
            position.x += movementX / ratio
            position.y += movementY / ratio
            if (newChilds[i].id === 1) {
              setRootPosition(position)
            }
          }
          setRightCards(newChilds)
          setArrows(drawArrows(newChilds))
        } else {
          if (isRealMoving) {
            if (pageX < paddingLeft + 5 || pageY < paddingTop + 5) {
              setIsMoving(false)
              const newCards: CardData[] = []
              const newArrows: ArrowData[] = []
              setSelectedCards(newCards)
              setSelectedArrows(newArrows)
              setIsRealMoving(false)
              return
            }
            const newCards = [...selectedCards]
            const selectedCard = newCards.find(({ id }) => id === updateId)
            const nonSelected = [...rightCards]

            for (let i = 0; i < nonSelected.length; i++) {
              if (
                nonSelected[i].position.x + paddingLeft < pageX &&
                pageX < nonSelected[i].position.x + paddingLeft + 318 &&
                nonSelected[i].position.y + paddingTop < pageY &&
                pageY < nonSelected[i].position.y + paddingTop + 122
              ) {
                setUpdatedId(nonSelected[i].id)
                setUpdatedSavedId(nonSelected[i].savedId)
                break
              } else {
                setUpdatedId(-1)
                setUpdatedSavedId('')
              }
            }
            if (selectedCard && selectedCards.length) {
              for (let i = 0; i < newCards.length; i++) {
                const { position } = newCards[i]
                position.x += movementX / ratio
                position.y += movementY / ratio
              }

              const newSelectedArrows = drawArrows(newCards)
              setRightCards(nonSelected)
              setSelectedCards(newCards)
              setSelectedArrows(newSelectedArrows)
              setSelectedId(updateId)
              setSelectedSavedId(updateSavedId)
            }
          } else {
            const newCards = [...rightCards]
            const newBlocks = [...blocks]
            const tempSelectedIds = getElements(selectedId, newCards)
            const tempSelectedBlockIds = getBlockIds(selectedSavedId, newBlocks)
            const tempSelCard = newCards.find(({ id }) => id === selectedId)
            if (tempSelCard) {
              const tempParentCard = newCards.find(
                ({ id }) => id === tempSelCard.parentId,
              )
              if (tempParentCard) {
                tempParentCard.childrenIds = tempParentCard.childrenIds.filter(
                  b => b !== selectedId,
                )
                tempParentCard.childrenCnt--

                const newBlocks = [...blocks]
                const tempSelBlock = newBlocks.find(
                  ({ id }) => id === selectedSavedId,
                )
                if (tempSelBlock) {
                  const tempParentBlock = newBlocks.find(
                    ({ id }) => id === tempSelCard.parentSavedId,
                  )
                  if (tempParentBlock) {
                    tempParentBlock.fields.edges =
                      tempParentBlock.fields.edges.filter(
                        b => b !== selectedSavedId,
                      )
                  }
                }
              }
            }
            const nonSelectedCards = rearrange(
              newCards.filter(({ id }) => !tempSelectedIds.includes(id)),
            )
            const nonSelectedBlocks = newBlocks.filter(
              ({ id }) => !tempSelectedBlockIds.includes(id),
            )
            const newArrows = drawArrows(nonSelectedCards)
            const newSelectedCards = rearrange(
              newCards.filter(({ id }) => tempSelectedIds.includes(id)),
            )
            const newSelectedBlocks = newBlocks.filter(({ id }) =>
              tempSelectedBlockIds.includes(id),
            )
            const newSelectedArrows = drawArrows(newSelectedCards)
            setSelectedCards(newSelectedCards)
            setSelectedBlocks(newSelectedBlocks)
            setSelectedArrows(newSelectedArrows)
            setSelectedId(selectedId)
            setSelectedSavedId(selectedSavedId)
            setIsMoving(true)
            setRightCards(nonSelectedCards)
            setBlocks(nonSelectedBlocks)
            setArrows(newArrows)
            setIsRealMoving(true)
          }
        }
      }
    },
    [
      isMoving,
      isRealMoving,
      moveFirstChild,
      rightCards,
      blocks,
      selectedCards,
      selectedId,
      selectedSavedId,
      rearrange,
      drawArrows,
      getElements,
      getBlockIds,
    ],
  )
  const handleMouseUp = useCallback(() => {
    if (moveFirstChild) {
      setMoveFirstChild(false)
      setSelectedId(-1)
      setSelectedSavedId('')
    } else {
      if (isMoving) setIsMoving(false)
      else return
      if (isRealMoving) {
        if (selectedId > -1) {
          if (updatedId === -1 && updatedSavedId === '') {
            setSelectedCards([])
            setSelectedArrows([])
            deleteBlocks(selectedBlocks)
          } else {
            const newCards = [...rightCards]
            const updateCard = newCards.find(({ id }) => id === updatedId)
            if (updateCard) {
              updateCard.childrenIds.push(selectedId)
              updateCard.childrenSavedIds.push(selectedSavedId)
              updateCard.childrenCnt++
              const tempSelectedCards = [...selectedCards]
              const tempSelectedCard = tempSelectedCards.find(
                ({ id }) => id === selectedId,
              )
              if (tempSelectedCard) {
                tempSelectedCard.parentId = updatedId
              }
              let tempCards = newCards.concat(tempSelectedCards)
              tempCards = rearrange([...tempCards])
              setRightCards(tempCards)
              const tempArrows = drawArrows(tempCards)
              setArrows(tempArrows)
              setSelectedArrows([])
              const tempNonSelectedBlocks = [...blocks]
              const tempUpdateBlock = tempNonSelectedBlocks.find(
                ({ id }) => id === updatedSavedId,
              )
              if (tempUpdateBlock) {
                tempUpdateBlock.fields.edges.push(selectedSavedId)
              }
              const tempBlocks = tempNonSelectedBlocks.concat(selectedBlocks)
              setBlocks(tempBlocks)
            }
          }
        }
        formatCanvasState()
        setIsRealMoving(false)
      }
    }
  }, [
    rightCards,
    blocks,
    selectedId,
    selectedSavedId,
    selectedCards,
    selectedBlocks,
    updatedId,
    updatedSavedId,
    isMoving,
    isRealMoving,
    moveFirstChild,
    drawArrows,
    rearrange,
  ])
  const handleDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      let isCardClick: boolean = false
      if (rightCards) {
        for (let i = 0; i < rightCards.length; i++) {
          if (
            rightCards[i].position.x < event.pageX - paddingLeft &&
            event.pageX - paddingLeft < rightCards[i].position.x + cardWidth &&
            rightCards[i].position.y < event.pageY - paddingTop &&
            event.pageY - paddingTop < rightCards[i].position.y + cardHeight
          ) {
            isCardClick = true
            break
          }
        }
        if (isCardClick) setIsCanvasClicking(false)
        else setIsCanvasClicking(true)
      }
    },
    [rightCards],
  )
  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isCanvasClicking) {
        if (rightCards) {
          const newChilds = [...rightCards]
          const ratioX = event.screenX / event.pageX
          const ratioY = event.screenY / event.pageY
          const ratio = ratioX < ratioY ? ratioX : ratioY
          for (let i = 0; i < newChilds.length; i++) {
            const { position } = newChilds[i]
            position.x += event.movementX / ratio
            position.y += event.movementY / ratio

            if (newChilds[i].id === 1) {
              setRootPosition(position)
            }
          }
          setRightCards(newChilds)
          setArrows(drawArrows(newChilds))
        }
      }
    },
    [isCanvasClicking, rightCards, drawArrows],
  )
  const handleUp = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isCanvasClicking) {
        const tempRoot = rightCards.find(({ id }) => id === 1)
        if (tempRoot) {
          setRootPosition(tempRoot.position)
        }
        setIsCanvasClicking(false)
      }
    },
    [isCanvasClicking],
  )

  useEffect(() => {
    if (blockTypes.length !== 0) {
      result = []
      let tempRootBlock: any = builderState.blocks.find(block =>
        block.fields?.block_type_mke?.includes(BLOCK_TYPES.Structure.Start),
      )
      if (tempRootBlock) {
        tempRootBlock = {
          ...tempRootBlock,
          index: 1,
        }
      }
      let tempOtherBlocks: any[] = builderState.blocks.filter(
        block =>
          !block.fields?.block_type_mke?.includes(BLOCK_TYPES.Structure.Start),
      )
      if (tempOtherBlocks) {
        tempOtherBlocks = tempOtherBlocks.map((item, index) => {
          return {
            ...item,
            index: index + 2
          }
        })
      }
      const tempBlocks = [tempRootBlock, ...tempOtherBlocks]
      reconstruct(tempBlocks)
      setBlocks(builderState.blocks)
    }
  }, [
    blockTypes,
    builderState.blocks,
  ])

  return (
    <Box
      id="canvas"
      style={{
        cursor: `${isCanvasClicking ? 'grabbing' : 'move'}`,
        left: isLeftTabOpen ? '360px' : '100px',
        width: 'calc(100% - 360px)',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
    >
      {rightCards?.map(rightCard => {
        return (
          <RightCard
            key={rightCard?.id}
            data={rightCard}
            onChangeProp={props.onChangeProp}
            onProp={viewProps}
            onDeleteCard={deleteCard}
            onOver={updateParent}
            onLeave={formatParent}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            isMoving={false}
            isSelected={false}
            updatedId={updatedId}
          />
        )
      })}
      {selectedCards?.map(selectedCard => {
        return (
          <RightCard
            key={selectedCard?.id}
            data={selectedCard}
            onChangeProp={props.onChangeProp}
            onProp={viewProps}
            onDeleteCard={deleteCard}
            onOver={updateParent}
            onLeave={formatParent}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            isMoving={true}
            isSelected={true}
            updatedId={updatedId}
          />
        )
      })}
      {arrows?.map(arrow => {
        return <Arrow key={arrow?.id} data={arrow} isSelected={false} />
      })}
      {selectedArrows?.map(arrow => {
        return <Arrow key={arrow?.id} data={arrow} isSelected={true} />
      })}
    </Box>
  )
}
export default Canvas
