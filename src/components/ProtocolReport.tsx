import React, { useContext } from 'react'

import {
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { PatientType } from '../types'

interface BlobProviderParams {
  blob: Blob | null
  url: string | null
  loading: boolean
  error: Error | null
}

type TRecGrading = { type: 'grading'; value: any }
type TRecText = { type: 'text'; els: TRecInlineElement[] }
type TRecList = { type: 'list'; els: TRecBlockElement[] }
type TRecInlineElement = string | TRecGrading
type TRecBlockElement = TRecText | TRecList
type TRecRichtext = TRecBlockElement[]

type TopicResult = {
  id: string
  title: string
  introText?: string
  recommendationsResults: { richtext: TRecRichtext; answer: string }[]
}

const rem = 12

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: '1in',
  },
  pageContainer: {},
  h1: {
    fontSize: 1.563 * rem,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  h2: {
    fontSize: 1.25 * rem,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 1.15 * rem,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  body: {
    fontSize: 1 * rem,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    lineHeight: 1.3,
  },
  bold: {
    fontSize: 1 * rem,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
})
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://rsms.me/inter/font-files/Inter-Regular.woff?v=3.19',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: 'https://rsms.me/inter/font-files/Inter-Bold.woff?v=3.19',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
})

const Wrap: React.FC<{
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
  children: React.ReactNode
}> = ({ condition = true, wrapper, children }) => {
  return (
    <>
      condition ? wrapper(children) : <>{children}</>
    </>
  )
}

const Space: React.FC<{ w?: number; h?: number }> = ({ w = 0, h = 0 }) => {
  return <View style={{ width: w * rem, height: h * rem }} />
}

const AssociativeTextTable: React.FC<{
  rows: { label: string; value: string }[]
  labelColumnWidth?: number | string
  columnGap?: number
  rowGap?: number
}> = ({ rows, labelColumnWidth = 6 * rem, columnGap = 0.5, rowGap = 0 }) => {
  return (
    <View style={{ marginTop: rowGap * rem * -1 }}>
      {rows.map(({ label, value }, rowI) => (
        <View
          key={rowI}
          style={{ flexDirection: 'row', marginTop: rowGap * rem }}
        >
          <View style={{ width: labelColumnWidth }}>
            <Text style={styles.body}>{label}:</Text>
          </View>

          <View style={{ marginLeft: columnGap, flexGrow: 1 }}>
            <Text style={styles.bold}>{value}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const ListElement: React.FC<{ bullet?: string; children?: React.ReactNode }> =
  ({ bullet = '•', children }) => {
    return (
      <View style={{ flexDirection: 'row' }} wrap={false}>
        <View style={{ width: 1 * rem }}>
          <Text style={styles.body}>{bullet}</Text>
        </View>

        <View style={{ flexGrow: 1 }}>{children}</View>
      </View>
    )
  }

function getIsoDate(date: Date) {
  return date.toJSON().split('T')[0]
}

const ProtocolReportContext = React.createContext<{
  api: any,
  bundle: any,
  protocol: any,
  protocolState: any
}>({
  api: {},
  bundle: {},
  protocol: {},
  protocolState: {},
})

export function useProtocolReportContext() {
  return useContext(ProtocolReportContext)
}

const CalculatorResult: React.FC<{
  calculatorId: string
  calculatorState: any
}> = ({ calculatorId, calculatorState }) => {
  const calculator = { id: calculatorId, name: '', criteriaGroups: [] }
  const questions = calculator.criteriaGroups
    .flatMap((criteriaGroup: any) => {
      return criteriaGroup.criteria
        .map((criterion: any) => {
          if (criteriaGroup.mode == 'toggle') {
            const title =
              criteriaGroup.name && criteriaGroup.name != 'default'
                ? criteriaGroup.name
                : null
            return calculatorState.answers[criterion.id]
              ? [
                title ? title + ': ' + criterion.text : criterion.text,
                calculatorState.answers[criterion.id] ? 'Yes' : 'No',
              ]
              : null
          } else {
            return [
              criterion.text,
              calculatorState.answers[criterion.id] ? 'Yes' : 'No',
            ]
          }
        })
        .filter((x: any) => !!x)
    })
    .filter((x: any) => !!x)

  return (
    <ListElement>
      <Text style={styles.body}>
        {calculator.name}:{' '}
        <Text style={styles.bold}>{calculatorState.condition.qualifier}</Text>
      </Text>

      {questions.map(([text, answer]: [string, string], questionI: number) => (
        <ListElement key={`calculator-${calculator.id}-question-${questionI}`}>
          <Text style={styles.body}>
            {text}: <Text style={styles.bold}>{answer}</Text>
          </Text>
        </ListElement>
      ))}
    </ListElement>
  )
}

const RecInlineElement: React.FC<{
  inlineEl: TRecInlineElement
  indexPath: string
}> = ({ inlineEl, indexPath }) => {
  if (typeof inlineEl === 'string') {
    return <>{inlineEl}</>
  } else if (inlineEl.type === 'grading') {
    return null
  } else {
    return null
  }
}

const RecBlockElement: React.FC<{
  blockEl: TRecBlockElement
  keyPrefix: string
  indexPath: string
  appendToText?: (
    indexPath: string,
    inlineEls: TRecInlineElement[],
  ) => React.ReactNode
}> = ({
  blockEl,
  keyPrefix,
  indexPath,
  appendToText = (_indexPath, _inlineEls) => null,
}) => {
    if (blockEl.type === 'text') {
      return (
        <Text style={styles.body}>
          {blockEl.els.map((inlineEl, inlineElI) => (
            <RecInlineElement
              inlineEl={inlineEl}
              key={`${keyPrefix}-i${inlineElI}`}
              indexPath={`${indexPath}.${inlineElI}`}
            />
          ))}

          {appendToText(indexPath, blockEl.els)}
        </Text>
      )
    }
    if (blockEl.type === 'list') {
      return (
        <>
          {blockEl.els.map((childBlockEl, childBlockElI) => (
            <ListElement key={`${keyPrefix}-b${childBlockElI}`}>
              <RecBlockElement
                blockEl={childBlockEl}
                keyPrefix={`${keyPrefix}-b${childBlockElI}`}
                indexPath={`${indexPath}.${childBlockElI}`}
                appendToText={appendToText}
              />
            </ListElement>
          ))}
        </>
      )
    }
    return null
  }

const TopicResult: React.FC<TopicResult> = ({
  id,
  title,
  introText,
  recommendationsResults,
}) => {
  return (
    <ListElement>
      <Text style={styles.body}>{title}</Text>

      <Wrap
        condition={!!introText}
        wrapper={(children) => (
          <ListElement>
            <Text style={styles.body}>{introText}</Text>
            {children}
          </ListElement>
        )}
      >
        {recommendationsResults.map(({ richtext, answer }, resultI) => (
          <ListElement key={`topic-${id}-r${resultI}`}>
            {richtext.map((blockEl, blockElI) => (
              <RecBlockElement
                blockEl={blockEl}
                keyPrefix={`topic-${id}-r${resultI}-b${blockElI}`}
                indexPath={`${blockElI}`}
                appendToText={(indexPath, inlineEls) => {
                  if (indexPath === '0') {
                    const fulltext = inlineEls
                      .filter((el) => typeof el === 'string')
                      .join(' ')

                    let prepend: string

                    if (fulltext.match(/\w\s*$/)) {
                      prepend = ': '
                    } else {
                      prepend = ' '
                    }

                    return (
                      <>
                        {prepend}
                        <Text style={styles.bold}>{answer}</Text>
                      </>
                    )
                  } else {
                    return null
                  }
                }}
              />
            ))}
          </ListElement>
        ))}
      </Wrap>
    </ListElement>
  )
}

const ProtocolReport: React.FC<{
  patientContext: React.Context<PatientType | null>,
  signName: string
  date: Date
  bundle: any
  protocol: any
  api: any
  protocolState: any
  children: (params: BlobProviderParams) => React.ReactNode
}> = ({
  patientContext,
  signName,
  date,
  bundle,
  protocol,
  api,
  protocolState,
  children,
}) => {
    const isoDate = getIsoDate(date)
    const patient = useContext(patientContext)
    const patientId = patient.id
    // useEffect(() => {
    //   ;(window as any).api = api
    //   ;(window as any).pathway = pathway
    //   ;(window as any).protocolState = protocolState
    //   console.log('Set api, pathway and protocolState to window', {
    //     api,
    //     pathway,
    //     protocolState,
    //   })
    // }, [])

    let criteriaResults = []

    for (const [criteriaNodeId, keypointNodeId] of Object.entries(
      protocolState.answers || [],
    )) {
      /*const criteriaNode = pathway.graph.find(
        (x: any) => x.type === 'node' && x.id === criteriaNodeId,
      )
      const keypointNode = pathway.graph.find(
        (x: any) => x.type === 'node' && x.id === keypointNodeId,
      )
      const answerEdge = pathway.graph.find(
        (x: any) => x.type === 'edge' && x.head === keypointNode.id,
      )

      const title = criteriaNode.keypoint.topic.name
      const answer = answerEdge.label
      const questions = criteriaNode.criteria.map(
        (criterion: any) => criterion.text,
      )

      criteriaResults.push({ title, answer, questions })*/
    }

    let recommendationsResultsByTopicId: {
      [id: string]: TopicResult
    } = {}

    for (const [recommendationId, state] of Object.entries(
      protocolState.recommendationsState || [],
    )) {
      const recommendation = api.Recommendation.elements.find(
        (x: any) => x.id === recommendationId,
      )
      const topic = recommendation.keypoint.topic
      const introText = recommendation.keypoint.introText ?? ''

      if (!recommendationsResultsByTopicId[topic.id]) {
        recommendationsResultsByTopicId[topic.id] = {
          id: topic.id,
          title: topic.name,
          introText,
          recommendationsResults: [],
        }
      }

      // @CHRIS HERE too tired to make it recursive. Is it even necessary right now?
      const richtext = recommendation.text as TRecRichtext

      const answer = state ? 'Yes' : ' No'
      recommendationsResultsByTopicId[topic.id].recommendationsResults.push({
        richtext,
        answer,
      })
    }

    let impressionsConsideredDiagnosesTopicResults: TopicResult[] = []
    let impressionsConfirmedDiagnosesTopicResults: TopicResult[] = []
    let planTopicResults: TopicResult[] = []

    for (const result of Object.values(recommendationsResultsByTopicId)) {

      const firstRecEl = result.recommendationsResults[0].richtext[0].els[0]
      const firstRecText = typeof firstRecEl == 'string' ? firstRecEl : ''

      if (
        result.introText.toLowerCase().match(/add/i) ||
        firstRecText.toLowerCase().match(/add/i)
      ) {
        if (result.introText.match(/considered/i)) {
          impressionsConsideredDiagnosesTopicResults.push(result)
          continue
        }

        if (
          result.introText.match(/confirmed/i) ||
          firstRecText.toLowerCase().match(/confirmed/i)
        ) {
          impressionsConfirmedDiagnosesTopicResults.push(result)
          continue
        }
      }

      planTopicResults.push(result)
    }

    // Remove all recommendations whose answer is 'Yes' from the plan
    // Also remove possibly resulting empty topicResults after, thus the while loop
    let planTopicResultI = 0
    while (planTopicResultI < planTopicResults.length) {
      planTopicResults[planTopicResultI].recommendationsResults =
        planTopicResults[planTopicResultI].recommendationsResults.filter(
          (recommendationResult) => recommendationResult.answer === 'Yes',
        )

      if (planTopicResults[planTopicResultI].recommendationsResults.length > 0) {
        planTopicResultI += 1
      } else {
        planTopicResults.splice(planTopicResultI, 1)
      }
    }

    const doc = (
      <Document>
        <ProtocolReportContext.Provider value={{ api, bundle, protocol, protocolState }}>
          <Page size="LETTER" style={styles.page}>
            <View style={styles.pageContainer}>
              <AssociativeTextTable
                labelColumnWidth={6 * rem}
                rows={[
                  { label: 'Patient ID', value: patientId },
                  { label: 'Date', value: isoDate },
                ]}
              />

              <Space h={1} />

              <Text style={styles.h1}>{bundle.name}</Text>
              <Text style={styles.body}>
                <Text style={styles.bold}>{protocol.name}</Text>
              </Text>

              <Space h={1} />

              <Text style={styles.h2}>Clinical Data</Text>

              <Space h={1} />

              {Object.entries(protocolState.calculatorStates).map(
                ([calculatorId, calculatorState]: [string, any]) => (
                  <CalculatorResult
                    calculatorId={calculatorId}
                    key={calculatorId}
                    calculatorState={calculatorState}
                  />
                ),
              )}

              {criteriaResults.map(
                ({ title, answer, questions }, criteriaResultI) => (
                  <ListElement key={`criteriaResult-${criteriaResultI}`}>
                    <Text style={styles.body}>{title}</Text>

                    {questions.map((question: string, questionI: number) => (
                      <ListElement
                        key={`criteriaResult-${criteriaResultI}-question-${questionI}`}
                      >
                        <Text style={styles.body}>{question}</Text>
                      </ListElement>
                    ))}

                    <ListElement>
                      <Text style={styles.bold}>{answer}</Text>
                    </ListElement>
                  </ListElement>
                ),
              )}

              {(impressionsConsideredDiagnosesTopicResults.length > 0 ||
                impressionsConfirmedDiagnosesTopicResults.length > 0) && (
                  <>
                    <Space h={1} />

                    <Text style={styles.h2} minPresenceAhead={2}>
                      Impression
                    </Text>

                    <View style={{ marginTop: -1 * rem }}>
                      {impressionsConsideredDiagnosesTopicResults.length > 0 && (
                        <>
                          <Space h={1} />

                          <Text style={styles.h3} minPresenceAhead={3}>
                            Diagnoses considered
                          </Text>

                          <Space h={1} />

                          {impressionsConsideredDiagnosesTopicResults.map(
                            (topicResult) => (
                              <TopicResult
                                key={`topicResult-${topicResult.id}`}
                                {...topicResult}
                              />
                            ),
                          )}
                        </>
                      )}

                      {impressionsConfirmedDiagnosesTopicResults.length > 0 && (
                        <>
                          <Space h={1} />

                          <Text style={styles.h3} minPresenceAhead={3}>
                            Confirmed diagnoses
                          </Text>

                          <Space h={1} />

                          {impressionsConfirmedDiagnosesTopicResults.map(
                            (topicResult) => (
                              <TopicResult
                                key={`topicResult-${topicResult.id}`}
                                {...topicResult}
                              />
                            ),
                          )}
                        </>
                      )}
                    </View>
                  </>
                )}

              <Space h={1} />

              <Text style={styles.h2}>Plan</Text>

              <Space h={1} />

              {planTopicResults.map((topicResult) => (
                <TopicResult
                  key={`topicResult-${topicResult.id}`}
                  {...topicResult}
                />
              ))}

              <Space h={1} />
              <AssociativeTextTable
                labelColumnWidth={6 * rem}
                rows={[
                  { label: 'Signed by', value: signName },
                  { label: 'Date', value: isoDate },
                ]}
              />
            </View>
          </Page>
        </ProtocolReportContext.Provider>
      </Document>
    )

    return <BlobProvider document={doc}>{children}</BlobProvider>
  }

export default ProtocolReport