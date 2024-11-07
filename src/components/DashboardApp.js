
import React, { useState, useMemo } from 'react';
import { useData } from '../services/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const DashboardApp = () => {

  const { data } = useData();
  const [filters, setFilters] = useState({
    endYear: 'all',
    topic: 'all',
    sector: 'all',
    region: 'all',
    pest: 'all',
    source: 'all',
    swot: 'all',
    country: 'all',
    city: 'all',
  });
  const [resetFilters, setResetFilters] = useState(false);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };


  const processedData = useMemo(() => {
    return data.filter(item => {
      return (
        (filters.endYear === 'all' || item.end_year === parseInt(filters.endYear)) &&
        (filters.topic === 'all' || item.topic === filters.topic) &&
        (filters.sector === 'all' || item.sector === filters.sector) &&
        (filters.region === 'all' || item.region === filters.region) &&
        (filters.pest === 'all' || item.pestle === filters.pest) &&
        (filters.source === 'all' || item.source === filters.source) &&
        (filters.swot === 'all' || item.swot === filters.swot) &&
        (filters.country === 'all' || item.country === filters.country) &&
        (filters.city === 'all' || item.city === filters.city)
      );
    });
  }, [data, filters]);

  
  const chartData = useMemo(() => {
    const regionCount = {};
    const topicCount = {};
    const yearlyMetrics = {};
    const sectorData = {};
    const countryData = {};
    const cityData = {};
    const swotData = {};

    processedData.forEach(item => {
      
      if (item.region) {
        regionCount[item.region] = (regionCount[item.region] || 0) + 1;
      }

      
      if (item.topic) {
        topicCount[item.topic] = (topicCount[item.topic] || 0) + 1;
      }

      
      if (item.country) {
        countryData[item.country] = (countryData[item.country] || 0) + 1;
      }

      
      if (item.city && item.city !== "") {
        cityData[item.city] = (cityData[item.city] || 0) + 1;
      }

      
      if (item.sector) {
        sectorData[item.sector] = (sectorData[item.sector] || 0) + 1;
      }

      
      if (item.swot && item.swot !== "") {
        swotData[item.swot] = (swotData[item.swot] || 0) + 1;
      }

      
      if (item.end_year) {
        if (!yearlyMetrics[item.end_year]) {
          yearlyMetrics[item.end_year] = {
            intensity: { sum: 0, count: 0 },
            likelihood: { sum: 0, count: 0 },
            relevance: { sum: 0, count: 0 }
          };
        }
        if (item.intensity) {
          yearlyMetrics[item.end_year].intensity.sum += item.intensity;
          yearlyMetrics[item.end_year].intensity.count += 1;
        }
        if (item.likelihood) {
          yearlyMetrics[item.end_year].likelihood.sum += item.likelihood;
          yearlyMetrics[item.end_year].likelihood.count += 1;
        }
        if (item.relevance) {
          yearlyMetrics[item.end_year].relevance.sum += item.relevance;
          yearlyMetrics[item.end_year].relevance.count += 1;
        }
      }
    });

    
    const years = Object.keys(yearlyMetrics).sort();
    const yearlyData = {
      intensity: years.map(year => 
        yearlyMetrics[year].intensity.count > 0 
          ? yearlyMetrics[year].intensity.sum / yearlyMetrics[year].intensity.count 
          : 0
      ),
      likelihood: years.map(year => 
        yearlyMetrics[year].likelihood.count > 0 
          ? yearlyMetrics[year].likelihood.sum / yearlyMetrics[year].likelihood.count 
          : 0
      ),
      relevance: years.map(year => 
        yearlyMetrics[year].relevance.count > 0 
          ? yearlyMetrics[year].relevance.sum / yearlyMetrics[year].relevance.count 
          : 0
      )
    };

    return {
      metricsOverTime: {
        labels: years,
        datasets: [
          {
            label: 'Intensity',
            data: yearlyData.intensity,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Likelihood',
            data: yearlyData.likelihood,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
          {
            label: 'Relevance',
            data: yearlyData.relevance,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1,
          }
        ],
      },
      regionChart: {
        labels: Object.keys(regionCount),
        datasets: [{
          data: Object.values(regionCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        }],
      },
      topicChart: {
        labels: Object.keys(topicCount),
        datasets: [{
          label: 'Topics Distribution',
          data: Object.values(topicCount),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        }],
      },
      countryChart: {
        labels: Object.entries(countryData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([country]) => country),
        datasets: [{
          label: 'Top 10 Countries',
          data: Object.entries(countryData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([, count]) => count),
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
        }],
      },
      cityChart: {
        labels: Object.entries(cityData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([city]) => city),
        datasets: [{
          label: 'Top 10 Cities',
          data: Object.entries(cityData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([, count]) => count),
          backgroundColor: 'rgba(255, 159, 64, 0.8)',
        }],
      },
      sectorChart: {
        labels: Object.keys(sectorData),
        datasets: [{
          data: Object.values(sectorData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        }],
      },
      swotChart: {
        labels: Object.keys(swotData),
        datasets: [{
          label: 'SWOT Analysis',
          data: Object.values(swotData),
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        }],
      },
    };
  }, [processedData]);

  
  const filterOptions = useMemo(() => ({
    endYear: [...new Set(data.map(item => item.end_year))].filter(Boolean).sort(),
    topics: [...new Set(data.map(item => item.topic))].filter(Boolean).sort(),
    regions: [...new Set(data.map(item => item.region))].filter(Boolean).sort(),
    pest: [...new Set(data.map(item => item.pestle))].filter(Boolean).sort(),
    sources: [...new Set(data.map(item => item.source))].filter(Boolean).sort(),
    swot: [...new Set(data.map(item => item.swot))].filter(Boolean).sort(),
    countries: [...new Set(data.map(item => item.country))].filter(Boolean).sort(),
    cities: [...new Set(data.map(item => item.city))].filter(Boolean).filter(city => city !== "").sort(),
    sectors: [...new Set(data.map(item => item.sector))].filter(Boolean).sort(),
  }), [data]);

  const handleFilterChange = (e, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: e.target.value
    }));
  };

  const handleReset = () => {
    setFilters({
      endYear: 'all',
      topic: 'all',
      sector: 'all',
      region: 'all',
      pest: 'all',
      source: 'all',
      swot: 'all',
      country: 'all',
      city: 'all',
    });
    setResetFilters(prev => !prev);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">

      <div className="flex justify-center mb-6">
      
        <h1 className="text-2xl font-bold">Data Visualization Dashboard</h1>
      </div>
    <div className="p-6 space-y-6 bg-gray-50">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow">
        
        <select
          className="p-2 border rounded"
          value={filters.endYear}
          onChange={(e) => handleFilterChange(e, 'endYear')}
        >
          <option value="all">End Year</option>
          {filterOptions.endYear.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.topic}
          onChange={(e) => handleFilterChange(e, 'topic')}
        >
          <option value="all">All Topics</option>
          {filterOptions.topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.sector}
          onChange={(e) => handleFilterChange(e, 'sector')}
        >
          <option value="all">All Sectors</option>
          {filterOptions.sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.region}
          onChange={(e) => handleFilterChange(e, 'region')}
        >
          <option value="all">All Regions</option>
          {filterOptions.regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.pest}
          onChange={(e) => handleFilterChange(e, 'pest')}
        >
          <option value="all">All PEST</option>
          {filterOptions.pest.map(pest => (
            <option key={pest} value={pest}>{pest}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.source}
          onChange={(e) => handleFilterChange(e, 'source')}
        >
          <option value="all">All Sources</option>
          {filterOptions.sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.swot}
          onChange={(e) => handleFilterChange(e, 'swot')}
        >
          <option value="all">All SWOT</option>
          {filterOptions.swot.map(swot => (
            <option key={swot} value={swot}>{swot}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.country}
          onChange={(e) => handleFilterChange(e, 'country')}
        >
          <option value="all">All Countries</option>
          {filterOptions.countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.city}
          onChange={(e) => handleFilterChange(e, 'city')}
        >
          <option value="all">All Cities</option>
          {filterOptions.cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <button
          className="p-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Metrics Over Time</h2>
          <div className="h-80">
            <Line options={options} data={chartData.metricsOverTime} />
          </div>
        </div>

       
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Regional Distribution</h2>
          <div className="h-80">
            <Doughnut options={options} data={chartData.regionChart} />
          </div>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Topics Distribution</h2>
          <div className="h-80">
            <Bar 
              options={{
                ...options,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false }
                }
              }} 
              data={chartData.topicChart} 
            />
          </div>
        </div>

      
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 10 Countries</h2>
          <div className="h-80">
            <Bar 
              options={{
                ...options,
                plugins: {
                  legend: { display: false }
                }
              }} 
              data={chartData.countryChart} 
            />
          </div>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 10 Cities</h2>
          <div className="h-80">
            <Bar 
              options={{
                ...options,
                plugins: {
                  legend: { display: false }
                }
              }} 
              data={chartData.cityChart} 
            />
          </div>
        </div>

       
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sector Distribution</h2>
          <div className="h-80">
            <Pie options={options} data={chartData.sectorChart} />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default DashboardApp;