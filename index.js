const IMAGE_API_URL = 'https://picsum.photos/v2/list?limit=5';

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

const imageContainerHeight = viewportHeight / 2;

const chevronDown = `
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
`;

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

		button.style.left = '12px';
	} else {
		button.style.right = '12px';
		button.classList.add('down');
	}

	return button;
};

const fetchImages = async () => {
	const response = await fetch(IMAGE_API_URL);
	const images = await response.json();

	const imageUrls = images.map((image) => image.download_url);

	return imageUrls;
};

/**
 * Generates an array of image nodes with their container divs
 * @param {string[]} images
 * @returns DomNode[]
 */
const generateImageNodes = (images) => {
	const imageNodes = images.map((image) => {
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
	const images = await fetchImages();
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

	swiper.appendChild(swiperContainer);

	// generte up button
	const buttonUp = generateButton('up');
	swiper.appendChild(buttonUp);

	// generte down button
	const buttonDown = generateButton();
	swiper.appendChild(buttonDown);
};

const handleButtonClick = (event) => {
	// get class of button
	const buttonClass = event.target.parentNode.className;
	console.info('buttonClass', buttonClass);

	if (buttonClass === 'up') {
		// get swiper container
		const swiperContainer = document.querySelector('#swiper-container');
		const currentTop = swiperContainer.style.top;
		const newTop = (+currentTop) - imageContainerHeight;

		swiperContainer.style.top = `${newTop}px`;
	} else {
		// get swiper container
		const swiperContainer = document.querySelector('#swiper-container');
		const currentTop = swiperContainer.style.top;
		const newTop = (+currentTop) + imageContainerHeight;

		swiperContainer.style.top = `${newTop}px`;
	}
};

const addEventListeners = () => {
	const buttons = document.querySelectorAll('button');

	buttons.forEach((button) => {
		button.addEventListener('click', handleButtonClick);
	});
};

constructSwiper();

// TODO: find a better way to add event listeners
setTimeout(() => {
	addEventListeners();
}, 200);
