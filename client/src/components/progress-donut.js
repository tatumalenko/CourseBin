import React, { Component } from 'react';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class ProgressDonut extends Component {
  render() {
    const { data, classes } = this.props;
    return (
      <div className={classes.root}>
        <RadialBarChart
          width={250}
          height={250}
          cx='50%'
          cy='50%'
          outerRadius={100}
          innerRadius={70}
          barSize={30}
          data={data}
          startAngle={0}
        >
          <PolarAngleAxis
            type='number'
            domain={[ 0, 100 ]}
            dataKey='percent'
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            angleAxisId={0}

            minAngle={0}
            label={{ fill: '#ccc', position: 'outside' }}
            background
            clockWise
            dataKey='percent'
          />
        </RadialBarChart>
      </div>
    );
  }
}

ProgressDonut.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressDonut);
