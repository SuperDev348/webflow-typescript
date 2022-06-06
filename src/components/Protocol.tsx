import React, { useState, useContext } from 'react'
import { Button, Box, Flex, Text } from '@chakra-ui/react'
import { ArcherContainer, ArcherElement } from 'react-archer'

import { getBlocks, useAsync, wrapInBox, wrapError } from './nodes/helpers'
import { BlockData, PatientType } from '../types'
import {
  ApplyNode,
  AwaitNode,
  BranchNode,
  CalculatorNode,
  CustomNode,
  ElicitNode,
  EndNode,
  FilterNode,
  LinkNode,
  NoteNode,
  OrderNode,
  PrescribeNode,
  DifferentialNode,
  RecordNode,
  ScheduleNode,
  SignAndSaveButton,
  StartNode,
  TriggerNewActionNode,
  TriggerNewPatientNode,
  TriggerRepeatTimerNode,
} from './nodes'
import { BLOCK_TYPES } from '../data'

type ProtocolPropsType = {
  protocolId: string
  isContextualized: boolean
  unfoldPaths?: boolean
  patientContext?: React.Context<PatientType>
  onStateChange?: (protocolId: string, protocolState: any) => void
}
const Protocol = (props: ProtocolPropsType) => {
  const { protocolId, isContextualized, unfoldPaths, patientContext } = props

  const {
    onStateChange: _onStateChange = (protocolId, protocolStateUpdate) => { },
  } = props
  const [protocolState, setProtocolState] = useState({
    applyNodeStates: {},
    recordNodeStates: {},
    elicitNodeStates: {},
    filterNodeStates: {},
    calculatorStates: {},
  })

  const onStateChange = (protocolId, protocolStateUpdate) => {
    const newState = { ...protocolState, ...protocolStateUpdate }
    console.log('[Protocol] State update', protocolStateUpdate)
    console.log('[Protocol] Current state: ', newState)
    setProtocolState(newState)
  }

  const patient = useContext(patientContext)
  const protocolContext = React.createContext({})
  const protocol = useContext(protocolContext)

  const [currentBlocks, setCurrentBlocks] = useState<BlockData[]>([])
  const [edgeLabels, setEdgeLabels] = useState<string[]>([])
  const [orderedBlocks, setOrderedBlocks] = useState<BlockData[]>([])
  const [branchingPoints, setBranchingPoints] = useState<any>({})
  const [blocks, setBlocks] = useState<BlockData[]>()
  const [isCurrentNodeTerminating, setIsCurrentNodeTerminating] = useState<
    boolean | null
  >(null)
  const [isCurrentNodeDisinhibited, setIsCurrentNodeDisinhibited] = useState<
    boolean | null
  >(null)
  const [numBlocksShown, setNumBlocksShown] = useState<number>(1)
  const [isMissingEndBlock, setIsMissingEndBlock] = useState<boolean>(false)
  const [isSigned, setIsSigned] = useState<boolean>(false)
  const [blockCompletionStates, setBlockCompletionStates] = useState<boolean[]>(
    [],
  )
  const [numBlocksRendered, setNumBlocksRendered] = useState<number>(0)

  const onSign = () => {
    setIsSigned(true)
    onStateChange(protocolId, { isComplete: true })
  }

  useAsync(
    async () => await getBlocks(protocolId),
    (currentBlocks: any) => {
      setBlocks(currentBlocks)
    },
  )

  const incrementNumBlocksShown = (isNodeInhibiting?) => {
    if (isNodeInhibiting && !isCurrentNodeDisinhibited) {
      console.log('[Protocol] Current node is inhibiting.')
      return
    }
    if (isCurrentNodeTerminating) {
      console.log('[Protocol] Current node is terminating.')
      return
    }
    if (numBlocksShown < (orderedBlocks || []).length) {
      console.log(
        `[Protocol] Show more blocks: ${numBlocksShown + 1}/${orderedBlocks.length
        }`,
      )
      setNumBlocksShown(numBlocksShown + 1)
      setBlockCompletionStates([...blockCompletionStates, true])
      //console.log([...blockCompletionStates, true])
      if (numBlocksShown === 2 && isContextualized) {
        onStateChange(protocolId, { isInitiated: true })
      }
    } else {
      console.log('[Protocol] No more blocks to show.')
      //setIsMissingEndBlock(true)
      setIsCurrentNodeTerminating(true)
    }
  }

  const getOrderedBlocks = () => {
    const oldBlockChain = orderedBlocks.map(block => block.id)
    const startingBlock = blocks?.find((block: BlockData) =>
      block.fields?.block_type_mke?.includes(BLOCK_TYPES.Structure.Start),
    )
    if (!startingBlock)
      throw new Error(
        'The protocol could not be rendered, because there is no starting block.\n' +
        'Add a "Start" block from the "Structure" tab to your left as the first block in your protocol.',
      )

    let blocksRemaining = blocks!.length - 1
    let currentOrderedBlocks: BlockData[] = [startingBlock]
    let nextNode: BlockData | undefined = startingBlock

    while (blocksRemaining > 0) {
      const firstEdgeId: string = nextNode.fields.edges
        ? nextNode.fields.edges[0]
        : ''

      const nextEdgeId: string = branchingPoints[nextNode.id] ?? firstEdgeId

      if (nextEdgeId) {
        nextNode = blocks!.find((block: BlockData) => block.id == nextEdgeId)
        if (!nextNode) {
          console.log(`Could not find block ${nextEdgeId}`, blocks)
          throw new Error(`Error: could not find next block in list.`)
        }
        currentOrderedBlocks.push(nextNode)
        blocksRemaining--
      } else {
        break
      }
    }
    // Reset edges for path of tree that has "disappeared"
    const newBlockChain = currentOrderedBlocks.map(block => block.id)
    if (newBlockChain != oldBlockChain) {
      let i = 0
      while (i < oldBlockChain.length && oldBlockChain[i] == newBlockChain[i]) {
        i++
      }
      setEdgeLabels(edgeLabels.slice(0, i))
    }
    return currentOrderedBlocks
  }

  const updateOrderedBlocks = () => {
    console.log('[Protocol] Updating graph path')
    setIsCurrentNodeTerminating(false)
    const _orderedBlocks: BlockData[] = getOrderedBlocks()
    setOrderedBlocks(_orderedBlocks)
  }

  const setEdgeLabel = (blockNum: number, label: string) => {
    let newEdgeLabels = edgeLabels
    while (newEdgeLabels.length < blockNum) {
      newEdgeLabels.push(null)
    }
    newEdgeLabels[blockNum] = label
    setEdgeLabels(newEdgeLabels)
  }

  const updateBranchingPoint = (blockId: string, nextBlockId: string) => {
    console.log('[Protocol] Updating branching points')
    let newBranchingPoints = branchingPoints
    if (!nextBlockId) {
      throw new Error(
        'Filter node should have two children blocks: ' +
        'One for the true and one for the false case.',
      )
    }
    newBranchingPoints[blockId] = nextBlockId
    setBranchingPoints(newBranchingPoints)
    updateOrderedBlocks()
    const numBlocksShownUpToBranchingPoint =
      orderedBlocks.findIndex(block => {
        return block.id === blockId
      }) + 1

    setNumBlocksShown(numBlocksShownUpToBranchingPoint)
    setNumBlocksRendered(numBlocksShownUpToBranchingPoint)
  }

  //const onCalculatorStateChange = (state) => {
  //
  //}
  const renderBlock = (block: BlockData, blockNum: number, isLast: boolean) => {
    const blockId = block.id
    const blockTypeId = block.fields.block_type_mke[0]
    const blockEdges = block.fields.edges

    let currentBlock: any
    let isNodeInhibiting = false
    const currentNumBlocksRendered =
      blockNum >= numBlocksRendered ? numBlocksRendered + 1 : numBlocksRendered

    if (blockTypeId == BLOCK_TYPES.Action.Use) {
      const calculatorId = (block.fields.calculators_mke || [''])[0]
      currentBlock = (
        <CalculatorNode
          isContextualized={isContextualized}
          blockId={blockId}
          calculatorId={calculatorId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Order) {
      const testIds = block.fields.tests || [] // not mke
      currentBlock = (
        <OrderNode
          isContextualized={isContextualized}
          blockId={blockId}
          testIds={testIds}
          selectOne={true}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Structure.Filter) {
      const expressionIds = block.fields.expressions || []
      currentBlock = (
        <FilterNode
          blockId={blockId}
          isContextualized={isContextualized}
          expressionIds={expressionIds}
          filters={[]}
          isComplete={blockCompletionStates[blockNum]}
          onEvaluationResultChange={result => {
            if (!blockEdges) {
              return wrapError('Block edges not defined for a filter node.')
            }
            const nextBlockId = result ? blockEdges[0] : blockEdges[1]
            setEdgeLabel(
              blockNum,
              {
                true: 'Meets criteria',
                false: 'Criteria not met',
              }[result.toString()],
            )
            try {
              updateBranchingPoint(blockId, nextBlockId)
              if (!isCurrentNodeDisinhibited) {
                setIsCurrentNodeDisinhibited(true)
              }
            } catch (err) {
              console.error(err)
            }
          }}
          protocolState={protocolState}
          patientContext={patientContext}
          onStateUpdate={({ selectedKeys }) => {
            let filterNodeStates = protocolState.filterNodeStates
            filterNodeStates[blockId] = { selectedKeys }
            onStateChange(protocolId, { filterNodeStates })
          }}
          defaultToYes={unfoldPaths}
        />
      )
      if (blockNum == numBlocksRendered) {
        setIsCurrentNodeDisinhibited(false)
      }
      isNodeInhibiting = true
    } else if (blockTypeId == BLOCK_TYPES.Structure.Branch) {
      const expressionId = (block.fields.expressions || [''])[0]
      currentBlock = (
        <BranchNode
          isContextualized={isContextualized}
          blockId={blockId}
          expressionId={expressionId}
          isComplete={blockCompletionStates[blockNum]}
          onEvaluationResultChange={({
            index,
            text,
          }: {
            index: number
            text: string
          }) => {
            if (!blockEdges) {
              return wrapError('Block edges not defined for a branch node.')
            }
            const nextBlockId = blockEdges[index]
            setEdgeLabel(blockNum, text)
            try {
              updateBranchingPoint(blockId, nextBlockId)
              if (!isCurrentNodeDisinhibited && text != '') {
                setIsCurrentNodeDisinhibited(true)
              }
            } catch (err) {
              console.error(err)
            }
          }}
          patientContext={patientContext}
          protocolState={protocolState}
        />
      )
      if (blockNum == numBlocksRendered) {
        setIsCurrentNodeDisinhibited(false)
      }
      // Also need a local bc state update race condition
      isNodeInhibiting = true
    } else if (blockTypeId == BLOCK_TYPES.Action.Record) {
      const diseaseId = (block.fields.diseases_mke || [''])[0]
      currentBlock = (
        <RecordNode
          isContextualized={isContextualized}
          blockId={blockId}
          diseaseId={diseaseId}
          isComplete={blockCompletionStates[blockNum]}
          onStateUpdate={newNodeState => {
            let recordNodeStates = protocolState.recordNodeStates
            recordNodeStates[blockId] = newNodeState
            onStateChange(protocolId, { recordNodeStates })
          }}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Elicit) {
      const findingIds = block.fields.findings_mke || []
      currentBlock = (
        <ElicitNode
          isContextualized={isContextualized}
          blockId={blockId}
          findingIds={findingIds}
          isComplete={blockCompletionStates[blockNum]}
          onStateUpdate={newState => {
            let elicitNodeStates = protocolState.elicitNodeStates
            elicitNodeStates[blockId] = newState
            onStateChange(protocolId, { elicitNodeStates })
          }}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Structure.Start) {
      /*console.log(
        'render start',
        blockCompletionStates,
        blockNum,
        blockCompletionStates[blockNum],
      )*/
      currentBlock = (
        <StartNode
          isContextualized={isContextualized}
          blockId={blockId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
    } else if (blockTypeId == BLOCK_TYPES.Structure.End) {
      currentBlock = (
        <EndNode
          isContextualized={isContextualized}
          blockId={blockId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered) {
        setIsCurrentNodeTerminating(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Schedule) {
      const specialtyId = (block.fields.specialties_mke || [''])[0] // not mke
      currentBlock = (
        <ScheduleNode
          isContextualized={isContextualized}
          blockId={blockId}
          specialtyId={specialtyId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Apply) {
      const keypointId = (block.fields.keypoints_mke || [''])[0]
      currentBlock = (
        <ApplyNode
          isContextualized={isContextualized}
          blockId={blockId}
          keypointId={keypointId}
          isComplete={blockCompletionStates[blockNum]}
          onStateUpdate={newState => {
            let applyNodeStates = protocolState.applyNodeStates
            applyNodeStates[blockId] = newState
            onStateChange(protocolId, { applyNodeStates })
          }}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Trigger.Await) {
      const testIds = block.fields.tests || [] // not mke
      currentBlock = (
        <AwaitNode
          isContextualized={isContextualized}
          blockId={blockId}
          testIds={testIds}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Note) {
      const { title, placeholder } = JSON.parse(block.fields.note || '{}')
      currentBlock = (
        <NoteNode
          isContextualized={isContextualized}
          blockId={blockId}
          title={title}
          placeholder={placeholder}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Custom) {
      const { title, text } = JSON.parse(block.fields.custom || '{}')
      currentBlock = (
        <CustomNode
          isContextualized={isContextualized}
          blockId={blockId}
          title={title}
          text={text}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Prescribe) {
      const dosageId = (block.fields.dosages_mke || [''])[0]
      currentBlock = (
        <PrescribeNode
          isContextualized={isContextualized}
          blockId={blockId}
          dosageId={dosageId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Differential) {
      const presentationId = (block.fields.presentations_mke || [''])[0]
      currentBlock = (
        <DifferentialNode
          isContextualized={isContextualized}
          blockId={blockId}
          presentationId={presentationId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Trigger.NewPatient) {
      currentBlock = (
        <TriggerNewPatientNode
          isContextualized={isContextualized}
          blockId={blockId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Trigger.NewAction) {
      currentBlock = (
        <TriggerNewActionNode
          isContextualized={isContextualized}
          blockId={blockId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Trigger.RepeatTimer) {
      const periodId = (block.fields.periods_mke || [''])[0]
      currentBlock = (
        <TriggerRepeatTimerNode
          isContextualized={isContextualized}
          blockId={blockId}
          periodId={periodId}
          isComplete={blockCompletionStates[blockNum]}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    } else if (blockTypeId == BLOCK_TYPES.Action.Link) {
      const protocolId = (block.fields.pathways_mke || [''])[0]
      currentBlock = (
        <LinkNode
          isContextualized={isContextualized}
          blockId={blockId}
          isComplete={blockCompletionStates[blockNum]}
          protocolId={protocolId}
        />
      )
      if (blockNum == numBlocksRendered - 1 && isCurrentNodeDisinhibited === false) {
        setIsCurrentNodeDisinhibited(true)
      }
    }
    // else if (blockTypeId == BLOCK_TYPES.Connect.Educate) {
    //   const handoutId = (block.fields.handouts_mke || [''])[0]
    //   currentBlock = (
    //     <HandoutNode
    //       isContextualized={isContextualized}
    //       blockId={blockId}
    //       isComplete={blockCompletionStates[blockNum]}
    //       handoutId={handoutId}
    //       patientContext={patientContext}
    //     />
    //   )
    // }
    else {
      currentBlock = wrapInBox(wrapError(`Unknown block type: ${blockTypeId}`))
    }

    if (blockNum >= numBlocksRendered) {
      setNumBlocksRendered(numBlocksRendered + 1)
    }

    // Only trigger this if current render is last block in chain
    if (blockNum == numBlocksRendered) {
      console.log(`[Protocol] Rendered block #${blockNum + 1}`)
      if (unfoldPaths) {
        console.log(`[Protocol] Unfolding paths`)
        incrementNumBlocksShown()
      }
    }

    return currentBlock
  }

  if (blocks && blocks.length > 0 && orderedBlocks.length == 0) {
    try {
      updateOrderedBlocks()
    } catch (err) {
      return wrapInBox(wrapError(err.message))
    }
  }
  return !currentBlocks ? (
    <></>
  ) : (
    <Box zIndex={888}>
      <ArcherContainer strokeColor="#CCC">
        {orderedBlocks
          .slice(0, numBlocksShown)
          .map((block: BlockData, blockNum: number) => {
            const isLastBlock: boolean =
              blockNum >= numBlocksShown - 1 ||
              blockNum >= orderedBlocks.length - 1
            const nextBlock: any = isLastBlock
              ? undefined
              : orderedBlocks[blockNum + 1]

            if (!block) {
              throw new Error('Empty block')
            }

            let renderedBlock

            try {
              renderedBlock = renderBlock(block, blockNum, false)
            } catch (err) {
              renderedBlock = wrapError(err.message)
            }

            if (!isLastBlock) {
              const edgeLabel = edgeLabels[blockNum]

              return (
                <ArcherElement
                  key={block.id}
                  id={`${block.id}`}
                  relations={[
                    {
                      targetId: nextBlock.id,
                      targetAnchor: 'top',
                      sourceAnchor: 'bottom',
                      style: { strokeColor: '#CCC', strokeWidth: 1 },
                      label: !edgeLabels ? null : (
                        <Box width="200px" bg="white">
                          <Text>{edgeLabel}</Text>
                        </Box>
                      ),
                    },
                  ]}
                >
                  <Box>{renderedBlock}</Box>
                </ArcherElement>
              )
            } else {
              return (
                <ArcherElement key={block.id} id={`${block.id}`}>
                  <Box>{renderedBlock}</Box>
                </ArcherElement>
              )
            }
          })}
      </ArcherContainer>
      <Flex align="center" justify="center">
        {!isSigned && (
          <Box>
            {isCurrentNodeTerminating ? (
              !isMissingEndBlock ? (
                <SignAndSaveButton
                  patientContext={patientContext}
                  protocolId={protocolId}
                  protocolState={protocolState}
                />
              ) : (
                <Box>
                  {wrapError("This branch does not have an 'end' block.")}
                </Box>
              )
            ) : (
              <Button
                size="lg"
                colorScheme="green"
                onClick={() => {
                  incrementNumBlocksShown(false)
                  setIsCurrentNodeDisinhibited(false)
                }}
                disabled={isCurrentNodeDisinhibited === false}
              >
                <Text>Next</Text>
              </Button>
            )}
          </Box>
        )}
        {isSigned && (
          <Box>
            <Button
              size="lg"
              colorScheme="green"
              onClick={() => alert('Generate!')}
            >
              <Text>Download Report</Text>
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default Protocol
