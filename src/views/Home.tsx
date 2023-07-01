import { makeStyles } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';
import Swap from '../components/Swap';
import AddLiquidity from '../components/AddLiquidity';
import RemoveLiquidity from '../components/RemoveLiquidity';
import AddPool from '../components/AddPool';
import Pool from '../components/Pools';
import Header from '../components/Header';
import Presale from './Presale';
import Staking from './Staking';
import LiquidStaking from './LiquidStaking';
import Landing from './Landing';

const useStyles = makeStyles((_theme) => ({
  bg: {
    background:
      'linear-gradient(160deg, rgba(34,37,58,.1) 0%, rgba(69,73,89,.1) 33%, rgba(34,37,58,.1) 66%, rgba(49,52,71,.1) 100%), linear-gradient(45deg, rgba(76,34,128,.1) 0%, rgba(69,49,115,.1) 20%, rgba(0,104,70,.1) 100%)',
    backgroundImage: 'url(bg.png)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    scrollBehavior: 'auto',
    margin: 0,
    padding: 0,
    overflow: 'auto',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.bg}>
      <Header />
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/swap">
          <Swap />
        </Route>
        <Route exact path="/presale">
          <Presale />
        </Route>
        <Route exact path="/stake">
          <Staking />
        </Route>
        <Route exact path="/xayin">
          <LiquidStaking />
        </Route>
        <Route exact path="/add-liquidity">
          <AddLiquidity />
        </Route>
        <Route exact path="/remove-liquidity">
          <RemoveLiquidity />
        </Route>
        <Route exact path="/add-pool">
          <AddPool />
        </Route>
        <Route exact path="/pool">
          <Pool />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default Home;
