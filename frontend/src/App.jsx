import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

import './App.css';

const ffmpeg = createFFmpeg({
	log: true,
});

function App() {
	const [ready, setReady] = useState(false);
	const [video, setVideo] = useState();
	const [gif, setGif] = useState();
	const [deviceType, setDeviceType] = useState();

	const load = async () => {
		await ffmpeg.load();
		setReady(true);
	};

	const convertToGif = async () => {
		// Write the file to memory
		ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

		// Run the FFmpeg command
		await ffmpeg.run(
			'-i',
			'test.mp4',
			'-t',
			'2.5',
			'-ss',
			'2.0',
			'-f',
			'gif',
			'output.gif'
		);

		// Read the file from memory
		const data = await ffmpeg.FS('readFile', 'output.gif');

		// Create a URL
		const url = URL.createObjectURL(
			new Blob([data], { type: 'image/gif' })
		);
		setGif(url);
	};

	useEffect(() => {
		const devices = navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				let deviceArray = [];
				devices.forEach((device) => {
					if (device.kind === 'videoinput') {
						deviceArray.push(device.kind);
					}
				});
				return deviceArray;
			});
		if (devices.length > 1) {
			setDeviceType('mobile');
		} else {
			load();
		}
	}, []);

	return ready ? (
		deviceType !== 'mobile' ? (
			<div className='App'>
				{video && (
					<video
						controls
						width='250'
						src={URL.createObjectURL(video)}
					/>
				)}
				<input
					type='file'
					onChange={(e) => setVideo(e.target.files?.item(0))}
				/>
				<h3>Result</h3>
				<button onClick={convertToGif}>Convert</button>
				{gif && (
					<div>
						<img src={gif} />
						<button
							onClick={() => {
								const a = document.createElement('a');
								a.href = gif;
								let filename = Date.now();
								a.download = `${filename}.gif`;
								a.click();
							}}
						>
							Download
						</button>
					</div>
				)}
			</div>
		) : (
			<p>
				Unfortunately this app currently does not support mobile devices
				😭
			</p>
		)
	) : (
		<p>Loading...</p>
	);
}

export default App;
