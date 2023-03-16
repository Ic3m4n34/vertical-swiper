/**
 * SLIDE_TYPE can be either 'image' or 'iframe'
 * SLIDE_URL is the url of the image or iframe
 */

const templateContainer = document.getElementById('iqd_template');
/**
 *  iqdCreateVericalSwiper
 *  creates vertical swiper
 */
const assets = [
	'https://images.unsplash.com/photo-1678063464139-7c74fc3c2f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=738&q=80',
	'https://images.unsplash.com/photo-1678031525208-7914264d03a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80',
	'https://images.unsplash.com/photo-1678106741653-455a43825002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
	'https://images.unsplash.com/photo-1678107658651-fccc4bdae865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
	'https://images.unsplash.com/photo-1677958811707-8399b2e9ba2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=753&q=80',
];
// const assets = ['https://medium.com/@pavankapoor31/how-to-use-vs-code-live-server-local-host-on-mobile-phone-8b38a62117d2', 'https://yahoo.com', 'https://s0.2mdn.net/5059743/1498622695297/OB_Merchant_Generic_300x250/OB_Merchant_Generic_300x250.html', 'https://google.com', 'https://youtube.com'];
// const assets = ['<iframe src="https://medium.com/@pavankapoor31/how-to-use-vs-code-live-server-local-host-on-mobile-phone-8b38a62117d2" style="width: 100%; height:100%"></iframe>', '<iframe src="https://yahoo.com" style="width: 100%; height:100%"></iframe>', '<iframe src="https://s0.2mdn.net/5059743/1498622695297/OB_Merchant_Generic_300x250/OB_Merchant_Generic_300x250.html" style="width: 100%; height:100%"></iframe>', '<iframe src="https://google.com" style="width: 100%; height:100%"></iframe>', '<iframe src="https://youtube.com" style="width: 100%; height:100%"></iframe>'];

const assetsUrls = ['https://google.com', 'https://youtube.com', 'https://yahoo.com', 'https://ebay.com', 'https://twitter.com'];

let slideCount = null;
let renderedSlides = null;

let activeSlide = null;

const buttonColorFromAdServer = '#ef200e';

const SWIPE_TOLERANCE = 5;

const filteredSlides = [];

const viewportWidth = window.innerWidth;
const imageContainerHeight = 320;

/* if (!isAppPlatform) {
	const styleParentIframe = () => {
		// Get the parent window
		const parentWindow = window.parent;

		// Get the iframe element that contains the current window
		const iframeElement = window.frameElement;
		const iframeContainer = iframeElement.parentElement;
		const adTileDiv = iframeContainer.parentElement;
		const adTileContainer = adTileDiv.parentElement;

		// heights
		const adTileContainerHeight = adTileContainer.offsetHeight;
		const iframeContainerHeight = iframeContainer.offsetHeight;

		// widths
		const parentWindowWidth = parentWindow.innerWidth;

		iframeElement.style.width = `${parentWindowWidth}px`;

		return {
			adTileContainerHeight,
			iframeContainerHeight,
			parentWindowWidth,
		};
	};

	const { iframeContainerHeight, parentWindowWidth } = styleParentIframe();

	viewportWidth = parentWindowWidth;
	viewportHeight = window.innerHeight;

	imageContainerHeight = iframeContainerHeight;
} else {
	// viewportWidth = window.parent.document.body.clientWidth; // TODO: is this working?
	viewportWidth = 320; // ? check this
	viewportHeight = window.innerHeight;

	// we need the height of the add space
	imageContainerHeight = 320; // TODO: remove this

	// _iqdNS.sendAppEvent("setsize", "100:100", 3, 300); // * works here
} */

// touch state
let startY = 0;

const chevronDown = `
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
`;

const filterSlides = () => {
	// only count slides that are not empty
	const notEmptySlides = assets.filter((slide) => slide !== '');
	filteredSlides.push(...notEmptySlides, ...notEmptySlides);

	console.info('filteredSlides', filteredSlides);

	slideCount = notEmptySlides.length;
	activeSlide = slideCount;
	renderedSlides = slideCount * 2;

	console.log('slideCount', slideCount);
	console.log('activeSlide', activeSlide);
	console.log('renderedSlides', renderedSlides);
};

// creates image node
const generateImageNode = (url, linkUrl) => {
	const link = document.createElement('a');
	link.style.display = 'block';

	link.href = linkUrl;
	link.target = '_blank';

	const img = document.createElement('img');
	img.src = url;
	img.style.width = '100%';

	link.appendChild(img);

	console.log('imageContainerHeight', imageContainerHeight);

	link.style.height = `${imageContainerHeight}px`;
	link.style.width = '100%';
	link.style.overflow = 'hidden';

	return link;
};

const parsePixelValue = (value) => {
	const parsedValue = value.replace('px', '');
	return +parsedValue;
};

// create button node
const generateButton = (chevronDirection) => {
	const button = document.createElement('button');
	button.innerHTML = chevronDown;

	const buttonColor = buttonColorFromAdServer || 'green';

	// style svg
	button.childNodes[1].style.height = '36px';
	button.childNodes[1].style.width = '36px';

	// normalize button
	button.style.height = '36px';
	button.style.width = '36px';
	button.style.padding = '0';
	button.style.border = 'none';
	button.style.outline = 'none';

	button.style.backgroundColor = buttonColor;
	button.style.borderRadius = '50%';
	button.style.color = 'white';

	button.style.position = 'absolute';
	button.style.bottom = '50%';
	button.style.zIndex = '2';

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

// style template container
templateContainer.style.width = '100%';
templateContainer.style.height = 'auto'; // TODO: check this

const constructSwiper = async () => {
	filterSlides();
	const slideNodes = filteredSlides.map((slideString, index) => generateImageNode(slideString, assetsUrls[index])); // eslint-disable-line
	const swiper = document.querySelector('#iqd_template');
	const swiperContainer = document.createElement('div');
	swiperContainer.setAttribute('id', 'swiper-container');

	slideNodes.forEach((node) => {
		swiperContainer.appendChild(node);
	});

	swiper.style.height = `${imageContainerHeight}px`;
	swiper.style.width = `${viewportWidth}px`; // TODO: check if this is applied
	swiper.style.overflowY = 'hidden';
	swiper.style.position = 'relative';

	swiperContainer.style.transform = `translateY(${-activeSlide * imageContainerHeight}px)`;

	swiperContainer.style.position = 'absolute';
	swiperContainer.style.top = '0';
	swiperContainer.style.left = '0';

	/* swiperContainer.style.willChange = 'top';
	swiperContainer.style.transition = 'top 0.5s ease-in-out'; */

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

	activeSlide++;

	if (activeSlide > 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'visible';
	}

	if (activeSlide >= filteredSlides.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'hidden';
	}
};

const handleButtonUpClick = () => {
	const swiperContainer = document.querySelector('#swiper-container');
	const currentTop = swiperContainer.style.top;
	const newTop = parsePixelValue(currentTop) + imageContainerHeight;

	swiperContainer.style.top = `${newTop}px`;

	activeSlide--;

	if (activeSlide === 0) {
		const buttonUp = document.querySelector('button.up');
		buttonUp.style.visibility = 'hidden';
	}

	if (activeSlide < filteredSlides.length - 1) {
		const buttonDown = document.querySelector('button.down');
		buttonDown.style.visibility = 'visible';
	}
};

function startSwipe(e) {
	const swiperContainer = document.querySelector('#swiper-container');

	startY = e.clientY;
	swiperContainer.style.transition = 'none';
}

function endSwipe(e) {
	const swiperContainer = document.querySelector('#swiper-container');

	const threshold = SWIPE_TOLERANCE;
	const distance = startY - e.clientY;

	if (Math.abs(distance) > threshold) {
		if (distance > 0) {
			activeSlide++;
		} else if (distance < 0) {
			activeSlide--;
		}
	}

	swiperContainer.style.transition = 'transform 0.3s';
	swiperContainer.style.transform = `translateY(${-activeSlide * imageContainerHeight}px)`;

	console.log('activeSlide', activeSlide);
	console.log('renderedSlides - 1', renderedSlides - 1);

	if (activeSlide >= renderedSlides - 1) {
		console.log('hier');
		setTimeout(() => {
			swiperContainer.style.transition = 'none';
			activeSlide = slideCount - 1;
			swiperContainer.style.transform = `translateY(${-activeSlide * imageContainerHeight}px)`;
			/* swiperContainer.style.transition = 'none';
			activeSlide = slideCount;
			swiperContainer.style.transform = `translateY(${-activeSlide * imageContainerHeight}px)`; */
			/* setTimeout(() => {
				swiperContainer.style.transition = 'transform 0.3s';
				console.log('transform');
			}, 50); */
		}, 300);
	} else if (activeSlide <= 0) {
		console.log('da');
		setTimeout(() => {
			swiperContainer.style.transition = 'none';
			activeSlide = slideCount;
			swiperContainer.style.transform = `translateY(${-activeSlide * imageContainerHeight}px)`;
			/* 			setTimeout(() => {
				swiperContainer.style.transition = 'transform 0.3s';
			}, 50); */
		}, 300);
	}
}

const addEventListeners = () => {
	const buttonUp = document.querySelector('button.up');
	const buttonDown = document.querySelector('button.down');

	buttonUp.addEventListener('click', handleButtonUpClick);
	buttonDown.addEventListener('click', handleButtonDownClick);

	const swiper = document.querySelector('#swiper-container');

	swiper.addEventListener('touchstart', (e) => {
		e.preventDefault();
		startSwipe(e.touches[0]);
	});
	swiper.addEventListener('touchend', (e) => {
		e.preventDefault();
		endSwipe(e.changedTouches[0]);
	});
};

constructSwiper();

setTimeout(() => {
	addEventListeners();
}, 200);
