/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Grid, IconButton, Avatar } from "@material-ui/core";
// import { makeStyles } from "@material-ui/styles";
// import { Clear as ClearIcon } from "@material-ui/icons";

import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { DashboardModal } from '@uppy/react';

import { XHR_UPLOAD_SERVER_API_BASE } from '../../apiurl/baseurl';

// import { formatBytes } from "../../helpers/utils";
/* eslint-disable import/first */
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

let uppyAvatar;
let uppyFiles;

// const useStyles = makeStyles(theme => ({
//   upload: {
//     marginTop: theme.spacing(2),
//   },
// }));

const Upload = props => {
	const { multiple, accept, upload, uploadCancel, otherProps, companion } = props;

	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		if (multiple) {
			uppyFiles = Uppy({
				id: 'uppyFiles'
				// debug: process.env.NODE_ENV === 'development'
			});

			if (companion === 'XHR') {
				uppyFiles.use(XHRUpload, {
					endpoint: `${XHR_UPLOAD_SERVER_API_BASE}/api/v1/upload`,
					formData: true,
					limit: 10,
					fieldName: 'files'
				});
			} else if (companion === 'S3') {
				uppyFiles.use(AwsS3Multipart, {
					limit: 4,
					companionUrl: `${XHR_UPLOAD_SERVER_API_BASE}/api/uppy-companion`
				});
			}

			uppyFiles.on('file-added', () => {
				// console.log('file-added');
			});

			uppyFiles.on('upload-success', () => {
				// console.log("upload-success");
			});

			uppyFiles.on('complete', result => {
				if (companion === 'XHR') {
					if (result && result.successful && result.successful.length > 0) {
						const uploadedFile = [];
						for (let i = 0; i < result.successful.length; i += 1) {
							const fileResult = result.successful[i].response.body.Files[0];
							// fileResult.file.action = 'add';
							uploadedFile.push(fileResult);
						}

						setModalOpen(false);
						const timer = setTimeout(() => {
							clearTimeout(timer);
							upload(uploadedFile, otherProps);
						}, 100);
					}
				} else if (companion === 'S3') {
					if (result && result.successful && result.successful.length > 0) {
						const uploadedFile = [];

						for (let i = 0; i < result.successful.length; i += 1) {
							const fileResult = { Action: 'Add' };
							fileResult.File = result.successful[i].uploadURL;
							fileResult.MimeType = result.successful[i].type;
							fileResult.OriginalName = result.successful[i].name;
							fileResult.Size = result.successful[i].size;

							uploadedFile.push(fileResult);
						}

						setModalOpen(false);
						const timer = setTimeout(() => {
							clearTimeout(timer);
							upload(uploadedFile, otherProps);
						}, 100);
					}
				}

				// console.log("complete");
			});

			// uppyFiles.on('file-removed', (file, c, d) => {
			// 	 console.log("file-removed");
			// });

			if (uppyFiles) {
				setModalOpen(true);
			}
		} else {
			uppyAvatar = Uppy({
				meta: { type: 'avatar' },
				restrictions: {
					maxNumberOfFiles: 1,
					allowedFileTypes: accept
				},
				autoProceed: true,
				id: 'uppyAvatar',
				note: 'Images and video only, 2–3 files, up to 1 MB'
				// debug: process.env.NODE_ENV === 'development'
			});

			// uppyAvatar.use(Tus, { endpoint: "https://master.tus.io/files" });

			if (companion === 'XHR') {
				uppyAvatar.use(XHRUpload, {
					endpoint: `${XHR_UPLOAD_SERVER_API_BASE}/api/v1/upload`,
					formData: true,
					limit: 1,
					fieldName: 'files'
				});
			} else if (companion === 'S3') {
				uppyAvatar.use(AwsS3Multipart, {
					limit: 4,
					companionUrl: `${XHR_UPLOAD_SERVER_API_BASE}/api/uppy-companion`
				});
			}

			uppyAvatar.on('file-added', () => {
				// console.log('file-added');
			});

			uppyAvatar.on('upload-success', () => {
				// console.log('upload-success');
			});

			uppyAvatar.on('complete', result => {
				// console.log('complete', result);
				if (companion === 'XHR') {
					if (result && result.successful && result.successful.length > 0) {
						const fileResult = result.successful[0].response.body.Files[0];
						// fileResult.file.action = 'add';
						const uploadedFile = [fileResult];
						if (upload) {
							setModalOpen(false);
							const timer = setTimeout(() => {
								clearTimeout(timer);
								upload(uploadedFile, otherProps);
							}, 100);
						}
					}
				} else if (companion === 'S3') {
					if (result && result.successful && result.successful.length > 0) {
						const fileResult = { Action: 'Add' };
						fileResult.File = result.successful[0].uploadURL;
						fileResult.MimeType = result.successful[0].type;
						fileResult.OriginalName = result.successful[0].name;
						fileResult.Size = result.successful[0].size;
						// fileResult.file.action = 'add';
						const uploadedFile = [fileResult];

						if (upload) {
							setModalOpen(false);
							const timer = setTimeout(() => {
								clearTimeout(timer);
								upload(uploadedFile, otherProps);
							}, 100);
						}
					}
				}
			});

			if (uppyAvatar) {
				setModalOpen(true);
			}
		}

		return () => {
			if (multiple) {
				uppyFiles.close();
			} else {
				uppyAvatar.close();
			}
			setModalOpen(false);
		};
	}, []);

	const handleClose = () => {
		uppyAvatar.close();
		setModalOpen(false);

		if (uploadCancel) {
			uploadCancel();
		}
	};

	const handleFilesClose = () => {
		uppyFiles.close();
		setModalOpen(false);

		if (uploadCancel) {
			uploadCancel();
		}
	};

	return (
		<>
			{multiple ? (
				<>
					{uppyFiles && (
						<DashboardModal
							trigger="#fileupload"
							uppy={uppyFiles}
							plugins={[]}
							open={modalOpen}
							onRequestClose={handleFilesClose}
							closeModalOnClickOutside
							proudlyDisplayPoweredByUppy={false}
							showProgressDetails
						/>
					)}
				</>
			) : (
				<>
					{uppyAvatar && (
						<DashboardModal
							trigger="#fileupload"
							uppy={uppyAvatar}
							plugins={[]}
							open={modalOpen}
							onRequestClose={handleClose}
							closeModalOnClickOutside
							proudlyDisplayPoweredByUppy={false}
							showProgressDetails
							hideUploadButton
							showSelectedFiles={false}
						/>
					)}
				</>
			)}
		</>
	);
};

Upload.propTypes = {
	upload: PropTypes.func,
	uploadCancel: PropTypes.func,
	multiple: PropTypes.bool,
	accept: PropTypes.instanceOf(Array),
	otherProps: PropTypes.instanceOf(Object),
	companion: PropTypes.string
};

Upload.defaultProps = {
	upload: null,
	uploadCancel: null,
	multiple: false,
	accept: null,
	otherProps: null,
	companion: 'S3'
};

export default Upload;
