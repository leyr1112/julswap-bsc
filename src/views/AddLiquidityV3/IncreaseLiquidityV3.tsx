import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, CurrencyAmount, Percent } from 'libraries/swap-sdk'
import { AutoColumn, Box, Button, Card, CardBody, Flex } from 'components'
import { useModal } from 'widgets/Modal'
import { ConfirmationModalContent } from 'widgets/ConfirmationModalContent'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useV3PositionFromTokenId, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { FeeAmount, NonfungiblePositionManager } from 'libraries/v3-sdk'
import { useCallback, useState } from 'react'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useUserSlippage, useIsExpertMode } from 'utils/user'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/mint/actions'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContracts'
import { calculateGasMargin } from 'utils'
import { useRouter } from 'next/router'
// import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSendTransaction } from 'wagmi'
import Page from 'components/Layout/Page'
import { AppHeader } from 'components/App'
import styled from 'styled-components'
import AppBody from 'components/App/AppBody'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { formatRawAmount, formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { basisPointsToPercent } from 'utils/exchange'
import { hexToBigInt } from 'viem'
// import { isUserRejected } from 'utils/sentry'
import { isUserRejected } from 'utils/reject'
import { getViemClients } from 'utils/viem'

import { useV3MintActionHandlers } from './formViews/V3FormView/form/hooks/useV3MintActionHandlers'
import { PositionPreview } from './formViews/V3FormView/components/PositionPreview'
import LockedDeposit from './formViews/V3FormView/components/LockedDeposit'
import { V3SubmitButton } from './components/V3SubmitButton'
import { useV3FormState } from './formViews/V3FormView/form/reducer'

export const BodyWrapper = styled(Card)`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  padding: 4px 12px;
  max-width: 464px;
  width: 100%;
  z-index: 1;
`

interface AddLiquidityV3PropsType {
  currencyA: Currency | undefined | null
  currencyB: Currency | undefined | null
}

export default function IncreaseLiquidityV3({ currencyA: baseCurrency, currencyB }: AddLiquidityV3PropsType) {
  const router = useRouter()
  const { sendTransactionAsync } = useSendTransaction()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  const [, , feeAmountFromUrl, tokenId] = router.query.currency || []
  const expertMode = useIsExpertMode()

  const { account, chainId, isWrongNetwork } = useActiveWeb3React()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds, loading: tokenIdsInMCv3Loading } = useV3TokenIdsByAccount(
    masterchefV3?.address,
    account,
  )

  const [txHash, setTxHash] = useState<string>('')

  const addTransaction = useTransactionAdder()
  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined
  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigInt(tokenId) : undefined,
  )

  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB
  // mint state
  const formState = useV3FormState()
  const { independentField, typedValue } = formState

  const {
    dependentField,
    parsedAmounts,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
    currencyBalances,
  } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )
  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(noLiquidity)
  const isValid = !errorMessage && !invalidRange

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const positionManager = useV3NFTPositionManagerContract()
  const [allowedSlippage] = useUserSlippage() // custom from users

  const isStakedInMCv3 = Boolean(tokenId && stakedTokenIds.find((id) => id === BigInt(tokenId)))

  const manager = isStakedInMCv3 ? masterchefV3 : positionManager
  const interfaceManager = NonfungiblePositionManager

  const { approvalState: approvalA, approveCallback: approveACallback } = useApproveCallback(parsedAmounts[Field.CURRENCY_A], manager?.address)
  const { approvalState: approvalB, approveCallback: approveBCallback } = useApproveCallback(parsedAmounts[Field.CURRENCY_B], manager?.address)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const onIncrease = useCallback(async () => {
    if (!chainId || !sendTransactionAsync || !account || !interfaceManager || !manager) return

    if (tokenIdsInMCv3Loading || !positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? interfaceManager.addCallParameters(position, {
            tokenId,
            slippageTolerance: basisPointsToPercent(allowedSlippage),
            deadline: deadline[0]?.toString() ?? "0",
            useNative,
          })
          : interfaceManager.addCallParameters(position, {
            slippageTolerance: basisPointsToPercent(allowedSlippage),
            recipient: account,
            deadline: deadline[0]?.toString() ?? "0",
            useNative,
            createPool: noLiquidity,
          })

      setAttemptingTxn(true)
      getViemClients({ chainId })
        .estimateGas({
          account,
          to: manager.address,
          data: calldata,
          value: hexToBigInt(value),
        })
        .then((gasLimit) => {
          return sendTransactionAsync({
            account,
            to: manager.address,
            data: calldata,
            value: hexToBigInt(value),
            gas: calculateGasMargin(gasLimit),
            chainId,
          })
        })
        .then((response) => {
          const baseAmount = formatRawAmount(
            parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
            baseCurrency.decimals,
            4,
          )
          const quoteAmount = formatRawAmount(
            parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
            quoteCurrency.decimals,
            4,
          )

          setAttemptingTxn(false)
          addTransaction({ hash: response },
            {
              type: 'increase-liquidity-v3',
              summary: `Increase ${baseAmount} ${baseCurrency?.symbol} and ${quoteAmount} ${quoteCurrency?.symbol}`,
            })
          setTxHash(response)
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (!isUserRejected(error)) {
            console.error(error)
          }
        })
    }
  }, [account,
    addTransaction,
    allowedSlippage,
    baseCurrency,
    chainId,
    deadline,
    hasExistingPosition,
    interfaceManager,
    manager,
    noLiquidity,
    parsedAmounts,
    position,
    positionManager,
    quoteCurrency,
    sendTransactionAsync,
    tokenId,
    tokenIdsInMCv3Loading
  ])

  // const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  // const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      router.push('/pool')
    }
  }, [onFieldAInput, router, txHash])

  const pendingText = `Supplying ${!depositADisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, "en-US") : ''
    } ${!depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''} ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, "en-US") : ''
    } ${!depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''}`

  const [onPresentIncreaseLiquidityModal] = useModal(
    <TransactionConfirmationModal
      minWidth={['100%', null, '420px']}
      title="Increase Liquidity"
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => (
        <ConfirmationModalContent
          topContent={() =>
            position ? <PositionPreview position={position} inRange={!outOfRange} ticksAtLimit={ticksAtLimit} /> : null
          }
          bottomContent={() => (
            <Button width="100%" mt="16px" variant="primary" height="48px" onClick={onIncrease}>
              Increase
            </Button>
          )}
        />
      )}
      pendingText={pendingText}
    />,
    true,
    true,
    'TransactionConfirmationModalIncreaseLiquidity',
  )

  const handleButtonSubmit = useCallback(
    () => (expertMode ? onIncrease() : onPresentIncreaseLiquidityModal()),
    [expertMode, onIncrease, onPresentIncreaseLiquidityModal],
  )

  const buttons = (
    <V3SubmitButton
      addIsUnsupported={false}
      addIsWarning={false}
      account={account ?? undefined}
      isWrongNetwork={isWrongNetwork}
      approvalA={approvalA}
      approvalB={approvalB}
      isValid={isValid}
      showApprovalA={showApprovalA}
      approveACallback={approveACallback}
      currencies={currencies}
      approveBCallback={approveBCallback}
      showApprovalB={showApprovalB}
      parsedAmounts={parsedAmounts}
      onClick={handleButtonSubmit}
      attemptingTxn={attemptingTxn}
      errorMessage={errorMessage}
      buttonText='Increase'
      depositADisabled={depositADisabled}
      depositBDisabled={depositBDisabled}
    />
  )

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <BodyWrapper>
          <AppHeader
            backTo={`/pool/${tokenId}`}
            title={`Add ${currencies[Field.CURRENCY_A]?.symbol ?? ''}-${currencies[Field.CURRENCY_B]?.symbol ?? ''} Liquidity`}
            noConfig
          />{' '}
          <CardBody>
            <Box mb="16px">
              {existingPosition && (
                <PositionPreview
                  position={existingPosition}
                  title='Selected Range'
                  inRange={!outOfRange}
                  ticksAtLimit={ticksAtLimit}
                />
              )}
              <Box mt="16px">
                <LockedDeposit locked={depositADisabled} mb="8px">
                  <CurrencyInputPanel
                    disableCurrencySelect
                    showBUSD
                    maxAmount={maxAmounts[Field.CURRENCY_A]}
                    onMax={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')}
                    onPercentInput={(percent) =>
                      onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                    }
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onFieldAInput}
                    showQuickInputButton
                    showMaxButton
                    currency={currencies[Field.CURRENCY_A]}
                    id="add-liquidity-input-tokena"
                    showCommonBases
                    commonBasesType={CommonBasesType.LIQUIDITY}
                  />
                </LockedDeposit>
                <Box minHeight="3px" />
                <LockedDeposit locked={depositBDisabled} mt="8px">
                  <CurrencyInputPanel
                    disableCurrencySelect
                    showBUSD
                    maxAmount={maxAmounts[Field.CURRENCY_B]}
                    onMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}
                    onPercentInput={(percent) =>
                      onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                    }
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onUserInput={onFieldBInput}
                    showQuickInputButton
                    showMaxButton
                    currency={currencies[Field.CURRENCY_B]}
                    id="add-liquidity-input-tokenb"
                    showCommonBases
                    commonBasesType={CommonBasesType.LIQUIDITY}
                  />
                </LockedDeposit>
              </Box>
            </Box>
            <AutoColumn
              style={{
                flexGrow: 1,
              }}
            >
              {buttons}
            </AutoColumn>
          </CardBody>
        </BodyWrapper>
      </Flex>
    </Page>
  )
}
