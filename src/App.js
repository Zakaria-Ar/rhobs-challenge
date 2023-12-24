import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import './App.css';

function App() {
  const { control, watch, setValue } = useForm();
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState(null);
  const isPlanet = watch('isPlanet');
  const gravity = watch('gravity');

  useEffect(() => {
    axios.get('https://api.le-systeme-solaire.net/rest/bodies')
      .then(response => {
        const filteredBodies = response.data.bodies.filter(body => 
          (isPlanet ? body.isPlanet : true) && (!gravity || body.gravity <= gravity)
        );
        setBodies(filteredBodies);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [isPlanet, gravity]);

  useEffect(() => {
    setValue('body', '');
    setSelectedBody(null);
  }, [bodies, setValue]);

  const handleBodyChange = e => {
    const body = bodies.find(b => b.id === e.target.value);
    setSelectedBody(body);
  };

  return (
    <div className="App">
      <h1>RHOBS Challenge</h1>
      <form>
        <div className="form-row">
          <label className="checkbox-label">
            Is Planet
            <Controller
              name="isPlanet"
              control={control}
              render={({ field }) => <input type="checkbox" {...field} />}
            />
          </label>
          <label className="slider-label">
            <Controller
              name="gravity"
              control={control}
              render={({ field }) => <input type="range" {...field} />}
            />
            gravity
          </label>
        </div>
        <label>
          Bodies:
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <select {...field} onChange={handleBodyChange}>
                <option value="">Select a body</option>
                {bodies.map((body) => (
                  <option key={body.id} value={body.id}>{body.name}</option>
                ))}
              </select>
            )}
          />
        </label>
        {selectedBody && (
          <div className="info-box">
            <h2>Info on the body</h2>
            <p>Name: {selectedBody.name}</p>
            <p>Gravity: {selectedBody.gravity ? `${selectedBody.gravity} m/s²` : 'N/A'}</p>
            {/* Autres informations */}
          </div>
        )}
      </form>
    </div>
  );
}

export default App;

