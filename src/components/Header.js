import React, { useState, useEffect } from "react";
import Weather from "./Weather";
import AlgoliaPlaces from "algolia-places-react";
import { PLACE } from "../sessionStorage";
import Location from "./location";
import "./style.css";

function Header() {
  const [searchPlace, setSearchPlace] = useState("");
  const [temperatureInfo, setTemperatureInfo] = useState({});
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [status, setStatus] = useState(null);
  const apiKey = "2d74e388cd58aa250c74c508fee56d8a";
  const appId = "plQ0HEAREVSZ";
  const apiKeyAlgolia = "adce344ab26b5c12d2362a2f6bc7e06e";
  const [url, setUrl] = useState(
    `http://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
  );

  // algolia places keys
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   console.log("hii", e.target.value);
  //   setSearchPlace(e.target.value);
  // };

  console.log(searchPlace);

  const getWeatherDetails = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { temp, humidity, pressure } = data.main;
        const { main: weatherType } = data.weather[0];
        const { name } = data;
        const { speed } = data.wind;
        const { country, sunset } = data.sys;
        sessionStorage.setItem("temp", temp);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("humidity", humidity);
        sessionStorage.setItem("humidity", country);
        const myNewWeatherInfo = {
          temp,
          humidity,
          pressure,
          weatherType,
          name,
          speed,
          country,
          sunset,
        };

        setTemperatureInfo(myNewWeatherInfo);
        JSON.parse(sessionStorage.setItem("place", searchPlace));
        // setSearchPlace(data);
        console.log(data);
      });
  };

  useEffect(() => {
    getWeatherDetails();
  }, []);

  return (
    <>
      <p className="status">{status}</p>
      <div className="wrapper">
        {/* <input
          className="input-wrapper"
          placeholder="Search for city..."
          value={searchPlace}
          onChange={handleSearch}
        /> */}
        <AlgoliaPlaces
          placeholder="Enter the location here"
          onChange={({ suggestion }) =>
            setUrl(
              `https://api.openweathermap.org/data/2.5/weather?lat=${suggestion.latlng.lat}&lon=${suggestion.latlng.lng}&appid=${apiKey}&units=metric`
            )
          }
          options={{ appId, apiKey: apiKeyAlgolia, aroundLatLngViaIP: false }}
        />
        <button className="search" onClick={getWeatherDetails}>
          Search
        </button>{" "}
        <Weather {...temperatureInfo} />
      </div>
    </>
  );
}

export default Header;
