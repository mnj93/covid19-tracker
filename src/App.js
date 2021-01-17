import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import { sortData } from './util';
import Map from './Map';
import 'leaflet/dist/leaflet.css';

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countryTable, setCountryTable] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]); // lat, long
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(()=>{
    const getCountries = async () => {
      try{
        // https://corona.lmao.ninja/v2/countries
        const response = await fetch("https://disease.sh/v3/covid-19/countries", requestOptions);
        const full_countries = await response.json();
        console.log(full_countries);
        const _countries = full_countries.map(country => (
          {
            name: country.country,
            code: country.countryInfo.iso2
          }
        ));
        console.log('_countries =>>>>>', _countries);
        const sorted_country_data = sortData(full_countries);
        setCountryTable(sorted_country_data);
        setCountries(_countries);
        setMapCountries(full_countries);
      }
      catch(err){
        console.log('API call failed to fetch country list', err);
      }
    }

    getCountries();
  }, []);

  useEffect(()=> {
    const getCountryInfo = async () => {
      const response = await fetch('https://corona.lmao.ninja/v2/all');
      const _countryInfo = await response.json();

      setCountryInfo(_countryInfo);
    }
    getCountryInfo();
  }, [])

  const onCountryChange = async (e) => {
    try{
      const countryCode = e.target.value;
      const url = countryCode === 'worldwide' ? 'https://corona.lmao.ninja/v2/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      const response = await fetch(url, requestOptions);
      const _countryInfo = await response.json();

      setCountry(countryCode);
      setCountryInfo(_countryInfo);
      console.log('_countryInfo =>>>>>>', _countryInfo);
      // setMapCenter({lat: _countryInfo.countryInfo.lat, lng: _countryInfo.countryInfo.long});
      setMapCenter([_countryInfo.countryInfo.lat, _countryInfo.countryInfo.long]);
      // console.log('map center =>>>> ', mapCenter);
      setMapZoom(3);

      // for all countries ->>
      // for specific country ->>
    }catch(err){
      console.log('Something went wrong while fetching country info : ', err);
    }
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl>
            <Select className="app__dropdown" value={country} variant="outlined" onChange={onCountryChange}>
              <MenuItem key="1" value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country, index) => (
                  <MenuItem key={index+1} value={country.code}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType == 'cases'}
            onClick={e => setCasesType('cases')}
            title="Total Cases"
            activeStats={countryInfo.todayCases}
            totalStats={countryInfo.cases}
          />
          <InfoBox
            active={casesType == 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Total Recovered"
            activeStats={countryInfo.todayRecovered}
            totalStats={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType == 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Total Deaths" activeStats={countryInfo.todayDeaths}
            totalStats={countryInfo.deaths}
          />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h4>Cases By Country</h4>
          <Table countries={countryTable} />
          <h4 className="graph__header">Worldwide {casesType} </h4>
          <LineGraph caseType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
