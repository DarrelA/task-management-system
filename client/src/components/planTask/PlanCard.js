import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: { display: 'flex', maxWidth: 1400, padding: 10, margin: 10 },

  plansCardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 362,
    width: 1332,
  },

  planContent: {
    width: 240,
    minWidth: 240,
    maxHeight: 145,
    padding: 5,
    margin: 10,
    borderRadius: '12px',
  },

  cardActions: { display: 'flex', justifyContent: 'flex-end' },
});

const PlanCard = (props) => {
  const { plans, App_Acronym } = props;

  const classes = useStyles();

  return (
    <>
      <Grid container spacing={1} justifyContent="center">
        <Card className={classes.root} variant="outlined" key={App_Acronym}>
          <CardContent className={classes.plansCardContent}>
            {plans?.map((plan) => (
              <Grid
                container
                spacing={2}
                key={plan.Plan_MVP_name}
                style={{ border: `0.4rem solid ${plan?.Plan_color}` }}
                className={classes.planContent}
              >
                <Grid container item xs={12} style={{ justifyContent: 'center' }}>
                  <Typography>{plan.Plan_MVP_name}</Typography>
                </Grid>

                <Grid container item xs={6} style={{ justifyContent: 'center' }}>
                  <Typography>{plan.Plan_startDate}</Typography>
                </Grid>
                <Grid container item xs={6} style={{ justifyContent: 'center' }}>
                  <Typography>{plan.Plan_endDate}</Typography>
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default PlanCard;
