import React, { useCallback, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  CSSReset,
  ThemeProvider,
} from '@chakra-ui/react'

import { Styles } from './style/builderStyle'
import BuilderHeader from '../components/headers/BuilderHeader/index'
import LeftTab from '../components/LeftTab'
import Canvas from '../components/Canvas'
import PropWrap from '../components/propWrap/index'
import BareLayout from '../components/layout/BareLayout'
import { customTheme } from '../theme'
import { useBuilder } from '../provider/builder'
import siteConfig from '../config/site.config'
import { apiGetToken } from '../api/index'
import { getAll as getBundles } from '../api/bundle'
import { getAll as getProtocols } from '../api/protocol'
import { getAll as getDosages } from '../api/dosage'
import { getAll as getTests } from '../api/test'
import { getAll as getFindings } from '../api/finding'
import { getAll as getQualifiers } from '../api/qualifier'
import { getAll as getPresentations } from '../api/presentation'
import { getAll as getKeypoints } from '../api/keypoint'
import { getAll as getDiseases } from '../api/disease'
import { getAll as getSpecialties } from '../api/specialty'
import { getAll as getPathways } from '../api/pathway'
import { getAll as getCalculators } from '../api/calculator'
import { getAll as getReferences } from '../api/reference'
import { getAll as getCriterias } from '../api/criteria'
import { getAll as getFilters } from '../api/filter'
import { getAll as getPeriods } from '../api/period'
import { getAll as getHandouts } from '../api/handout'
import { getFilter as getBlocks, remove as removeBlock } from '../api/block'
import { getAll as getBlockTypes } from '../api/blocktype'
import { getAll as getContactMethods } from '../api/contactMethod'
import { updateFields as updateBlockFields } from '../api/block'
import { getAll as getExpressions, create as createExpression } from '../api/expression'
import {
  CardData,
  BundleType,
  ProtocolType,
  BlockData,
  BlockTypes,
  TableData,
  SystemTypes,
  ExpressionTypes
} from '../types'

export const Builder = () => {
  const { bundleId, protocolId }: { bundleId: string; protocolId: string } = useParams() as { bundleId: string; protocolId: string }
  const { builderState, dispatch } = useBuilder()
  const [isOpenProp, setIsOpenProp] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<BundleType>()
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>()
  const [blockTypes, setBlockTypes] = useState<BlockTypes[]>([])
  const [index, setIndex] = useState(0)
  const [isLeftTabOpen, setIsLeftTabOpen] = useState<boolean>(true)
  const [isChangeProp, setIsChangeProp] = useState<boolean>(false)

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
    }, [])
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
    }, [])
  const initData = () => {
    getDosages().then((res) => {
      dispatch({ type: 'SET', settingName: 'dosages', settingData: res.records })
    })
    getTests().then((res) => {
      dispatch({ type: 'SET', settingName: 'tests', settingData: res.records })
    })
    getFindings().then((res) => {
      dispatch({ type: 'SET', settingName: 'findings', settingData: res.records })
    })
    getQualifiers().then((res) => {
      dispatch({ type: 'SET', settingName: 'qualifiers', settingData: res.records })
    })
    getPresentations().then((res) => {
      dispatch({ type: 'SET', settingName: 'presentations', settingData: res.records })
    })
    getKeypoints().then((res) => {
      dispatch({ type: 'SET', settingName: 'keypoints', settingData: res.records })
    })
    getDiseases().then((res) => {
      dispatch({ type: 'SET', settingName: 'diseases', settingData: res.records })
    })
    getSpecialties().then((res) => {
      dispatch({ type: 'SET', settingName: 'specialties', settingData: res.records })
    })
    getPathways().then((res) => {
      dispatch({ type: 'SET', settingName: 'pathways', settingData: res.records })
    })
    getCalculators().then((res) => {
      dispatch({ type: 'SET', settingName: 'calculators', settingData: res.records })
    })
    getReferences().then((res) => {
      dispatch({ type: 'SET', settingName: 'references', settingData: res.records })
    })
    getPeriods().then((res) => {
      dispatch({ type: 'SET', settingName: 'periods', settingData: res.records })
    })
    getHandouts().then((res) => {
      dispatch({ type: 'SET', settingName: 'handouts', settingData: res.records })
    })
    getBlockTypes().then((res) => {
      setBlockTypes(res.records)
    })
    getContactMethods().then((res) => {
      dispatch({ type: 'SET', settingName: 'contact_methods', settingData: res.records })
    })
    getBundles().then((res) => {
      dispatch({ type: 'SET', settingName: 'bundles', settingData: res.records })
    })
    getProtocols().then((res) => {
      dispatch({ type: 'SET', settingName: 'protocols', settingData: res.records })
    })
    getExpressions().then((res) => {
      let tmp = res?.records
      tmp = tmp.map(item => {
        return item?.fields
      })
      dispatch({ type: 'SET', settingName: 'expressions', settingData: tmp })
    })
    getCriterias().then((res) => {
      let tmp = res?.records
      tmp = tmp.map((item) => {
        return item?.fields
      })
      dispatch({ type: 'SET', settingName: 'criterias', settingData: tmp })
    })
  }
  const initBlocks = async (tempProtocolId: string) => {
    const res = await getBlocks({
      filterByFormula: `SEARCH("${tempProtocolId}",{protocol})`
    })
    dispatch({ type: 'SET', settingName: 'blocks', settingData: res.records as BlockData[] })
  }
  const initFilters = async () => {
    const res = await getFilters()
    const tmp = res?.records
    const tmpQn = tmp.filter((item) => {
      const scaleTypes = item?.fields?.scale_types
      return scaleTypes.includes('Qn')
    })
    const tmpNom = tmp.filter((item) => {
      const scaleTypes = item?.fields?.scale_types
      return scaleTypes.includes('Nom')
    })
    const tmpDate = tmp.filter((item) => {
      const scaleTypes = item?.fields?.scale_types
      return scaleTypes.includes('Date')
    })
    const tmpSet = tmp.filter((item) => {
      const scaleTypes = item?.fields?.scale_types
      return scaleTypes.includes('Set')
    })
    const tmpOrd = tmp.filter((item) => {
      const scaleTypes = item?.fields?.scale_types
      return scaleTypes.includes('Ord')
    })
    dispatch({
      type: 'SET', settingName: 'filters', settingData: {
        qn: tmpQn,
        nom: tmpNom,
        date: tmpDate,
        set: tmpSet,
        ord: tmpOrd
      }
    })
  }
  const saveCards = (cards: CardData[]) => {
    dispatch({ type: 'SET', settingName: 'cards', settingData: cards })
  }
  const saveBlocks = (elements: BlockData[], addedBlock: BlockData) => {
    dispatch({ type: 'SET', settingName: 'blocks', settingData: [...elements, addedBlock] })
  }
  const onViewProps = (propCards: CardData[], id: number) => {
    let flag = false
    dispatch({ type: 'SET', settingName: 'cards', settingData: propCards })
    for (let i = 0; i < propCards.length; i++) {
      if (propCards[i].isOpenProps === true) {
        flag = true
        setIndex(i)
        dispatch({ type: 'SET', settingName: 'propertyData', settingData: propCards[i] })
        break
      }
    }
    setIsOpenProp(flag)
  }
  const deleteCardFromCanvas = (action: CardData[]) => {
    if (action) {
      dispatch({ type: 'SET', settingName: 'cards', settingData: action })
    }
  }
  const deleteCard = () => {
    let id = builderState.cards[index].id
    let savedId = builderState.cards[index].savedId
    if (id > 0) {
      const newCards = [...builderState.cards]
      const newBlocks = [...builderState.blocks]
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
        const nonSelectedCards = newCards.filter(
          ({ id }) => !tempSelectedIds.includes(id),
        )
        const nonSelectedBlocks = newBlocks.filter(
          ({ id }) => !tempSelectedBlockIds.includes(id),
        )
        const selectedBlocks = newBlocks.filter(({ id }) =>
          tempSelectedBlockIds.includes(id),
        )
        if (tempSelCard.isOpenProps) {
          tempSelCard.isOpenProps = false
          onViewProps(nonSelectedCards, id)
        }
        dispatch({ type: 'SET', settingName: 'cards', settingData: nonSelectedCards })
        dispatch({ type: 'SET', settingName: 'blocks', settingData: nonSelectedBlocks })
        deleteBlocks(selectedBlocks)
        deleteCardFromCanvas(nonSelectedCards)
      }
    }
  }
  const deleteBlocks = async (blocksData: BlockData[]) => {
    await Promise.all(blocksData?.map(async (block) => {
      await removeBlock(block.id)
    }))
  }
  const closeProperties = () => {
    setIsOpenProp(false)
  }
  const handleLeftTabOpenChange = (isOpen: boolean) => {
    setIsLeftTabOpen(isOpen)
  }
  const setAdditionalOption = (tempId: string, type: string, field: string, stateName: string) => {
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/${type}?filterByFormula=${encodeURIComponent(
      `FIND('${tempId}',{${field}})`,
    )}`
    apiGetToken(url).then((res) => {
      const option = res.records[0]
      const tmp = builderState[stateName].find(
        ({ id }) => id === option.id,
      )
      if (!tmp)
        dispatch({ type: 'SET', settingName: stateName, settingData: [...builderState[stateName], option] })
    })
  }
  const changeBlock = async (element: BlockData) => {
    const res = await updateBlockFields(element)
    let newBlocks = [...builderState.blocks]
    newBlocks = newBlocks.map((item) => {
      if (item.id === res.id) {
        return res
      }
      return item
    })
    dispatch({ type: 'SET', settingName: 'blocks', settingData: newBlocks })
  }
  const updateBlockWithExpression = async (action: ExpressionTypes) => {
    if (action) {
      const selectedBlock = builderState.blocks.find(
        block => block.id === builderState.propertyData.savedId,
      )
      if (selectedBlock) {
        selectedBlock.fields.expressions = [action.expression_id]
        changeBlock(selectedBlock)
      }
    }
  }
  const initExpressions = async () => {
    const res = await getExpressions()
    let tmp = res?.records
    tmp = tmp.map(item => {
      return item?.fields
    })

    dispatch({ type: 'SET', settingName: 'expressions', settingData: tmp })
  }
  const saveExpressions = async (tempSys: SystemTypes, tempVar: TableData) => {
    var tempFields = {
      base: 'LOINC',
      code: tempVar.fields.LOINC_NUM,
      component: tempVar.fields.COMPONENT,
      system: tempSys.name,
      units: tempVar.fields.EXAMPLE_UNITS,
    }
    // Try to find existing one
    const expressions = await getExpressions()
    const existingExpression = expressions?.records.find(({ fields }) => {
      for (const field in tempFields) {
        if (fields[field] != tempFields[field]) {
          return false
        }
      }
      return true
    })
    if (existingExpression) {
      updateBlockWithExpression(existingExpression.fields)
      initExpressions()
      return
    }
    // If not, create a new one
    if (!(tempVar.fields.SCALE_TYP === '-' || tempVar.fields.SCALE_TYP === '')) {
      tempFields['scale_type'] = tempVar.fields.SCALE_TYP
    }
    const data = {
      records: [
        {
          fields: tempFields,
        },
      ],
    }
    const res = await createExpression(data)
    if (res.records.length !== 0)
      updateBlockWithExpression(res.records[0].fields)
    initExpressions()
  }

  useEffect(() => {
    initData()
    initFilters()
  }, [])
  useEffect(() => {
    if (protocolId)
      initBlocks(protocolId)
  }, [protocolId])
  useEffect(() => {
    if (builderState.blocks) {
      const blocks = builderState?.blocks
      blocks?.map(async (block) => {
        const diseases = block?.fields?.diseases_mke || []
        diseases.map((item) => {
          setAdditionalOption(item, 'Diseases', 'disease_id', 'diseases')
        })
        const findings = block?.fields?.findings_mke || []
        findings.map((item) => {
          setAdditionalOption(item, 'Findings', 'finding_id', 'findings')
        })
        const dosages = block?.fields?.dosages_mke || []
        dosages.map((item) => {
          setAdditionalOption(item, 'Dosages', 'dosage_id', 'dosages')
        })
        const tests = block?.fields?.tests_mke || []
        tests.map((item) => {
          setAdditionalOption(item, 'Tests', 'test_id', 'tests')
        })
        const specialties = block?.fields?.specialties_mke || []
        specialties.map((item) => {
          setAdditionalOption(item, 'Specialties', 'specialty_id', 'specialties')
        })
        const calculators = block?.fields?.calculators_mke || []
        calculators.map((item) => {
          setAdditionalOption(item, 'Calculators', 'calculator_id', 'calculators')
        })
        const keypoints = block?.fields?.keypoints_mke || []
        keypoints.map((item) => {
          setAdditionalOption(item, 'Keypoints', 'keypoint_id', 'keypoints')
        })
        const presentations = block?.fields?.presentations_mke || []
        presentations.map((item) => {
          setAdditionalOption(item, 'Presentations', 'presentation_id', 'presentations')
        })
        const pathways = block?.fields?.pathways_mke || []
        pathways.map((item) => {
          setAdditionalOption(item, 'Pathways', 'pathway_id', 'pathways')
        })
        const references = block?.fields?.references_mke || []
        references.map((item) => {
          setAdditionalOption(item, 'References', 'reference_id', 'references')
        })
        const periods = block?.fields?.periods_mke || []
        periods.map((item) => {
          setAdditionalOption(item, 'Periods', 'period_id', 'periods')
        })
        const handouts = block?.fields?.handouts_mke || []
        handouts.map((item) => {
          setAdditionalOption(item, 'Handouts', 'handout_id', 'handouts')
        })
      })
    }
  }, [builderState.blocks])
  useEffect(() => {
    dispatch({ type: 'SET', settingName: 'bundleId', settingData: bundleId })
    const tempBundle = builderState.bundles.find(({ id }) => id === bundleId)
    if (tempBundle)
      setSelectedBundle(tempBundle)
  }, [builderState.bundles, bundleId])
  useEffect(() => {
    dispatch({ type: 'SET', settingName: 'protocolId', settingData: protocolId })
    const tempProtocol = builderState.protocols.find(({ id }) => id === protocolId)
    if (tempProtocol)
      setSelectedProtocol(tempProtocol)
  }, [builderState.protocols, protocolId])

  return (
    <Styles>
      <Box className="builder">
        <ThemeProvider theme={customTheme}>
          <CSSReset />
          <BareLayout>
            <Box>
              <Box>
                <BuilderHeader
                  selBundle={selectedBundle}
                  selProtocol={selectedProtocol}
                  saveExpressions={saveExpressions}
                />
              </Box>
              <LeftTab onOpenChange={handleLeftTabOpenChange} />
              <PropWrap
                data={isOpenProp}
                isChangeProp={isChangeProp}
                onChangeProp={setIsChangeProp}
                onDelete={deleteCard}
                onCloseProperties={closeProperties}
                changeBlock={changeBlock}
                saveExpressions={saveExpressions}
              />
              <Canvas
                isLeftTabOpen={isLeftTabOpen}
                isAddStart={protocolId != undefined}
                blockTypes={blockTypes}
                selBundle={selectedBundle}
                selProtocol={selectedProtocol}
                onChangeProp={setIsChangeProp}
                onPropsView={onViewProps}
                onSaveCards={saveCards}
                onSaveBlocks={saveBlocks}
                onDeleteCard={deleteCardFromCanvas}
              />
            </Box>
          </BareLayout>
          <Box position="absolute" bottom="32px" right="32px">
            <Link to="/">
              <Button width="200px" colorScheme="green">
                Back to Care Manager
              </Button>
            </Link>
          </Box>
        </ThemeProvider>
      </Box>
    </Styles>
  )
}
export default Builder
