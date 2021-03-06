import _ from '../../@lodash';

export const formatBytes = (bytes, decimals) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals <= 0 ? 0 : decimals || 2;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	// eslint-disable-next-line no-restricted-properties
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const ObjecttoQueryString = obj => {
	const QueryString = Object.keys(obj)
		// eslint-disable-next-line func-names
		.map(function (key) {
			return `${key}=${obj[key]}`;
		})
		.join('&');

	return QueryString;
};

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export const difference = (origObj, newObj) => {
	// eslint-disable-next-line no-shadow
	function changes(newObj, origObj) {
		let arrayIndexCounter = 0;
		// eslint-disable-next-line func-names
		return _.transform(newObj, function (result, value, key) {
			if (!_.isEqual(value, origObj[key])) {
				// eslint-disable-next-line no-plusplus
				const resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key;

				// eslint-disable-next-line no-param-reassign
				result[resultKey] =
					_.isObject(value) && _.isObject(origObj[key]) ? changes(value, origObj[key]) : value;
			}
		});
	}
	return changes(newObj, origObj);
};

export const isPermission = (rules, perform) => {
	try {
		const permissions = rules.Permission;

		if (!permissions) {
			return false;
		}

		const can = permissions.includes(perform);
		return can;
	} catch (e) {
		return false;
	}
};

const mapOut = (sourceObject, removeKeys) => {
	const sourceKeys = Object.keys(sourceObject);
	const returnKeys = sourceKeys.filter(k => removeKeys.includes(k));
	const returnObject = {};
	returnKeys.forEach(k => {
		returnObject[k] = sourceObject[k];
	});
	return returnObject;
};

export const omit = (object, keys) => {
	const newArray = object.map(obj => mapOut(obj, keys));
	return newArray;
};

export const removeObjectFromArray = (array, key, value) => {
	const index = array.findIndex(obj => obj[key] === value);
	return index >= 0 ? [...array.slice(0, index), ...array.slice(index + 1)] : array;
};

export const autoCompleteHandleChange = (isAdd, value, formState, reason, id) => {
	let newDefaultValue;
	let newValue;

	if (reason === 'select-option') {
		// ADD

		if (!isAdd) {
			// Add inside Add
			newValue = value.map(obj => (!obj.Action ? { ...obj, Action: 'Add' } : { ...obj }));
			newDefaultValue = newValue;
		} else {
			const exProducts = [...formState];
			const tempArr = [];
			// console.log(formState.values);
			// console.log(exProducts);
			value.forEach(element => {
				const obj = exProducts.find(o => o[id] === element[id]);
				if (!obj) {
					const newElement = { ...element, Action: 'Add' };
					tempArr.push(newElement);
				} else if (obj.Action && obj.Action === 'Delete') {
					const newElement = { ...obj };
					delete newElement.Action;
					exProducts.splice(
						exProducts.findIndex(a => a[id] === obj[id]),
						1
					);
					tempArr.push(newElement);
				}
			});

			// console.log(exProducts, tempArr);
			newValue = [...exProducts, ...tempArr];

			newDefaultValue = newValue.filter(obj => (obj.Action && obj.Action !== 'Delete') || !obj.Action);
			// console.log(newValue);
			// console.log(newDefaultValue);
		}
	} else if (reason === 'remove-option') {
		if (!isAdd) {
			// Remove inside Add
			newValue = value.map(obj => ({ ...obj, Action: 'Add' }));
			newDefaultValue = newValue;
		} else if (isAdd) {
			const exProducts = [...formState];
			const tempArr = [];

			exProducts.forEach(element => {
				const obj = value.find(o => o[id] === element[id]);
				if (!obj) {
					if (!element.Action) {
						const newElement = { ...element, Action: 'Delete' };
						tempArr.push(newElement);
					} else if (element.Action && element.Action === 'Delete') {
						tempArr.push(element);
					}
				} else {
					tempArr.push(element);
				}
			});
			newValue = tempArr;
			newDefaultValue = tempArr.filter(obj => (obj.Action && obj.Action !== 'Delete') || !obj.Action);
		}
	} else if (reason === 'clear') {
		if (!isAdd) {
			newDefaultValue = [];
			newValue = [];
		} else {
			const exProducts = [...formState];
			const tempArr = [];

			exProducts.forEach(element => {
				if (!element.Action) {
					const newElement = { ...element, Action: 'Delete' };
					tempArr.push(newElement);
				} else if (element.Action && element.Action === 'Delete') {
					tempArr.push(element);
				}
			});

			newDefaultValue = [];
			newValue = tempArr;
		}
	}
	return { newValue, newDefaultValue };
};

export const groupBy = (array, f) => {
	return array.reduce(
		/* eslint-disable */
		(r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
		{}
	);
};
