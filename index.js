const IMAGE_API_URL = 'https://picsum.photos/v2/list?limit=5';

let images = [];

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

const imageContainerHeight = viewportHeight / 2;

let currentImageIndex = 0;

// touch state
let touchStartY = 0;
let touchEndY = 0;

const chevronDown = `
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
`;

const parsePixelValue = (value) => {
	const parsedValue = value.replace('px', '');
	return +parsedValue;
};

const generateButton = (chevronDirection) => {
	const button = document.createElement('button');
	button.innerHTML = chevronDown;

	// style svg
	button.childNodes[1].style.height = '24px';
	button.childNodes[1].style.width = '24px';

	// normalize button
	button.style.height = '24px';
	button.style.width = '24px';
	button.style.padding = '0';
	button.style.border = 'none';
	button.style.outline = 'none';

	button.style.backgroundColor = 'green';
	button.style.borderRadius = '50%';
	button.style.color = 'white';

	button.style.position = 'absolute';
	button.style.bottom = '50%';

	if (chevronDirection === 'up') {
		button.style.transform = 'rotate(180deg)';
		button.classList.add('up');

		// up is hidden initially
		button.style.visibility = 'hidden';

		button.style.left = '12px';
	} else {
		button.style.right = '12px';
		button.classList.add('down');
	}

	return button;
};

const fetchImages = async () => {
	const response = await fetch(IMAGE_API_URL);
	const resImages = await response.json();

	const imageUrls = resImages.map((image) => image.download_url);

	images = imageUrls;
};

/**
 * Generates an array of image nodes with their container divs
 * @param {string[]} images
 * @returns DomNode[]
 */
const generateImageNodes = (imagesParameter) => {
	const imageNodes = imagesParameter.map((image) => {
		// Create a div to hold the image
		const div = document.createElement('div');

		const img = document.createElement('img');
		img.src = image;
		img.style.height = `${imageContainerHeight}px`;

		div.appendChild(img);

		div.style.height = `${imageContainerHeight}px`;
		div.style.width = `${viewportWidth}px`;

		return div;
	});
	return imageNodes;
};

const constructSwiper = async () => {
	await fetchImages();
	const imageNodes = generateImageNodes(images);
	const swiper = document.querySelector('#swiper');
	const swiperContainer = document.createElement('div');
	swiperContainer.setAttribute('id', 'swiper-container');

	imageNodes.forEach((imageNode) => {
		swiperContainer.appendChild(imageNode);
	});

	swiper.style.height = `${imageContainerHeight}px`;
	swiper.style.overflowY = 'hidden';
	swiper.style.position = 'relative';

	swiperContainer.style.position = 'absolute';
	swiperContainer.style.top = '0';
	swiperContainer.style.left = '0';

	swiperContainer.style.willChange = 'top';
	swiperContainer.style.transition = 'top 0.5s ease-in-out';

	swiper.appendChild(swiperContainer);

	// generte up button
	const buttonUp = generateButton('up');
	swiper.appendChild(buttonUp);

	// generte down button
	const buttonDown = generateButton('down');
	swiper.appendChild(buttonDown);
};

const handleButtonDownClick = () => {
	const swiperContainer = document.querySelector('#swiper-container');
	const currentTop = swiperContainer.style.top;
	const newTop = parsePixelValue(currentTop) - imageContainerHeight;

	swiperContainer.style.top = `${newTop}px`;

	currentImageIndex++;

	if (currentImageIndex > 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'visible';
	}

	if (currentImageIndex >= images.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'hidden';
	}
};

const handleButtonUpClick = () => {
	const swiperContainer = document.querySelector('#swiper-container');
	const currentTop = swiperContainer.style.top;
	const newTop = parsePixelValue(currentTop) + imageContainerHeight;

	swiperContainer.style.top = `${newTop}px`;

	currentImageIndex--;

	if (currentImageIndex === 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'hidden';
	}

	if (currentImageIndex < images.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'visible';
	}
};

const handleTouchEvent = (event, touchStatus) => {
	if (touchStatus === 'start') {
		console.info('start', event.changedTouches[0].pageY);
		touchStartY = event.changedTouches[0].pageY;
	} else {
		console.info('end', event.changedTouches[0].pageY);
		touchEndY = event.changedTouches[0].pageY;

		const difference = touchStartY - touchEndY;

		if (difference > 0 && currentImageIndex < images.length - 1) {
			handleButtonDownClick();
		} else if (difference < 0 && currentImageIndex > 0) {
			handleButtonUpClick();
		}
	}
};

const addEventListeners = () => {
	const buttonUp = document.querySelector('button.up');
	const buttonDown = document.querySelector('button.down');

	buttonUp.addEventListener('click', handleButtonUpClick);
	buttonDown.addEventListener('click', handleButtonDownClick);

	const swiper = document.querySelector('#swiper');

	swiper.addEventListener('touchstart', (event) => {
		handleTouchEvent(event, 'start');
	});

	swiper.addEventListener('touchend', (event) => {
		handleTouchEvent(event, 'end');
	});
};

constructSwiper();

// TODO: find a better way to add event listeners
setTimeout(() => {
	addEventListeners();
}, 200);
