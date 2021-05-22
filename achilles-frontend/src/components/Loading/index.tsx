import { Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import { Player } from '@lottiefiles/react-lottie-player';
import loading from './loading.gif';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#ffffff',
  },
  media: {
    height: theme.spacing(40),
  },
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={true}>
      {/* <Player
        loop
        autoplay
        background="transparent"
        speed={1}
        src={require("./loading.json")}
        style={{ height: "500px", width: "500px" }}
      ></Player> */}
      <img src={loading} className={classes.media} alt="loading..." />
    </Backdrop>
  );
};

export default Loading;
