import PropTypes from 'prop-types';
import React from 'react';
import FuseLoading from '../FuseLoading';

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */ function FuseSuspense(props) {
	// eslint-disable-next-line
	return <React.Suspense fallback={<FuseLoading {...props.loadingProps} />}>{props.children}</React.Suspense>;
}

FuseSuspense.propTypes = {
	loadingProps: PropTypes.instanceOf(Object),
	children: PropTypes.instanceOf(Object)
};

FuseSuspense.defaultProps = {
	loadingProps: {
		delay: 0
	},
	children: null
};

export default FuseSuspense;
