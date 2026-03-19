const targetDate = new Date('2026-12-31:00:00');

const units = ['days', 'hours', 'minutes', 'seconds'];
const elements = Object.fromEntries(
	units.map((unit) => [unit, document.querySelector(`[data-unit="${unit}"]`)]),
);

const statusEl = document.querySelector('[data-status]');
const dateLabel = document.querySelector('[data-event-date]');

if (dateLabel) {
	const formatter = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
	dateLabel.textContent = formatter.format(targetDate);
}

function pad(value) {
	return String(value).padStart(2, '0');
}

function setValue(unit, value) {
	const el = elements[unit];
	if (!el) return;

	const formatted = pad(value);
	if (el.textContent === formatted) return;

	el.textContent = formatted;
	el.classList.remove('tick');
	void el.offsetWidth; 
	el.classList.add('tick');
}

function updateCountdown() {
	const now = new Date();
	const diff = targetDate.getTime() - now.getTime();

	if (diff <= 0) {
		units.forEach((unit) => setValue(unit, 0));
		if (statusEl) statusEl.textContent = 'Event started';
		return true;
	}

	const totalSeconds = Math.floor(diff / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	setValue('days', days);
	setValue('hours', hours);
	setValue('minutes', minutes);
	setValue('seconds', seconds);

	if (statusEl) statusEl.textContent = 'Counting down…';
	return false;
}

updateCountdown();
const timer = setInterval(() => {
	const finished = updateCountdown();
	if (finished) clearInterval(timer);
}, 1000);
