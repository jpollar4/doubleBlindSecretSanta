import { Forecast } from "./App";
import { Drink, allDrinks } from "./data";

export const pickDrink = (forecast: Forecast): Drink => {
	var validDrinks: Drink[] = [];

	allDrinks.forEach((d) => {
		if (
			d.weatherTypes.length === 0 ||
			d.weatherTypes.includes(forecast.weatherTypeTonight)
		) {
			if (
				forecast.tempTonightF <= d.MaxTempF &&
				forecast.tempTonightF >= d.MinTempF
			) {
				validDrinks.push(d);
			}
		}
	});

	const drink = validDrinks[Math.floor(Math.random() * validDrinks.length)];
	return drink;
};
