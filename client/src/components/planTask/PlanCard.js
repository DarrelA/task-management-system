import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: { maxWidth: 1400, padding: 10, margin: 10 },

  planContent: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-around',
    minHeight: 150,
    maxWidth: 800,
  },
});

const PlanCard = (props) => {
  const { plans, App_Acronym, setEditPlanMode, openPlanModalHandler } = props;

  const classes = useStyles();

  return (
    <>
      <Grid container spacing={1} justifyContent="center">
        <Card className={classes.root} variant="outlined" key={App_Acronym}>
          <CardContent className={classes.cardContent1}>
            {plans?.map((plan) => (
              <Grid
                container
                spacing={1}
                justifyContent="center"
                className={classes.planContent}
                key={plan.Plan_MVP_name}
              >
                <Typography>{plan.Plan_MVP_name}</Typography>

                <CardActions className={classes.cardActions}>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditPlanMode({ ...plan, edit: true });
                      openPlanModalHandler();
                    }}
                  >
                    <span className="material-icons">edit</span>
                  </Button>
                </CardActions>
              </Grid>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default PlanCard;
