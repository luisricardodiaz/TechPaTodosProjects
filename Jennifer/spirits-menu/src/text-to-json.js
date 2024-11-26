function formatSpiritList(input) {
    // Split input into lines and filter out empty lines
    const lines = input.split('\n').filter(line => line.trim());
    
    let currentCategory = '';
    const result = [];
    let currentCategoryObject = null;
    
    lines.forEach(line => {
        // If line is in all caps, it's a category
        if (line === line.toUpperCase() && !line.match(/\d+\/\d+/)) {
            currentCategory = line.trim();
            currentCategoryObject = {
                category: currentCategory,
                items: []
            };
            result.push(currentCategoryObject);
        } else {
            // Parse spirit line with both /X and non-X formats
            const matches = line.match(/(.*?)\s+(\d+)\/(\d+)(\/X)?$/);
            if (matches && currentCategoryObject) {
                const [_, name, price2oz, price1oz] = matches;
                currentCategoryObject.items.push({
                    name: (name.trim()),
                    price_2oz: parseInt(price2oz),
                    price_1oz: parseInt(price1oz),
                    price_half: Math.ceil(parseInt(price1oz) / 2)
                });
            }
        }
    });
    
    return result;
}

// Test input
const input = ""

// Format and output
const result = formatSpiritList(input);
console.log('const spirits = ' + JSON.stringify(result, null, 2) + ';');

// Test the output
const formattedOutput = formatSpiritList(input);
console.log('\nProcessed items count:', formattedOutput[0].items.length);
formattedOutput[0].items.forEach(item => {
    console.log(`\nProcessed: ${item.name}`);
    console.log(`Prices: ${item.price_2oz}/${item.price_1oz}/${item.price_half}`);
});