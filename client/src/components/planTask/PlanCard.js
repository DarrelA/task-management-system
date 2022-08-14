import {
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';

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
  text: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' },
});

const PlanCard = (props) => {
  const { plans, App_Acronym } = props;

  const classes = useStyles();

  const [expandPlanCard, setExpandPlanCard] = useState(true);

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
            <Grid
              container
              spacing={1}
              justifyContent="center"
              style={{ paddingLeft: 10, paddingRight: 10 }}
            >
              <Typography variant="h4">PLANS</Typography>
              <Button
                size="small"
                type="button"
                onClick={() => setExpandPlanCard(!expandPlanCard)}
              >
                <span className="material-icons">
                  {!expandPlanCard ? 'visibility' : 'visibility_off'}
                </span>
              </Button>
            </Grid>

            <Collapse in={expandPlanCard} timeout="auto" unmountOnExit>
              <CardContent className={classes.plansCardContent}>
                {plans?.map((plan) => (
                  <Grid
                    container
                    spacing={2}
                    key={plan.Plan_MVP_name}
                    style={{ border: `0.4rem solid ${plan?.Plan_color}` }}
                    className={classes.planContent}
                  >
                    <Grid
                      container
                      item
                      xs={12}
                      className={classes.text}
                      style={{ justifyContent: 'center' }}
                    >
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
            </Collapse>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default PlanCard;
