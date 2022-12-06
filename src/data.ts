export enum WeatherType {
	clear = 0,
	rain,
	cloudy,
	fog,
	snow,
	windy,
}

export enum DrinkGlass {
	bigglass = 0,
	champagne,
	flute,
	glass,
	marg,
	martini,
	punch,
	tumbler,
}

export interface Drink {
	name: string;
	weatherTypes: WeatherType[]; //empty for any weather type
	MaxTempF: number;
	MinTempF: number;
	glassType: DrinkGlass;
}
export const allDrinks: Drink[] = [
	{
		name: "Negroni Sbagliato with Prosecco in it",
		weatherTypes: [WeatherType.clear],
		MaxTempF: 1000,
		MinTempF: 50,
		glassType: DrinkGlass.tumbler,
	},
	{
		name: "Hot Toddy",
		weatherTypes: [],
		MaxTempF: 65,
		MinTempF: -100,
		glassType: DrinkGlass.tumbler,
	},
	{
		name: "Margarita",
		weatherTypes: [WeatherType.clear],
		MaxTempF: 1000,
		MinTempF: 45,
		glassType: DrinkGlass.marg,
	},
	{
		name: "Hot Chocolate and Baileys",
		weatherTypes: [WeatherType.snow],
		MaxTempF: 40,
		MinTempF: -100,
		glassType: DrinkGlass.tumbler,
	},
];

export const dayWeatherIcons = {
	[WeatherType.clear]: require("./weatherIcons/icons/1530392_weather_sun_sunny_temperature.png"),
	[WeatherType.rain]: require("./weatherIcons/icons/1530362_cloudy_weather_forecast_rain_clouds.png"),
	[WeatherType.cloudy]: require("./weatherIcons/icons/1530369_cloudy_weather_clouds_cloud.png"),
	[WeatherType.fog]: require("./weatherIcons/icons/1530386_weather_clouds_fog_foggy.png"),
	[WeatherType.snow]: require("./weatherIcons/icons/1530371_winter_snow_clouds_weather.png"),
	[WeatherType.windy]: require("./weatherIcons/icons/1530361_windy_cloudy_storm_wind_weather.png"),
};
export const nightWeatherIcons = {
	[WeatherType.clear]: require("./weatherIcons/icons/1530382_weather_night_moon_moonlight.png"),
	[WeatherType.rain]: require("./weatherIcons/icons/1530362_cloudy_weather_forecast_rain_clouds.png"),
	[WeatherType.cloudy]: require("./weatherIcons/icons/1530369_cloudy_weather_clouds_cloud.png"),
	[WeatherType.fog]: require("./weatherIcons/icons/1530377_moon_night_weather_foggy_fog.png"),
	[WeatherType.snow]: require("./weatherIcons/icons/1530371_winter_snow_clouds_weather.png"),
	[WeatherType.windy]: require("./weatherIcons/icons/1530361_windy_cloudy_storm_wind_weather.png"),
};

export const glassIcons = {
	[DrinkGlass.bigglass]: require("./drinkIcons/bigglass.png"),
	[DrinkGlass.champagne]: require("./drinkIcons/champagne.png"),
	[DrinkGlass.flute]: require("./drinkIcons/flute.png"),
	[DrinkGlass.glass]: require("./drinkIcons/glass.png"),
	[DrinkGlass.marg]: require("./drinkIcons/marg.png"),
	[DrinkGlass.martini]: require("./drinkIcons/martini.png"),
	[DrinkGlass.punch]: require("./drinkIcons/punch.png"),
	[DrinkGlass.tumbler]: require("./drinkIcons/tumbler.png"),
};
