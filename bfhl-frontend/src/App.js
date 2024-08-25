import React, { useState } from 'react';
import Select from 'react-select';  // Import react-select
import './App.css';

function App() {
  const [inputData, setInputData] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setJsonData(null);
    try {
      const parsedInput = JSON.parse(inputData);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError('Invalid JSON format. "data" should be an array.');
        return;
      }

      // Make API call
      const response = await fetch('https://bhfl-api.onrender.com/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });

      const result = await response.json();
      setJsonData(result);
    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []); // Handle case when no options are selected
  };

  const renderResponse = () => {
    if (!jsonData) return null;

    let responseItems = [];

    if (selectedFilters.some(filter => filter.value === 'Numbers') && jsonData.numbers.length > 0) {
      responseItems.push(<div key="numbers">Numbers: {jsonData.numbers.join(', ')}</div>);
    }
    if (selectedFilters.some(filter => filter.value === 'Alphabets') && jsonData.alphabets.length > 0) {
      responseItems.push(<div key="alphabets">Alphabets: {jsonData.alphabets.join(', ')}</div>);
    }
    if (selectedFilters.some(filter => filter.value === 'Highest Lowercase Alphabet') && jsonData.highest_alphabet.length > 0) {
      responseItems.push(<div key="highest_alphabet">Highest Lowercase Alphabet: {jsonData.highest_alphabet.join(', ')}</div>);
    }

    return <div className="filtered-response">{responseItems}</div>;
  };

  const filterOptions = [
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  return (
    <div className="App">
      <h1>BFHL API Input</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='{"data":["M","1","334","4","B"]}'
          value={inputData}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error">{error}</div>}
      {jsonData && (
        <>
          <Select
            options={filterOptions}
            isMulti
            onChange={handleFilterChange}
            placeholder="Multi Filter"
            className="multi-select"
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
