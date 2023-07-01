import {
  AlephiumConnectButton,
  useAlephiumConnectContext,
  useConnect,
} from '@alephium/web3-react';
import {
  AppBar,
  Hidden,
  Link,
  Button,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { COLORS } from '../muiTheme';
import TransactionSettings from './Settings';
import { reset as resetSwapState } from '../state/swap/actions';
import { reset as resetMintState } from '../state/mint/actions';

const useStyles = makeStyles((theme) => ({
  spacer: {
    flexGrow: 1,
  },
  appBar: {
    background: 'rgba(0,0,0,0)',
    '& > .MuiToolbar-root': {
      width: '100%',
    },
  },
  logoContainer: {
    flexGrow: 1,
  },
  walletButton: {
    width: '175px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: COLORS.secondary,
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    position: 'relative',
    color: '#fff',
    fontSize: '18px',
    marginLeft: theme.spacing(6),
    lineHeight: '18px',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(2.5),
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      width: '0%',
      height: '3px',
      background: 'linear-gradient(to right, #7E8FA9, #A988A2)',
      borderRadius: '3px',
      transition: 'width 0.2s',
      transform: 'translateX(-50%)',
    },
    '&.active,&:hover': {
      textDecoration: 'none',
      '&::after': {
        width: '70%',
      },
    },
  },
}));

const WalletButton = () => {
  const context = useAlephiumConnectContext();
  const { connect, disconnect } = useConnect({
    addressGroup: context.addressGroup,
    keyType: context.keyType,
    networkId: context.network,
  });

  const classes = useStyles();

  return (
    <AlephiumConnectButton.Custom displayAccount={(account) => account.address}>
      {({ isConnected, truncatedAddress }) => {
        return isConnected ? (
          <Button className={classes.walletButton} onClick={disconnect}>
            {truncatedAddress}
          </Button>
        ) : (
          <Button className={classes.walletButton} onClick={connect}>
            Connect
          </Button>
        );
      }}
    </AlephiumConnectButton.Custom>
  );
};

function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <AppBar
      position="static"
      color="inherit"
      className={classes.appBar}
      elevation={0}
    >
      <Toolbar style={{ margin: 0 }}>
        <div className={classes.logoContainer}>
          <Link to="/" color="inherit" component={NavLink}>
            <img src="/ayinlogo-transparent.png" width={64} />
          </Link>
        </div>
        <Hidden implementation="css" xsDown>
          <div className={classes.linksContainer}>
            <Link
              component={NavLink}
              to="/presale"
              color="inherit"
              className={classes.link}
            >
              Presale
            </Link>
            <Link
              component={NavLink}
              to="/swap"
              color="inherit"
              className={classes.link}
              onClick={() => {
                dispatch(resetSwapState());
              }}
            >
              Trade
            </Link>
            <Link
              component={NavLink}
              to="/stake"
              color="inherit"
              className={classes.link}
            >
              Stake LP
            </Link>
            <Link
              component={NavLink}
              to="/xayin"
              color="inherit"
              className={classes.link}
            >
              XAYIN
            </Link>
            <Link
              component={NavLink}
              to="/add-liquidity"
              color="inherit"
              className={classes.link}
              onClick={() => {
                dispatch(resetMintState());
              }}
            >
              Pool
            </Link>
            <Link
              component={NavLink}
              to="/add-liquidity"
              color="inherit"
              className={classes.link}
              onClick={() => {
                dispatch(resetMintState());
              }}
            >
              Docs
            </Link>
            <Link
              component={NavLink}
              to="/add-liquidity"
              color="inherit"
              className={classes.link}
              onClick={() => {
                dispatch(resetMintState());
              }}
            >
              Discord
            </Link>
            {/* <Link */}
            {/*   component={NavLink} */}
            {/*   to="/remove-liquidity" */}
            {/*   color="inherit" */}
            {/*   className={classes.link} */}
            {/* > */}
            {/*   Remove Liquidity */}
            {/* </Link> */}
            {/* <Link */}
            {/*   component={NavLink} */}
            {/*   to="/add-pool" */}
            {/*   color="inherit" */}
            {/*   className={classes.link} */}
            {/* > */}
            {/*   Add Pool */}
            {/* </Link> */}
            {/* <Link */}
            {/*   component={NavLink} */}
            {/*   to="/pool" */}
            {/*   color="inherit" */}
            {/*   className={classes.link} */}
            {/* > */}
            {/*   Pool */}
            {/* </Link> */}
          </div>
        </Hidden>
        <div className={classes.spacer} />
        <div className={classes.buttonsContainer}>
          <WalletButton />
          <TransactionSettings />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
