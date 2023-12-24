import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import './App.css'; // Assurez-vous d'avoir un fichier App.css avec le style nécessaire

function App() {
  const { control, watch } = useForm({
    defaultValues: {
      isPlanet: false,
      gravity: 1
    }
  });

  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState(null);

  const isPlanetChecked = watch('isPlanet');
  const gravityValue = watch('gravity');

  useEffect(() => {
    axios.get('https://api.le-systeme-solaire.net/rest/bodies')
      .then(response => {
        const filteredBodies = response.data.bodies.filter(body => {
          return (isPlanetChecked ? body.isPlanet : true) && body.gravity <= gravityValue;
        });
        setBodies(filteredBodies);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [isPlanetChecked, gravityValue]);

  const handleBodySelection = (event) => {
    const bodyID = event.target.value;
    const bodyInfo = bodies.find(body => body.id === bodyID);
    setSelectedBody(bodyInfo);
  };

  return (
    <div className="App">
      <h1>RHOBS Challenge</h1>
      <form>
        <label>
          Is Planet
          <Controller
            name="isPlanet"
            control={control}
            render={({ field }) => <input type="checkbox" {...field} />}
          />
        </label>
        <label>
          Gravity
          <Controller
            name="gravity"
            control={control}
            render={({ field }) => <input type="range" {...field} min="0" max="5" step="0.1" />}
          />
        </label>
        <label>
          Bodies:
          <select onChange={handleBodySelection}>
            {bodies.map(body => (
              <option key={body.id} value={body.id}>{body.name}</option>
            ))}
          </select>
        </label>
      </form>
      {selectedBody && (
        <div className="body-info">
          <h2>Info on the body</h2>
          <p>Name: {selectedBody.name}</p>
          <p>Gravity: {selectedBody.gravity} m/s²</p>
          {/* Affichez ici d'autres informations du corps sélectionné */}
        </div>
      )}
    </div>
  );
}

export default App;
