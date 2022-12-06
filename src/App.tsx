import React, { useState, useEffect } from "react";
import "./App.scss";

import { pickDrink } from "./DrinkPicker";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { WeatherType, Drink, DrinkGlass, glassIcons } from "./data";
import ForecastDisplay from "./ForecastDisplay";

export interface Forecast {
	forecastTime: Date; //Time we got this forecast
	tempTodayF?: number;
	tempTonightF: number;
	weatherTypeToday?: WeatherType;
	weatherTypeTonight: WeatherType;
	shortForecastToday?: string;
	shortForecastTonight: string;
}

const App = () => {
	const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
	const [forecast, setForecast] = useState<Forecast | undefined>();
	const [drink, setDrink] = useState<Drink | undefined>();

	const APIKey = " ";

	const isSameDay = (date: Date) => {
		var now = new Date();
		var same =
			now.getMonth() === date.getMonth() &&
			now.getDate() === date.getDate() &&
			now.getFullYear() === date.getFullYear();
		return same;
	};

	const loadForecast = async () => {
		function success(pos: any) {
			const crd = pos.coords;
			setLocation({ latitude: crd.latitude, longitude: crd.longitude });
			fetchWeather({ latitude: crd.latitude, longitude: crd.longitude });
		}

		function error(err: any) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		}

		let fetchForcastData = false;
		const storedForecast = localStorage.getItem("forecast");
		if (storedForecast !== undefined && storedForecast !== null) {
			const forecastObject: Forecast = JSON.parse(storedForecast) as Forecast;

			var storedDate = new Date(forecastObject.forecastTime);
			if (isSameDay(storedDate)) {
				setForecast(forecastObject);
				setDrink(pickDrink(forecastObject));
			} else {
				fetchForcastData = true;
			}
		} else {
			fetchForcastData = true;
		}
		if (fetchForcastData) {
			const options = {
				enableHighAccuracy: false,
				timeout: 5000,
				maximumAge: 0,
			};
			await navigator.geolocation.getCurrentPosition(success, error, options);
		}
	};

	const fetchWeather = async ({
		latitude,
		longitude,
	}: {
		latitude: number;
		longitude: number;
	}) => {
		//
		/*
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`
		);
		console.log(res);
		if (!res.ok) {
			const message = `An error has occured: ${res.status} - ${res.statusText}`;
			throw new Error(message);
		}

		const data = await res.json();

		// const result = {
		// 	status: res.status + "-" + res.statusText,
		// 	headers: {
		// 		"Content-Type": res.headers.get("Content-Type"),
		// 		"Content-Length": res.headers.get("Content-Length"),
		// 	},
		// 	length: res.headers.get("Content-Length"),
		// 	data: data,
		// };
		console.log(data);
    */
		const res = await fetch(
			`https://api.weather.gov/points/${latitude},${longitude}`
		);
		console.log(res);
		if (!res.ok) {
			const message = `An error has occured: ${res.status} - ${res.statusText}`;
			throw new Error(message);
		}

		const data = await res.json();
		const forecastLink = data.properties.forecast;
		console.log(forecastLink);

		const forecastResponse = await fetch(forecastLink);
		if (!forecastResponse.ok) {
			const message = `An error has occured: ${forecastResponse.status} - ${forecastResponse.statusText}`;
			throw new Error(message);
		}

		const forcastData = await forecastResponse.json();

		console.log(forcastData);

		const forecastObject = populateForecastObject(forcastData);
		setForecast(forecastObject);
		setLocalStorage(forecastObject);
		setDrink(pickDrink(forecastObject));
	};

	const populateForecastObject = (forcastData: any) => {
		let forecastObject: Forecast;
		if (forcastData.properties.periods[0].isDaytime) {
			forecastObject = {
				forecastTime: new Date(),
				tempTodayF: forcastData.properties.periods[0].temperature,
				tempTonightF: forcastData.properties.periods[1].temperature,
				weatherTypeToday: getWeatherType(
					forcastData.properties.periods[0].shortForecast
				),
				shortForecastToday: forcastData.properties.periods[0].shortForecast,
				weatherTypeTonight: getWeatherType(
					forcastData.properties.periods[1].shortForecast
				),
				shortForecastTonight: forcastData.properties.periods[1].shortForecast,
			};
		} else {
			forecastObject = {
				forecastTime: new Date(),
				tempTonightF: forcastData.properties.periods[0].temperature,
				weatherTypeTonight: getWeatherType(
					forcastData.properties.periods[0].shortForecast
				),
				shortForecastTonight: forcastData.properties.periods[0].shortForecast,
			};
		}

		return forecastObject;
	};

	const getWeatherType = (weatherString: string) => {
		weatherString = weatherString.toLowerCase();
		if (weatherString.includes("rain")) {
			return WeatherType.rain;
		} else if (weatherString.includes("snow")) {
			return WeatherType.snow;
		} else if (weatherString.includes("fog")) {
			return WeatherType.fog;
		} else if (weatherString.includes("cloud")) {
			return WeatherType.cloudy;
		}
		return WeatherType.clear;
	};

	const setLocalStorage = (forecast: Forecast) => {
		localStorage.setItem("forecast", JSON.stringify(forecast));
	};

	useEffect(() => {
		loadForecast();
	}, []);

	return (
		<Container>
			<Row>
				<Col>
					<h1>Sweater Weather</h1>
				</Col>
			</Row>
			{forecast !== undefined && (
				<Row>
					{forecast.tempTodayF !== undefined && (
						<Col>
							<ForecastDisplay forecast={forecast} isDay />
						</Col>
					)}
					<Col>
						<ForecastDisplay forecast={forecast} isDay={false} />
					</Col>
				</Row>
			)}
			{drink !== undefined && (
				<Row>
					<Col>
						<h2>{drink.name}</h2>
						<Image className="centerImage" src={glassIcons[drink.glassType]} />
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default App;
