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
  Popover,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { COLORS } from '../muiTheme';
import { commonStyles } from '../components/style';
import TransactionSettings from './Settings';
import { reset as resetSwapState } from '../state/swap/actions';
import { reset as resetMintState } from '../state/mint/actions';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'rgba(0,0,0,0)',
    '& > .MuiToolbar-root': {
      width: '100%',
      justifyContent: 'space-around',
    },
  },
  paper: {
    backgroundColor: '#12234F',
  },
  logoContainer: {
    // flexGrow: 1,
  },
  walletButton: {
    width: '175px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: COLORS.secondary,
  },
  linksContainer: {
    display: 'flex',
    flexGrow: 1,
    margin: '0 96px',
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
    lineHeight: '18px',
    fontWeight: 600,
    textDecoration: 'none',
    margin: 0,
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
  const commonClasses = commonStyles();

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
  const [liquidityAnchorEl, setLiquidityAnchorEl] =
    useState<null | HTMLElement>(null);
  const liquidityMenuOpen = Boolean(liquidityAnchorEl);

  const [poolAnchorEl, setPoolAnchorEl] = useState<null | HTMLElement>(null);
  const poolMenuOpen = Boolean(poolAnchorEl);

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
          <h3
            onClick={(e) => setLiquidityAnchorEl(e.currentTarget)}
            className={classes.link}
            style={{ cursor: 'pointer' }}
          >
            Liquidity
          </h3>
          <Menu
            anchorEl={liquidityAnchorEl}
            open={liquidityMenuOpen}
            PopoverClasses={{ paper: classes.paper }}
            onClose={() => setLiquidityAnchorEl(null)}
          >
            <MenuItem
              onClick={() => setLiquidityAnchorEl(null)}
              style={{ width: '100%' }}
            >
              <Link
                component={NavLink}
                to="/add-liquidity"
                color="inherit"
                className={classes.link}
                onClick={() => {
                  dispatch(resetMintState());
                }}
              >
                Add liquidity
              </Link>
            </MenuItem>
            <MenuItem onClick={() => setLiquidityAnchorEl(null)}>
              <Link
                component={NavLink}
                to="/remove-liquidity"
                color="inherit"
                className={classes.link}
              >
                Remove Liquidity
              </Link>
            </MenuItem>
          </Menu>
          <h3
            onClick={(e) => setPoolAnchorEl(e.currentTarget)}
            className={classes.link}
            style={{ cursor: 'pointer' }}
          >
            Pools
          </h3>
          <Menu
            anchorEl={poolAnchorEl}
            open={poolMenuOpen}
            PopoverClasses={{ paper: classes.paper }}
            onClose={() => setPoolAnchorEl(null)}
          >
            <MenuItem onClick={() => setPoolAnchorEl(null)}>
              <Link
                component={NavLink}
                to="/pool"
                color="inherit"
                className={classes.link}
                style={{ padding: 0 }}
              >
                Pool
              </Link>
            </MenuItem>
            <MenuItem onClick={() => setPoolAnchorEl(null)}>
              <Link
                component={NavLink}
                to="/add-pool"
                color="inherit"
                className={classes.link}
              >
                Add Pool
              </Link>
            </MenuItem>
          </Menu>
          <Link
            component={NavLink}
            to="/docs"
            color="inherit"
            className={classes.link}
            onClick={() => {
              dispatch(resetMintState());
            }}
          >
            Docs
          </Link>
          <a
            href="https://discord.com/channels/1072030870938075247/1072033147144908810"
            color="inherit"
            target="_blank"
            className={classes.link}
          >
            Discord
          </a>
        </div>
        <div className={classes.buttonsContainer}>
          <WalletButton />
          <TransactionSettings />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
