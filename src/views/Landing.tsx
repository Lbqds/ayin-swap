import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 187px',
  },
  text: {
    display: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '814px',
    fontSize: '30px',
    lineHeight: '36px',
    '& > *': {
      margin: 0,
      padding: 0,
    },
    '& > h1': {
      fontFamily: 'Montserrat',
      fontWeight: 800,
      lineHeight: '90px',
      fontSize: '78px',
      marginBottom: '31px',
    },
  },
}));

function Landing() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.text}>
        <h1>Decentralized crypto trading made better: swap, earn, build.</h1>
        <p>
          Revolutionize your crypto trading experience with the leading
          decentralized protocol, where you can seamlessly swap, earn, and
          build.
        </p>
      </div>
      <div>
        <img src="/ayin-logo.png" height={312} />
      </div>
    </div>
  );
}

export default Landing;
