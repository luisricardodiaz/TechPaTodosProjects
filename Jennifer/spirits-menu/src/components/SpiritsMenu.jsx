import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// We parse the CSV Data to get rid of any empty lines
const parseCSVData = (csvData) => {
  // We check if the csvData file is not null
  if (!csvData) return [];
  
  /** If it isn't null, then we split each new line starting at index 1 (index 0 is the classifier header). 
  We also get rid of any empty space  **/
  try {
    const lines = csvData.split('\n').slice(1).filter(line => line.trim());
    
    // We group the spirits into a category, an this case we are grouping by spirit.
    const spiritGroups = lines.reduce((acc, line) => {
      // We destructure a specific line in the csv file representing an spirit and assign it to 5 variables.
      const [name, price2oz, price1oz, priceHalf, spirit] = line.split(',').map(item => item?.trim() || '');
      
      if (!spirit) return acc;
      
      if (!acc[spirit]) {
        acc[spirit] = {
          category: spirit,
          items: []
        };
      }
      
      acc[spirit].items.push({
        name,
        price_2oz: parseInt(price2oz) ? `$${parseInt(price2oz)}` : "N/A",
        price_1oz: parseInt(price1oz) ? `$${parseInt(price1oz)}` : "N/A",
        price_half: parseInt(priceHalf) ? `$${parseInt(priceHalf)}` : "N/A"
      });
      
      return acc;
    }, {});

    console.log(spiritGroups)
    return Object.values(spiritGroups);
    
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
};

const SpiritsMenu = () => {
  const [spirits, setSpirits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/all-drinks.csv');
        if (!response.ok) {
          throw new Error('Failed to load CSV file');
        }
        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        setSpirits(parsedData);
      } catch (err) {
        console.error('Error loading CSV:', err);
        setError('Failed to load spirits data. Please ensure the CSV file is in the public directory.');
      }
    };

    loadCSVData();
  }, []);

  const categories = ['All', ...new Set(spirits.map(s => s.category))];

  const filteredSpirits = spirits
    .map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => 
      (selectedCategory === 'All' || category.category === selectedCategory) && 
      category.items.length > 0
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <header className="bg-orange-800 text-white py-8 mb-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-serif mb-2">Fine Spirits Selection</h1>
          <p className="text-gray-100 font-serif">Curated collection of premium spirits</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        {/* Search and Filter Controls */}
        <div className="bg-black rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search spirits..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg bg-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        )}

        {/* No Data Message */}
        {!error && spirits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Loading spirits data...
          </div>
        )}

        {/* Spirits List */}
        <div className="space-y-8">
          {filteredSpirits.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b border-gray-100">
                {category.category}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 text-stone-600 font-semibold">Spirit</th>
                      <th className="text-right py-4 px-6 text-stone-600 font-semibold">2 oz</th>
                      <th className="text-right py-4 px-6 text-stone-600 font-semibold">1 oz</th>
                      <th className="text-right py-4 px-6 text-stone-600 font-semibold">½ oz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, index) => (
                      <tr 
                        key={item.name}
                        className={`
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          hover:bg-blue-50 transition-colors
                        `}
                      >
                        <td className="py-4 px-6 text-stone-600 font-medium">{item.name}</td>
                        <td className="text-right text-stone-600 py-4 px-6">{item.price_2oz}</td>
                        <td className="text-right text-stone-600 py-4 px-6">{item.price_1oz}</td>
                        <td className="text-right text-stone-600 py-4 px-6">{item.price_half}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SpiritsMenu;