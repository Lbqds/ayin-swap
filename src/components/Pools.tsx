import { Container, Paper, Typography, Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { useState, useCallback, useEffect, useMemo } from "react";
import { bigIntToString, PairTokenDecimals } from "../utils/dex";
import { commonStyles } from "./style";
import { TokenInfo } from "@alephium/token-list";
import { useTokenPairState } from "../state/useTokenPairState";
import TokenSelectDialog from "./TokenSelectDialog";
import { useAlephiumWallet, useAvailableBalances } from "../hooks/useAlephiumWallet";
import { CopyToClipboard } from 'react-copy-to-clipboard'

function shortContractId(id: string): string {
  return id.slice(0, 6) + '...' + id.slice(-6)
}

function Pool() {
  const commonClasses = commonStyles()
  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const { tokenPairState, getTokenPairStateError } = useTokenPairState(tokenAInfo, tokenBInfo)
  const wallet = useAlephiumWallet()
  const balance = useAvailableBalances()

  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo)
  }, [])

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, [])

  const tokenInfo = useMemo(() => {
    return <>
      {tokenPairState ? (
        <>
        <div className={commonClasses.notification}>
          <p className={commonClasses.leftAlign}>Token Pair Id:</p>
          <p className={commonClasses.rightAlign}>
            <CopyToClipboard text={tokenPairState.tokenPairId}>
              <Button style={{ background: 'transparent', height: '15px' }}>
                <span style={{ fontSize: "15px", fontFamily: "monospace" }}>{shortContractId(tokenPairState.tokenPairId)}</span>
              </Button>
            </CopyToClipboard>
          </p>
        </div>
        <div className={commonClasses.notification}>
          <p className={commonClasses.leftAlign}>{tokenPairState.token0Info.name}({tokenPairState.token0Info.symbol}) Reserve:</p>
          <p className={commonClasses.rightAlign}>{bigIntToString(tokenPairState.reserve0, tokenPairState.token0Info.decimals)}</p>
        </div>
        <div className={commonClasses.notification}>
          <p className={commonClasses.leftAlign}>{tokenPairState.token1Info.name}({tokenPairState.token1Info.symbol}) Reserve:</p>
          <p className={commonClasses.rightAlign}>{bigIntToString(tokenPairState.reserve1, tokenPairState.token1Info.decimals)}</p>
        </div>
        <div className={commonClasses.notification}>
          <p className={commonClasses.leftAlign}>Liquidity token total supply:</p>
          <p className={commonClasses.rightAlign}>{bigIntToString(tokenPairState.totalSupply, PairTokenDecimals)}</p>
        </div>
        </>
      ) : null}
    </>
  }, [tokenPairState, commonClasses])

  const tokenPairContent = (
    <div className={commonClasses.tokenPairContainer}>
      <TokenSelectDialog
        tokenId={tokenAInfo?.id}
        counterpart={tokenBInfo?.id}
        onChange={handleTokenAChange}
        tokenBalances={balance}
        mediumSize={true}
      />
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={balance}
        mediumSize={true}
      />
    </div>
  )

  return (
    <Container className={commonClasses.centeredContainer} maxWidth="sm">
      <div className={commonClasses.titleBar}></div>
      <Typography variant="h4" color="textSecondary">
        Pool
      </Typography>
      <div className={commonClasses.spacer} />
      <Paper className={commonClasses.mainPaper}>
        <div>
          {wallet === undefined ?
            <div>
              <Typography variant="h6" color="error" className={commonClasses.error}>
                Your wallet is not connected
              </Typography>
            </div> : null
          }
          <Collapse in={wallet !== undefined}>
            {
              <>
                {tokenPairContent}
                <div className={commonClasses.spacer} />
                {getTokenPairStateError ? (
                  (
                    <Typography variant="body2" color="error" className={commonClasses.error}>
                      {getTokenPairStateError}
                    </Typography>
                  )
                ) : tokenInfo}
              </>
            }
          </Collapse>
        </div>
      </Paper>
    </Container>
  );
}

export default Pool;
