const game_board_el = document.querySelector("#game-board");
const timer_el = document.querySelector("#timer");
const grid_size_el = document.querySelector("#grid-size");
const reset_button_el = document.querySelector("#reset-game");
const root_el = document.querySelector(":root");

const colors = ["rgb(0, 0, 255)", "rgb(255, 0, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(125, 50, 50)"];

let grid_size = 4; // 4x4

let current_color_index;
let colors_left = [];

let started = false;
let game_ended = false;

let start_time;

const handle_click = e => {
	if (!started) {
		started = true;
		start_time = performance.now();
	}

	const el = e.target;
	const data = el.dataset;

	if ((current_color_index === undefined || current_color_index == parseInt(data.color_index))
		&& data.clicked == "false") {
		
		data.clicked = true;
		e.target.style.backgroundColor = "#fff";

		current_color_index = parseInt(data.color_index);

		colors_left[current_color_index]--;

		if (colors_left[current_color_index] == 0)
			current_color_index = undefined;
	}

	console.log(`current color index: ${current_color_index} index clicked: ${data.color_index}; colors_left: ${colors_left}`);


	const colors_left_set = new Set(colors_left);

	if (colors_left_set.size == 1 && colors_left_set.has(0)) // [0, 0, 0, 0]
		game_ended = true;
}

const displayTimer = () => {
	let timer_display;

	if (!started) timer_display = "0.00";
	else timer_display = ((performance.now() - start_time) / 1000).toFixed(2);

	timer_el.textContent = timer_display;

	if (!game_ended)
		requestAnimationFrame(displayTimer);
}

const init = () => {
	current_color_index = undefined;
	start_time = undefined;

	started = false;
	game_ended = false;
	root_el.style.setProperty("--grid_size", grid_size);

	const colors_needed = new Array(grid_size).fill(grid_size);

	for (let i = 0; i < grid_size ** 2; i++) {
		const tile_el = document.createElement("div");
		tile_el.className = "game-tile";

		let found_color = false;

		while (!found_color) {
			const color_index = Math.floor(Math.random() * grid_size);
			
			if (colors_needed[color_index] == 0) continue;

			found_color = true;

			tile_el.style.backgroundColor = colors[color_index];
			tile_el.dataset.color_index = color_index;

			colors_needed[color_index]--;
		}

		tile_el.dataset.clicked = false;
		game_board_el.append(tile_el);

		tile_el.onclick = handle_click;
	}

	colors_left = new Array(grid_size).fill(grid_size);

	displayTimer();
}

init();

reset_button_el.onclick = () => {
	while (game_board_el.childNodes.length > 0)
		game_board_el.removeChild(game_board_el.firstChild);

	grid_size = parseInt(grid_size_el.value);

	init();
}
