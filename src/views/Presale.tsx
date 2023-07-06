import {
  Button,
  InputAdornment,
  LinearProgress,
  makeStyles,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { useAyinPresale } from '../hooks/useAyinPresale';
import { COLORS } from '../muiTheme';
import { bigIntToString } from '../utils/dex';

const useStyles = makeStyles((_theme) => ({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20%',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
    '& h1,h3,p': {
      padding: 0,
      margin: 0,
    },
  },
  buyContainer: {
    display: 'flex',
    flexGrow: 1,
    marginLeft: '64px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    height: '15px',
    width: '100%',
  },
  input: {
    '& .MuiInputBase-input': {
      fontFamily: 'Montserrat',
      fontSize: '25px',
      fontWeight: 500,
      lineHeight: '25px',
    },
  },
  inputIcon: {
    width: '12px',
  },
  buyButton: {
    backgroundColor: COLORS.secondary,
    fontFamily: 'Montserrat',
    marginTop: '24px',
    minWidth: '25%',
    alignSelf: 'flex-end',
  },
}));

function Presale() {
  const classes = useStyles();
  const [buyAmount, setBuyAmount] = useState('0.0');
  const { presaleState, ayinLeft, buyAyin, calculatePriceInAlph } =
    useAyinPresale();

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text === '') {
      setBuyAmount(text);
      return;
    }

    try {
      const number = parseEther(text);
      if (!number._isBigNumber) return;
      setBuyAmount(text);
    } catch {
      return;
    }
  };

  if (presaleState === undefined) {
    return <div>Wallet not connected</div>;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div>
          <h1>Some presale header</h1>
          {
            <h3>
              1 $AYIN = {bigIntToString(presaleState.alphPerToken, 18)} ALPH
            </h3>
          }
          <p>Some presale texh blah blah</p>
        </div>
        <div className={classes.buyContainer}>
          <Tooltip title={`Ayin left: ${ayinLeft}`}>
            <LinearProgress
              variant="determinate"
              value={
                100 -
                Number(
                  (presaleState.tokensSold * 100n) / presaleState.tokensForSale
                )
              }
              color="secondary"
              className={classes.progress}
            />
          </Tooltip>
          <TextField
            value={buyAmount}
            className={classes.input}
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img className={classes.inputIcon} src="/ayin-logo.png" />
                </InputAdornment>
              ),
            }}
            onChange={onAmountChange}
            onBlur={() => {
              if (buyAmount === '') {
                setBuyAmount('0.0');
              }
            }}
            fullWidth
          />
          <Button
            className={classes.buyButton}
            onClick={() => buyAyin(buyAmount)}
          >
            {buyAmount === '' || calculatePriceInAlph(buyAmount) <= 1n
              ? 'BUY'
              : bigIntToString(calculatePriceInAlph(buyAmount), 18) + ' ALPH'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Presale;
