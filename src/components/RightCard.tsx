import React, { DragEvent, MouseEvent, useCallback, useState } from 'react'
import { Text, Box, IconButton } from '@chakra-ui/react'

import { RightCardProps } from '../types'
import siteConfig from '../config/site.config'
import { paddingLeft, paddingTop, cardWidth } from '../config/card.config'

const RightCard = (props: RightCardProps) => {
  const {
    id,
    savedId,
    lefticon,
    name,
    template,
    addedBranch,
    addedFilter,
    begin,
    position,
    isOpenProps,
  } = props.data
  const [isDragOver, setIsDragOver] = useState(false)
  const [moving, setMoving] = useState(props.isMoving)
  const [isAddBranch, setIsAddBranch] = useState(false)
  const templateIsDefault =
    template?.indexOf('${') > -1 || template?.length === 0

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const offsetY = event.pageY - position.y
      if (offsetY < 121) setIsAddBranch(true)
      else setIsAddBranch(false)
      if (!isDragOver) {
        setIsDragOver(!isDragOver)
      }
      props.onOver(id, savedId)
    },
    [id, savedId, position.y, props, isDragOver],
  )
  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (isDragOver) {
        setIsDragOver(!isDragOver)
      }
      props.onLeave()
    },
    [props, isDragOver],
  )
  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    props.onChangeProp(true)
    const clickOffsetX = event.pageX - paddingLeft - position.x
    const clickOffsetY = event.pageY - paddingTop - position.y
    const xButtonWidth = 43
    const topBarHeight = 51
    const topBarMargin = 20
    const xButtonEndX = cardWidth - topBarMargin
    const xButtonStartX = xButtonEndX - xButtonWidth
    const topBarStartY = topBarMargin
    const topBarEndY = topBarStartY + topBarHeight
    if (
      topBarMargin < clickOffsetX &&
      clickOffsetX < xButtonStartX &&
      topBarStartY < clickOffsetY &&
      clickOffsetY < topBarEndY
    ) {
      setMoving(true)
      props.onMouseDown(id, savedId)
    } else if (
      xButtonStartX < clickOffsetX &&
      clickOffsetX < xButtonEndX &&
      topBarStartY < clickOffsetY &&
      clickOffsetY < topBarEndY
    ) {
      setMoving(false)
    } else {
      props.onProp(id)
    }
  }
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (moving) {
      const { movementX, movementY, pageX, pageY } = event
      const ratioX = event.screenX / event.pageX
      const ratioY = event.screenY / event.pageY
      const ratio = ratioX < ratioY ? ratioX : ratioY
      props.onMouseMove(movementX, movementY, pageX, pageY, ratio, id, savedId)
    }
  }
  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    if (moving) {
      setMoving(false)
      props.onMouseUp()
    }
  }
  const blockElement: HTMLElement | null = document.getElementById(
    `block-${id}`,
  )
  const { offsetWidth, offsetHeight } = blockElement ?? {
    offsetWidth: 0,
    offsetHeight: 0,
  }
  const offsetXTemp = offsetWidth ? offsetWidth / 2 : 0
  const offsetYTemp = offsetHeight ? offsetHeight - 122 : 0

  return (
    <Box>
      <Box
        className="branchinfo"
        style={{ left: position.x - 30 + cardWidth / 2, top: position.y - 30 }}
      >
        {addedFilter}
      </Box>
      <Box
        className="branchinfo"
        style={{ left: position.x, top: position.y - 30 }}
      >
        {addedBranch}
      </Box>
      <Box
        id={`block-${id}`}
        className="blockelem noselect block rightcard"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          left: position?.x,
          top: position?.y,
          opacity: `${props.isSelected ? 0.5 : 1}`,
          border: `2px solid ${isOpenProps ? '#217CE8' : '#C5CCD0'}`,
        }}
      >
        <Box className="blockyleft">
          <IconButton colorScheme="white" aria-label="" sz="sm">
            <img src={lefticon} alt="NO" width="24px" height="24px" />
          </IconButton>
          <Text className="blockyname">{name}</Text>
        </Box>
        <Box className="blockyright">
          <IconButton
            colorScheme="white"
            aria-label="delete"
            sz="sm"
            onClick={() => props.onDeleteCard(id, savedId)}
          >
            <img
              src={`${siteConfig.baseUrl}/assets/close.svg`}
              alt="NO"
              width="24px"
              height="24px"
            />
          </IconButton>
        </Box>
        <Box mt="8px" className="blockydiv"></Box>
        <Box className="blockyinfo">
          <span className="blockyinfoTextLabel">{begin}</span>
          {templateIsDefault ? (
            <span className="blockyinfoTextLabel">
              {['Start', 'End', 'New patient'].includes(name) ? '' : '[...]'}
            </span>
          ) : (
            <span className="blockyinfoTextValue">
              {name == 'Filter'
                ? template.replace('Where ', '').replace(/ ,/g, '')
                : template}
            </span>
          )}
        </Box>
        {isAddBranch ? (
          <Box
            className={`indicator ${
              isDragOver || props.updatedId === id ? '' : 'invisible'
            }`}
            style={{
              pointerEvents: 'none',
              left: `${offsetXTemp - 7}px`,
              top: `${offsetYTemp}px`,
            }}
          ></Box>
        ) : (
          <Box
            className={`indicator ${
              isDragOver || props.updatedId === id ? '' : 'invisible'
            }`}
            style={{ pointerEvents: 'none', left: `${offsetXTemp - 7}px` }}
          ></Box>
        )}
      </Box>
    </Box>
  )
}
export default React.memo(RightCard)
