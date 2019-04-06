import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const childBox = props => (
  <div className='box-container'>
    <Grid container>
      <Grid item xs={12}>
        <Grid container>
          <Card className='card-container'>
            <CardContent>
              <Typography color='inherit'>
                {props.titleClass}
              </Typography>
              <Typography color='inherit'>
                {props.subject}
              </Typography>
              <Typography color='inherit'>
                {props.semester}
              </Typography>
              <Typography color='inherit'>
                {props.lecture}
              </Typography>
              <Typography color='inherit'>
                {props.tutorial}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default childBox;
