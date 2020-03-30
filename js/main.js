// Start the process when the run button is clicked.
$("#run-button").click(() => {
	$("#run-button").html("LOADING...");
	// Hide all the entries.
	$("#visual-info").hide("");
	$("#ad-container").hide("");
	$("#fashion-ad-info").hide("");
	$("#uber-ad-info").hide("");
	$("#sports-ad-info").hide("");
	performAnalysis();
});

// Take a snapshot of the user, extract the appropriate data, and invoke the 
// SageMaker endpoints using the APIs.
function performAnalysis() {
	// First, capture the image from the video stream.
	const canvas = document.createElement("canvas");
	const video = $("#video-element").get(0);
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	// Next, prepare the image for Amazon Rekognition.
	const image = atob(canvas.toDataURL().split("data:image/png;base64,")[1]);
	const length = image.length;
	imageData = new ArrayBuffer(length);
	const ua = new Uint8Array(imageData);
	for(let i = 0; i < length; i++) {
		ua[i] = image.charCodeAt(i);
	}
	// Finally, login to AWS anonymously and run Amazon Rekognition.
	loginAnonymously();
	AWS.region = REGION;
	const rekognition = new AWS.Rekognition();
	const params = {
		Image: {
			Bytes: imageData
		},
		Attributes: [
			'ALL',
		]
	};
	rekognition.detectFaces(params, function (err, data) {
		if(err) console.log(err, err.stack);
		else invokeEndpoints(data);
	});
}

// Login anonymously to AWS.
function loginAnonymously() {
	AWS.config.region = REGION;
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: IDENTITY_POOL_ID,
	});
	AWS.config.credentials.get(() => {
		const accessKeyId = AWS.config.credentials.accessKeyId;
		const secretAccessKey = AWS.config.credentials.secretAccessKey;
		const sessionToken = AWS.config.credentials.sessionToken;
	});
}

// Given gender, age, and household income data, invoke the APIs integrated
// with the SageMaker propensity models and display the results.
function invokeEndpoints(data) {
	// Process the gender data.
	const genderDisplay = data.FaceDetails[0].Gender.Value.toLowerCase();
	const genderInput = (genderDisplay == "female") ? 0 : 1;
	// Process the age data.
	const ageLowDisplay = data.FaceDetails[0].AgeRange.Low;
	const ageHighDisplay = data.FaceDetails[0].AgeRange.High;
	const averageAge = (ageLowDisplay + ageHighDisplay) / 2;
	const ageInput = convertAverageAgeToRange(averageAge);
	// Process the household income data.
	const householdIncome = $("#household-income-input").val();
	const householdIncomeInput = convertHouseholdIncomeToRange(householdIncome);
	// Display the visual info and make the API calls to the model endpoints.
	$("#visual-info").html(`Amazon Rekognition estimates your age range to be <b>${ageLowDisplay} to ${ageHighDisplay}</b> and your gender to be <b>${genderDisplay}</b>.`);
	$("#visual-info").fadeIn("slow", () => {
		let maxPercentage = 0;
		let winningType = "";
		// POST request to the API that is integrated with the fashion model.
		$.post( FASHION_API_URL, genderInput + "," + ageInput + "," + householdIncomeInput, function(fashionValue) {
			const fashionPercentage = Math.floor(fashionValue * 100);
			if(fashionPercentage > maxPercentage) {
				maxPercentage = fashionPercentage;
				winningType = "fashion";
			}
			$("#fashion-ad-info").html(`It is <b>${fashionPercentage}%</b> likely that you are fashion conscious.`);
			$("#fashion-ad-info").fadeIn("slow", () => {
				// POST request to the API that is integrated with the Uber model.
				$.post( UBER_API_URL, genderInput + "," + ageInput + "," + householdIncomeInput, function(uberValue) {
					const uberPercentage = Math.floor(uberValue * 100);
					if(uberPercentage > maxPercentage) {
						maxPercentage = uberPercentage;
						winningType = "uber";
					}
					$("#uber-ad-info").html(`It is <b>${uberPercentage}%</b> likely that you frequently use ride-share apps.`);
					$("#uber-ad-info").fadeIn("slow", () => {
						// POST request to the API that is integrated with the team sports model.
						$.post( SPORTS_API_URL, genderInput + "," + ageInput + "," + householdIncomeInput, function(sportsValue) {
							const sportsPercentage = Math.floor(sportsValue * 100);
							if(sportsPercentage > maxPercentage) {
								maxPercentage = sportsPercentage;
								winningType = "sports";
							}
							$("#sports-ad-info").html(`It is <b>${sportsPercentage}%</b> likely that you play team sports.`);
							$("#sports-ad-info").fadeIn("slow", () => {
								renderAd(winningType);
							});
						});
					});
				});
			});
		});
	});
}

// Given the winning type of ad ('fashion', 'uber', or 'sports'), render an
// appropriate sample commercial on the website.
function renderAd(winningType) {
	if(winningType == "uber") {
		$("#ad-container").html(`Get your groceries home safely with UBER. Call a ride today!`);
	} else if(winningType == "fashion") {
		$("#ad-container").html(`New tops, jeans, and accessories in stock at ZARA. Live life in style!`);
	} else if(winningType == "sports") {
		$("#ad-container").html(`Light, strong, stylish. Get the new Nike Air Zoom training shoes at any location today!`);
	} else {
		// Fallback ad when none of the SageMaker endpoints are activated.
		$("#ad-container").html(`Sample ad about a product that'll blow your socks off. Come in for a free sample today!`);
	}
	$("#ad-container").fadeIn("slow", () => {
		$("#run-button").html("START");
	});
}