import { Route } from 'libraries/smart-router/evm'
import { Box, IconButton, QuestionHelper, SearchIcon, Text } from 'components'
import { useModalV2 } from 'widgets/Modal'
import styled from 'styled-components'
import { memo } from 'react'

import { RowBetween } from 'components/Layout/Row'
import SwapRoute from 'views/Swap/components/SwapRoute'
import { RouteDisplayModal } from './RouteDisplayModal'

interface Props {
  routes?: Route[]
}

const RouteInfoContainer = styled(RowBetween)`
  padding: 0 8px 0;
`

export const RoutesBreakdown = memo(function RoutesBreakdown({ routes = [] }: Props) {
  const routeDisplayModal = useModalV2()

  if (!routes.length) {
    return null
  }

  const count = routes.length

  return (
    <>
      <RouteInfoContainer>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Text fontSize="14px" color="textSubtle">
            Route
          </Text>
          <QuestionHelper
            text='Route is automatically calculated based on your routing preference to achieve the best price for your trade.'
            ml="4px"
            placement="top-start"
          />
        </span>
        <Box onClick={routeDisplayModal.onOpen} role="button">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {count > 1 ? (
              <Text fontSize="14px">{count} Separate Routes</Text>
            ) : (
              <RouteComp route={routes[0]} />
            )}
            <IconButton ml="8px" variant="text" color="textSubtle" scale="xs">
              <SearchIcon width="16px" height="16px" color="textSubtle" />
            </IconButton>
          </span>
        </Box>
        <RouteDisplayModal {...routeDisplayModal} routes={routes} />
      </RouteInfoContainer>
    </>
  )
})

interface RouteProps {
  route: Route
}

function RouteComp({ route }: RouteProps) {
  const { path } = route

  return (
    <RowBetween>
      <SwapRoute path={path} />
    </RowBetween>
  )
}
