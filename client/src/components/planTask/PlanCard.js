import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: { display: 'flex', maxWidth: 1400, padding: 10, margin: 10 },

  plansCardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 180,
    width: 1340,
  },

  planContent: {
    width: 240,
    minWidth: 240,
    height: 120,
    maxHeight: 120,
    margin: 5,
    borderRadius: '12px',
    backgroundColor: '#456C86',
    alignSelf: 'center',
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
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="h4">PLANS</Typography>
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
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default PlanCard;
