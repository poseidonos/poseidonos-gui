import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: '#212121',
    boxShadow: theme.shadows[3],
    fontSize: 14,
    padding: theme.spacing(.75, 1.25),
    minWidth: "120px",
    maxWidth: "280px",
    wordSpacing: "9999px",
    "& span": {
      color: "#FFF",
      filter: "drop-shadow(-1px -1px 1px #E1E1E1)"
    }
  },
}))(Tooltip);

export default withStyles()(LightTooltip);
