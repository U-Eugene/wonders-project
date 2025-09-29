// Получаем необходимые элементы для дальнейшей работы с ними
const quantityInput = document.getElementById('quantity');
const buttonMinus = document.getElementById('button-minus');
const buttonPlus = document.getElementById('button-plus');
const submitButton = document.getElementById('submit-button');
const faqs =  document.getElementById('faqs');
const burgerButton = document.getElementById('burger-menu-button')
const headerNavigation = document.querySelector('nav');

// Обработчик события клика на кнопку бургер-меню
burgerButton.addEventListener('click', () => {
	burgerButton.classList.toggle('burger-active');
	headerNavigation.classList.toggle('burger-menu');
	document.body.style.overflow = document.body.style.overflow ? document.body.removeAttribute('style') : 'hidden';
});

// Закрываем бургер-меню при клике по любой из ссылок в меню
headerNavigation.addEventListener('click', event => {
	if (event.target.nodeName === 'A' && headerNavigation.classList.contains('burger-menu')) {
		burgerButton.classList.remove('burger-active');
		headerNavigation.classList.remove('burger-menu');
		document.body.removeAttribute('style');
	}
});

// Уменьшаем на 1 количество персон при выборе поездки
buttonMinus.addEventListener('click', () => {
	quantityInput.stepDown();
});

// Увеличиваем на 1 количество персон при выборе поездки
buttonPlus.addEventListener('click', () => {
	quantityInput.stepUp();
});

// Обработчик событий для раздела "вопрос-ответ"
faqs.addEventListener('click', event => {
	// Предотвращаем выполнение функции если кликнули не по заголовку вопроса, а по другому узлу faqs
	if (event.target.nodeName !== 'SUMMARY') return

	// Отменяем присвоение details.open = true по умолчанию после клика
	event.preventDefault();

	// Получаем целевые элементы из события клика
	const details = event.target.parentElement;
	const summary = event.target;
	const answer = event.target.nextElementSibling; // получаем следующий элементный узел после summary

		// Проверяем статус open у details, если элемент раскрыт - закрываем
		if (details.open) {
			summary.classList.remove('summary-open');
			answer.classList.remove('details-answer-open');
			setTimeout(() => details.open = false, 300);

		// Иначе - плавно открываем элемент, добавляя классы к заголовку и ответу
		} else {
			details.open = true;
			requestAnimationFrame(() => { // Transition у элементов сработает, когда браузер сам решит, что готов к перерисовке
				summary.classList.add('summary-open');
				answer.classList.add('details-answer-open')
			});

			// После раскрытия целевого details правно закрываем все остальные
			for (const child of faqs.children) { // перебираем все дочерние элементы у faqs
				if (child.open && child !== details) { // проверяем: свойство open (при его наличии) равно true и child не равен текущему details
					child.lastElementChild.classList.remove('details-answer-open');
					child.firstElementChild.classList.remove('summary-open');
					setTimeout(() => child.open = false, 300);
				}
			}
		}
});

// Реализация логики выпадающих меню "Откуда" (Departure) и "Куда" (Arrival)
// Список станций
const Stations = [
	// Switzerland
	"Zermatt Bus Terminal",
	"Interlaken Ost Bus Station",
	"Grindelwald Bus Terminal",
	"Lauterbrunnen Bahnhof",
	"Lucerne Bahnhofquai",
	"Chamonix-Mont-Blanc Sud (France, near Swiss border)",
	"Geneva Bus Station",
	"Bern PostAuto Terminal",
	"Gstaad Bus Station",
	"St. Moritz Bahnhof PostAuto",
	"Verbier Village",
	"Davos Platz Postautohaltestelle",
	"Andermatt Gotthardpass",
	"Täsch Bahnhof (Shuttle to Zermatt)",
	"Flims Dorf Post",

	// France
	"Chamonix Sud Bus Station",
	"Annecy Gare Routière",
	"Grenoble Gare Routière",
	"Nice Airport (Bus to Alps)",
	"Bourg-Saint-Maurice Gare Routière",
	"Morzine Gare Routière",
	"Les Gets Gare Routière",
	"Val d'Isère Centre",
	"Courchevel 1850",
	"Megève Place du Village",

	// Italy
	"Aosta Autostazione",
	"Bolzano Autostazione",
	"Trento Autostazione",
	"Cortina d'Ampezzo Autostazione",
	"Bormio Bus Station",
	"Livigno Centro",
	"Merano Autostazione",
	"Sestriere Bus Stop",
	"Ortisei (St. Ulrich) Autostazione",
	"Canazei Piazza Marconi",

	// Austria
	"Innsbruck Hauptbahnhof Bus Terminal",
	"Salzburg Süd Busbahnhof",
	"Mayrhofen Bahnhof",
	"Lech am Arlberg Postamt",
	"Kitzbühel Hahnenkammbahn",
	"Ischgl Seilbahn",
	"Zell am See Postplatz",
	"Bad Gastein Bahnhof",
	"St. Anton am Arlberg Bahnhof",
	"Sölden Postamt",

	// Germany
	"Garmisch-Partenkirchen Bahnhof (Bus Station)",
	"Berchtesgaden Busbahnhof",
	"Oberstdorf Busbahnhof",
	"Füssen Bahnhof (Bus Station)",
	"Mittenwald Bahnhof (Bus Station)",

	// Slovenia
	"Bled Bus Station",
	"Bohinj Jezero",
	"Kranjska Gora Avtobusna Postaja"
];

// Получаем input'ы станций отправления и прибытия со списками и иконками проверки
const departure = {
	input: document.getElementById('departure'),
	stationsList: document.getElementById('departure-stations-list'),
	checkIcon: document.getElementById('departure-check-icon')
}
const arrival = {
	input: document.getElementById('arrival'),
	stationsList: document.getElementById('arrival-stations-list'),
	checkIcon: document.getElementById('arrival-check-icon')
}
let departureStation;
let arrivalStation;

// Функция отображения совпадающих станций в списке на основе введенного пользователем значения
function searchStations({ input, stationsList }) {
	stationsList.innerHTML = '';
	const inputStation = input.value.toLowerCase().trim();
	const newStations = Stations.filter(station => station.toLowerCase().trim().includes(inputStation));

	// Если были совпадения, добавляем соответствующие станции в выпадающий список, иначе выводим not found
	if (newStations.length) {
		for (const station of newStations) {
			stationsList.innerHTML += `<li>${station}</li>`;
		}
	} else {
		stationsList.innerHTML = '<span class="stations-list-not-found">Station not found</span>';
	}
	stationsList.parentElement.classList.remove('collapsed');
}

// Функция проверки корректности выбора пользователем станций или введенного им значения
function checkValuesStations({ input, stationsList, checkIcon }) {
	// Сбрасываем стиль check-value span по умолчанию
	checkIcon.classList.remove('visible');
	// Скрываем список станций прибытия
	stationsList.parentElement.classList.add('collapsed');
	// если поле ввода не пустое - проверку не проводим
	if (!input.value.length) return;

	// Присваиваиваем значения departureStation и arrivalStation, если они не совпадают с предыдущими
	if (input.id === 'departure' && input.value !== departureStation) {
		departureStation = input.value;
	} else if (input.id === 'arrival' && input.value !== arrivalStation) {
		arrivalStation = input.value;
	}

	// Проверяем имеется ли введенное значение станции в оригинальном списке станций и плавно добавляем визуальный элемент check
	const isStationIncludes = Stations.includes(input.value);
	setTimeout(() => {
		if (!isStationIncludes || departureStation === arrivalStation) {
			checkIcon.innerHTML = '&#10005;'; // incorrect value
			checkIcon.style.color = 'FireBrick';
		} else if (isStationIncludes) {
			checkIcon.innerHTML = '&#10003;'; // correct value
			checkIcon.style.color = 'var(--green)';
		}
		checkIcon.classList.add('visible');
	}, 150);
}

// ОБРАБОТЧИКИ СОБЫТИЯ ДЛЯ ПОЛЯ ВЫБОРА СТАНЦИИ ОТПРАВЛЕНИЯ
// 1. Обработчик событий для клика по полю выбора станции отправления
departure.input.addEventListener('click', () => {
	departure.checkIcon.classList.remove('visible');
	searchStations(departure);
});

// 2. Обработчик события при выборе станции отправления из выпадающего списка
departure.stationsList.addEventListener('mousedown', event => {
	if (event.target.nodeName === 'LI') {
		departure.input.value = event.target.innerText;
	}
});

// 3. Обработчик события при вводе пользователем своего названия станции отправления и поиск подходящих в списке
departure.input.addEventListener('input', () => {
	searchStations(departure);
});

// 4. Обработчик события при смене фокуса с поля выбора станции отправления
departure.input.addEventListener('blur', () => {
	// Вызываем функцию проверки корректности выбора (ввода) станции отправления и скрытия списка
	checkValuesStations(departure);
	// Перепроверяем станцию прибытия на предмет совпадения
	checkValuesStations(arrival);
});


// ОБРАБОТЧИКИ СОБЫТИЯ ДЛЯ ПОЛЯ ВЫБОРА СТАНЦИИ ПРИБЫТИЯ
// 1. Обработчик событий для клика по полю выбора станции прибытия
arrival.input.addEventListener('click', () => {
	arrival.checkIcon.classList.remove('visible');
	searchStations(arrival);
});

// 2. Обработчик события при выборе станции прибытия из выпадающего списка
arrival.stationsList.addEventListener('mousedown', event => {
	if (event.target.nodeName === 'LI') {
		arrival.input.value = event.target.innerText;
	}
});

// 3. Обработчик события при вводе пользователем своего названия станции прибытия и поиск подходящих в списке
arrival.input.addEventListener('input', () => {
	searchStations(arrival);
});

// 4. Обработчик события при смене фокуса с поля выбора станции прибытия
arrival.input.addEventListener('blur', () => {
	// Вызываем функцию проверки корректности выбора (ввода) станции прибытия и скрытия списка
	checkValuesStations(arrival);
	// Перепроверяем станцию отправления на предмет совпадения
	checkValuesStations(departure);
});

// РАБОТА С ОКНОМ АВТОРИЗАЦИИ ПОЛЬЗОВАТЕЛЯ
const signupLink = document.getElementById('signup')
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-modal-form');
const signupLoginButton = document.getElementById('signup-login-button');
const signupModalResult = document.getElementById('signup-modal-result');
const signupWelcomeText = document.getElementById('signup-welcome-text');
const signupUsername = document.getElementById('signup-username');
let scrollY = 0; // создаем переменную для хранения позиции Y при открытии модального окна

// Открываем модальное окно авторизации при клике по ссылке Sign Up в меню
signupLink.addEventListener('click', event => {
	if (signupLink.innerText !== 'Sign Up') {
		return;
	}
	event.preventDefault();
	signupModalResult.classList.remove('visible');
	scrollY = window.scrollY;
	document.documentElement.style.top = `-${scrollY}px`;
	document.documentElement.classList.add('modal');
	signupModal.showModal();
	signupModal.classList.add('visible');
	signupForm.classList.add('visible');
})

// Закрываем модальное окно авторизации при клике вне формы
signupModal.addEventListener('mousedown', event => {
	if (event.target.nodeName === 'DIALOG' || event.target.id === 'signup-ok-button') {
		signupModalResult.classList.remove('visible');
		signupForm.classList.remove('visible');
		signupModal.classList.remove('visible');
		setTimeout(() => signupModal.close(), 400);
		document.documentElement.classList.remove('modal');
		document.documentElement.style.top = '';
		document.documentElement.style.scrollBehavior = 'initial';
		window.scrollTo(0, scrollY);
		document.documentElement.style.scrollBehavior = 'smooth';
	}
})

// Обрабатываем клик по кнопке входа в аккаунт и проверяем валидность введенных в форму данных
signupLoginButton.addEventListener('click', event => {
	event.preventDefault();
	if (signupForm.checkValidity()) {
		signupWelcomeText.innerHTML = `Login is successful<br>Welcome, ${signupUsername.value}!`
		signupForm.classList.remove('visible');
		signupModalResult.classList.add('visible');
		signupLink.innerHTML = signupUsername.value;
		signupLink.title = 'Logout';
		signupLink.classList.add('user-icon');
	} else {
		signupForm.reportValidity();
	}
})


// КАСТОМНЫЙ КАЛЕНДАРЬ
// Получаем input дат отправления и прибытия и необходимые элементы календаря
const departDateInput = document.getElementById('depart-date');
const returnDateInput = document.getElementById('return-date');
const daysFirstMonth = document.getElementById('days-first-month');
const daysSecondMonth = document.getElementById('days-second-month');
const calendarTemplate = document.getElementById('calendarTemplate');
const calendarContainer = departDateInput.nextElementSibling;
const emptyElement = document.createElement('span');
const resetButton = document.getElementById('reset-button');
const datesCheckIcon = document.getElementById('dates-check-icon');
const dateErrorModal = document.getElementById('date-error-modal');
const dateErrorMessage = document.getElementById('date-error-message');
const dateErrorText = document.getElementById('date-error-text');
const modalOkButton = document.getElementById('error-ok-button');

// Функция изменения месяцев в календарях при переключении стрелками
function changeMonth(firstMonthElement, secondMonthElement) {
	const firstMonth = new Date();
	const secondMonth = new Date(firstMonth);
	secondMonth.setMonth(firstMonth.getMonth() + 1);
	return (numChangeMonth = 0) => {
		firstMonth.setMonth(firstMonth.getMonth() + numChangeMonth);
		secondMonth.setMonth(secondMonth.getMonth() + numChangeMonth);
		fillMonth(firstMonthElement, firstMonth);
		fillMonth(secondMonthElement, secondMonth);
	};
}

// Функция запуска процесса получения заполненных элементов месяцев с замыканием
const startGetMonth = changeMonth(daysFirstMonth, daysSecondMonth);

// Функция заполнения переданного элемента месяца в календаре в записимости от переданной даты
function fillMonth(monthElement, date) {
	// Очищаем содержимое элемента для заполнения новым месяцем
	monthElement.innerHTML = '';
	// Клонируем шаблон месяца в календаре
	const cloneCalendarTemplate = calendarTemplate.content.cloneNode(true);
	// Получаем ключевые данные месяца для заполнения календаря
	const year = date.getFullYear();
	const month = date.getMonth();
	const dayInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayWeekMonth = new Date(year, month, 1).getDay();

	// Счетчик для определения с какого дня недели начинать заполнять календарь (1 = понедельник)
	// (увеличивается в цикле при заполнении до достижения индекса первого дня месяца)
	let counterMonthStart = 1;

	// Добавляем шаблон месяца календаря в элемент
	monthElement.appendChild(cloneCalendarTemplate);

	// Изменяем заголовки названий месяцев
	monthElement.children[1].textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	// Цикл для заполнения месяца числами в пределах количества дней в месяце и с учетом дня недели начала месяца
	for (let i = 1; i <= dayInMonth; i++) {
		if (firstDayWeekMonth === 0 && counterMonthStart < 7) { // получаем отступ, если первый день месяца воскресенье
			monthElement.innerHTML += `<div></div>`;
			counterMonthStart++;
			i--;
			continue;
		} else if (counterMonthStart < firstDayWeekMonth) { // вычисляем отступ для иных первых дней месяца
			monthElement.innerHTML += `<div></div>`;
			counterMonthStart++;
			i--;
			continue;
		}
		monthElement.innerHTML += `<span>${i}</span>`; // заполняем весь месяц с 1 по последнее число месяца
	}

	// Добавляем обработчики событий для переключения месяцев и убираем правую или левую стрелку в зависимости от расположения месяца
	if (monthElement.id === 'days-first-month') {
		const arrowLeft = monthElement.children[0];
		arrowLeft.addEventListener('click', event => {
			event.stopPropagation();
			startGetMonth(-1)
		});
		monthElement.children[2].remove();
	} else {
		const arrowRight = monthElement.children[2];
		arrowRight.addEventListener('click', event => {
			event.stopPropagation();
			startGetMonth(1)
		});
		monthElement.children[0].remove();
		monthElement.prepend(emptyElement);
	}
}

// Функция показа заполненного календаря
function showCalendar() {
	startGetMonth(); // заполняем календарь
	calendarContainer.classList.remove('collapsed'); // получаем элемент с календарем и раскрываем

}

// Функция показа модального окна ошибки выбора даты или итоговых результатов отправки формы
function showModalError(text) {
	scrollY = window.scrollY;
	document.documentElement.style.top = `-${scrollY}px`;
	document.documentElement.classList.add('modal');
	dateErrorModal.showModal();
	dateErrorModal.classList.add('visible');
	dateErrorMessage.classList.add('visible');
	dateErrorText.textContent = text;
}

// Функция скрытия модального окна ошибки выбора даты или итоговых результатов отправки формы
function closeModalError() {
	dateErrorMessage.classList.remove('visible');
	dateErrorModal.classList.remove('visible');
	setTimeout(() => dateErrorModal.close(), 400);
	document.documentElement.classList.remove('modal');
	document.documentElement.style.top = '';
	document.documentElement.style.scrollBehavior = 'initial';
	window.scrollTo(0, scrollY);
	document.documentElement.style.scrollBehavior = 'smooth';
}

// Функция проверки корректности веденных дат
function checkValidDates() {
	if (!departDateInput.value || !returnDateInput.value) {
		showModalError('Error! Please fill in both the departure and arrival date fields');
		return false;
	}
	const departDateChose = new Date(departDateInput.value).getTime();
	const returnDateChose = new Date(returnDateInput.value).getTime();

	if (departDateChose === returnDateChose) {
		showModalError('Error! The selected dates must not be the same');
		return false;
	} else if (departDateChose > returnDateChose) {
		showModalError('Error! Arrival date must not be earlier than departure date');
		return false;
	} else {
		calendarContainer.classList.add('collapsed')
		return true;
	}
}

// Функция изменения вида иконки статуса выбора дат
function checkValidIconChange(status) {
		if (!status) {
			datesCheckIcon.innerHTML = '&#10005;'; // incorrect value
			datesCheckIcon.style.color = 'FireBrick';
		} else {
			datesCheckIcon.innerHTML = '&#10003;'; // correct value
			datesCheckIcon.style.color = 'var(--green)';
		}
		datesCheckIcon.classList.add('visible');
}

// Обработчики событий для полей дат и календаря
let activeInput = null; // задаем переменную для определения активного инпута после клика

// Функция базовых действий при клике на инпуты дат
function clickDateInputBasis(input) {
	// скрываем иконку проверки дат
	datesCheckIcon.classList.remove('visible');
	// если еще не было кликов по инпутам дат - показывваем заполненный календарь
	if (!activeInput) showCalendar();
	// устанавливаем активный инпут на котором был клик и добавляем визуальный стиль
	activeInput = input;
	activeInput.classList.add('inputDateFocus');
	// добавляем календарю фокус, т.к. div по умолчанию не реагирует на событие blur
	calendarContainer.focus();
}

// обработчик клика по дате отправления
departDateInput.addEventListener('click', () => {
	clickDateInputBasis(departDateInput);
});

// обработчик клика по дате прибытия
returnDateInput.addEventListener('click', () => {
	clickDateInputBasis(returnDateInput);
});

// обработчик при потере фокуса у календаря
calendarContainer.addEventListener('focusout', event => {
	// получаем relatedTarget календаря, которое указывает на связанный элемент, участвующий в переходе фокуса
	const relatedTarget = event.relatedTarget;
	// устанавливаем статус иконки проверки дат по умолчанию и удаляем outline у активного input
	let statusIcon = false;
	activeInput?.classList.remove('inputDateFocus');

	// если relatedTarget = null или клик не по инпутам вводы даты - запускам проверку ввода дат
	if (!relatedTarget || relatedTarget.id !== 'depart-date' && relatedTarget.id !== 'return-date') {
		if (checkValidDates()) statusIcon = true;
		// скрываем календарь, сбрасываем активный инпут даты и меняем статус иконки
		calendarContainer.classList.add('collapsed');
		activeInput = null;
		checkValidIconChange(statusIcon);
	}
});

// Добавляем обработчик событий для клика по выбранному числу месяца
calendarContainer.addEventListener('click', event => {
	const day = event.target.textContent;
	// проверяем чтобы элемент day содержал числовое значение и не был пустым (если кликать по пустым ячейкам или названиям недели)
	// и сохраняем значение в последний активный input
	if (!Number.isNaN(+day) && day) {
		const monthYear = event.target.parentElement.children[1].textContent;
		activeInput.value = `${day} ${monthYear}`;
		resetButton.classList.add('active');
	}
});

// Обработчик для кнопки reset
resetButton.addEventListener('mousedown', event => {
	event.preventDefault()
	departDateInput.value = '';
	returnDateInput.value = '';
	resetButton.classList.remove('active');
})

// Обработчик события клика на кнопку OK в модальном окне ошибки выбора даты
modalOkButton.addEventListener('click', () => {
	closeModalError()
})

// Обработчик для кнопки отправки итоговых данных формы о поездке
submitButton.addEventListener('click', event => {
	// Предотвращаем перезагрузку страницы при нажатии на отправку формы
	event.preventDefault();
	// получаем все элементы статусов check по данным формы и перебираем их в цикле с проверкой
	const checkElementsArray = document.querySelectorAll('.check');
	let isValidData = true;
	checkElementsArray.forEach(checkElement => {
		if (checkElement.textContent !== '✓') isValidData = false;
	});
	// показываем результат отправки формы в модальном окне
	if (isValidData) {
		const countTickets = Math.ceil(Math.random() * 20);
		modalOkButton.style.display = 'none';
		showModalError(`Just a moment — we’re searching for matching tickets...`);
		setTimeout(() => closeModalError(), 1500);
		setTimeout(() => {
			modalOkButton.removeAttribute('style');
			showModalError(`We’ve found ${countTickets} available tickets for your amazing trip!`);
		}, 2000);
	} else {
		showModalError('Oops! Something went wrong. Please check that all fields are properly filled in.');
	}
});