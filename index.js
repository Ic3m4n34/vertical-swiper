/**
 * SLIDE_TYPE can be either 'image' or 'iframe'
 * SLIDE_URL is the url of the image or iframe
 */

const SLIDE1 = 'https://s0.2mdn.net/5059743/1498622695297/OB_Merchant_Generic_300x250/OB_Merchant_Generic_300x250.html';
const SLIDE1_TYPE = 'iframe';
const SLIDE2 = 'https://picsum.photos/200/300';
const SLIDE2_TYPE = 'image';
const SLIDE3 = 'https://s0.2mdn.net/5059743/1498622695297/OB_Merchant_Generic_300x250/OB_Merchant_Generic_300x250.html';
const SLIDE3_TYPE = 'iframe';
const SLIDE4 = 'https://picsum.photos/320/320';
const SLIDE4_TYPE = 'image';
// const SLIDE5 = 'https://picsum.photos/500/800';
const SLIDE5 = '';
const SLIDE5_TYPE = '';

const templateContainer = document.getElementById('iqd_template');

// is iframe, url or image
const creativeType = 'image';

/**
 *  iqdCreateVericalSwiper
 *  creates vertical swiper
 */
const assets = ['https://images.unsplash.com/photo-1678063464139-7c74fc3c2f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=738&q=80', 'https://images.unsplash.com/photo-1678031525208-7914264d03a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80', 'https://images.unsplash.com/photo-1678106741653-455a43825002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1678107658651-fccc4bdae865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80', 'https://images.unsplash.com/photo-1677958811707-8399b2e9ba2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=753&q=80'];
const assetsUrls = ['https://google.com', 'https://google.com', 'https://google.com', 'https://google.com', 'https://google.com'];

let filteredSlides = null;

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

const imageContainerHeight = viewportHeight / 2;

let currentSlideIndex = 0;

// touch state
let touchStartY = 0;
let touchEndY = 0;

const chevronDown = `
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
`;

const filterSlides = () => {
	// only count slides that are not empty
	filteredSlides = assets.filter((slide) => slide !== '');
};

// creates image node
const generateImageNode = (url) => {
	const div = document.createElement('div');

	const img = document.createElement('img');
	img.src = url;
	img.style.height = `${imageContainerHeight}px`;

	div.appendChild(img);

	div.style.height = `${imageContainerHeight}px`;
	div.style.width = `${viewportWidth}px`;

	return div;
};

// create iframe node from url
const generateIframeNode = (url) => {
	const div = document.createElement('div');

	const iframe = document.createElement('iframe');

	iframe.src = url;
	iframe.style.height = `${imageContainerHeight}px`;
	iframe.style.width = `${viewportWidth}px`;

	div.appendChild(iframe);

	div.style.height = `${imageContainerHeight}px`;
	div.style.width = `${viewportWidth}px`;

	return div;
};

// create iframe node from string
const generateIframeNodeFromString = (iframeString) => {
	const div = document.createElement('div');

	div.innerHTML = iframeString;

	div.style.height = `${imageContainerHeight}px`;
	div.style.width = '100%';

	return div;
};

const parsePixelValue = (value) => {
	const parsedValue = value.replace('px', '');
	return +parsedValue;
};

// create button node
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

/**
 * Generates an array of image nodes with their container divs
 * @param {string[]} images
 * @returns DomNode[]
*/
const generateSlideNodes = (swiperSlides) => {
	if (creativeType === 'image') return swiperSlides.map((slideString) => generateImageNode(slideString));
	if (creativeType === 'iframe') return swiperSlides.map((slideString) => generateIframeNodeFromString(slideString));

	return swiperSlides.map((slideString) => generateIframeNode(slideString));
};

// style template container
templateContainer.style.width = '100%';
templateContainer.style.height = 'auto'; // TODO: check this

console.info('assets', assets);
console.log('creativeType', creativeType);

document.getElementById('iqd_template').style.width = '100%';
document.getElementById('iqd_template').style.height = '300px';
document.getElementById('iqd_template').style.backgroundColor = 'red';

const constructSwiper = async () => {
	filterSlides();
	const slideNodes = generateSlideNodes(filteredSlides);
	const swiper = document.querySelector('#iqd_template');
	const swiperContainer = document.createElement('div');
	swiperContainer.setAttribute('id', 'swiper-container');

	slideNodes.forEach((node) => {
		swiperContainer.appendChild(node);
	});

	swiper.style.height = `${imageContainerHeight}px`;
	swiper.style.width = '100%';
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

	currentSlideIndex++;

	if (currentSlideIndex > 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'visible';
	}

	if (currentSlideIndex >= filteredSlides.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'hidden';
	}
};

const handleButtonUpClick = () => {
	const swiperContainer = document.querySelector('#swiper-container');
	const currentTop = swiperContainer.style.top;
	const newTop = parsePixelValue(currentTop) + imageContainerHeight;

	swiperContainer.style.top = `${newTop}px`;

	currentSlideIndex--;

	if (currentSlideIndex === 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'hidden';
	}

	if (currentSlideIndex < filteredSlides.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'visible';
	}
};

const handleTouchEvent = (event, touchStatus) => {
	console.info('Handle touch event', event);
	if (touchStatus === 'start') {
		touchStartY = event.changedTouches[0].pageY;
	} else {
		touchEndY = event.changedTouches[0].pageY;

		const difference = touchStartY - touchEndY;

		if (difference > 0 && currentSlideIndex < filteredSlides.length - 1) {
			handleButtonDownClick();
		} else if (difference < 0 && currentSlideIndex > 0) {
			handleButtonUpClick();
		}
	}
};

const addEventListeners = () => {
	const buttonUp = document.querySelector('button.up');
	const buttonDown = document.querySelector('button.down');

	buttonUp.addEventListener('click', handleButtonUpClick);
	buttonDown.addEventListener('click', handleButtonDownClick);

	const swiper = document.querySelector('#iqd_template');

	swiper.addEventListener('touchstart', (event) => {
		handleTouchEvent(event, 'start');
	});

	swiper.addEventListener('touchend', (event) => {
		handleTouchEvent(event, 'end');
	});

	/* swiper.addEventListener('touchmove', (event) => {
			handleTouchMove(event);
	}); */
};

constructSwiper();

// TODO: find a better way to add event listeners
setTimeout(() => {
	addEventListeners();
}, 200);
