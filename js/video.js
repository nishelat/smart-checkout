// Continuously stream the webcam to the user.
const video = document.querySelector("#video-element");
if(navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then((stream) => {
			video.srcObject = stream;
		})
		.catch((err) => {
			console.log("Video error: ", err);
		});
}