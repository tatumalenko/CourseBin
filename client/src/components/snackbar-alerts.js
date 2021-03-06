import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: fade(green[600], 0.8),
  },
  error: {
    backgroundColor: fade(theme.palette.error.dark, 0.8),
  },
  info: {
    backgroundColor: fade(theme.palette.primary.dark, 0.8),
  },
  warning: {
    backgroundColor: fade('#571D2E', 0.8), // amber[700],
  },
  icon: {
    fontSize: 18,
    verticalAlign: 'middle',
    color: '#e5b54b',
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
    color: '#e5b54b',
  },
  message: {
    fontSize: 12,
    color: '#e5b54b',
  },
});

function SnackbarAlertContent(props) {
  const {
    classes, className, message, onClose, variant, ...other
  } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={(
        <span id='client-snackbar' className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      )}
      action={[
        <IconButton
          key='close'
          aria-label='Close'
          color='inherit'
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

SnackbarAlertContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf([ 'success', 'warning', 'error', 'info' ]).isRequired,
};

const SnackbarAlertContentWrapper = withStyles(styles1)(SnackbarAlertContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class SnackbarAlert extends React.Component {
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const {
      classes, anchorOrigin, variant, message,
    } = this.props;
    const { open } = this.props;

    return (
      <div>
        <Snackbar
          anchorOrigin={anchorOrigin || {
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          <SnackbarAlertContentWrapper
            className={classes.margin}
            onClose={this.handleClose}
            variant={variant || 'error'}
            message={message || 'This is an error message!'}
          />
        </Snackbar>
      </div>
    );
  }
}

SnackbarAlert.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(SnackbarAlert);
