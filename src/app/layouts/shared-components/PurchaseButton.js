import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import React from 'react';

function PurchaseButton({ className }) {
	return (
		<Button
			component="a"
			href="https://1.envato.market/zDGL6"
			target="_blank"
			rel="noreferrer noopener"
			role="button"
			className={clsx('normal-case', className)}
			variant="contained"
			color="secondary">
			<Icon className="text-16">shopping_cart</Icon>
			<span className="mx-4">FUSE React</span>
		</Button>
	);
}

PurchaseButton.propTypes = {
	className: PropTypes.instanceOf(Object)
};

PurchaseButton.defaultProps = {
	className: null
};

export default PurchaseButton;
