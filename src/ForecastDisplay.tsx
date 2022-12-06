import React, { useState, useEffect } from "react";
import "./App.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { dayWeatherIcons, nightWeatherIcons } from "./data";
import { Forecast } from "./App";

const ForecastDisplay = ({
	forecast,
	isDay,
}: {
	forecast: Forecast;
	isDay: boolean;
}) => {
	return (
		<Container>
			<Row>
				<Col>
					<h1>{isDay ? "Today" : "Tonight"}</h1>
				</Col>
			</Row>
			<Row>
				<Col>
					<Image
						className="centerImage"
						src={
							isDay && forecast.weatherTypeToday !== undefined
								? dayWeatherIcons[forecast.weatherTypeToday]
								: nightWeatherIcons[forecast.weatherTypeTonight]
						}
					/>
				</Col>
			</Row>

			<Row>
				<Col>
					<h1>
						{isDay && forecast.tempTodayF !== undefined
							? forecast.tempTodayF + "F"
							: forecast.tempTonightF + "F"}
					</h1>
				</Col>
			</Row>
			<Row>
				<Col>
					<h2>
						{isDay && forecast.shortForecastToday !== undefined
							? forecast.shortForecastToday
							: forecast.shortForecastTonight}
					</h2>
				</Col>
			</Row>
		</Container>
	);
};

export default ForecastDisplay;
