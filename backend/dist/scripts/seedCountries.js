import sequelize from "../config/db.js";
import { Country } from "../models/contry.model.js";
// Sample countries with state/region population data
const countriesData = [
    {
        name: "United States",
        code: "US",
        population: 331900000,
        flag: "https://flagcdn.com/us.svg",
        region: "Americas",
        capital: "Washington, D.C.",
        states: [
            { name: "California", population: 39500000 },
            { name: "Texas", population: 29100000 },
            { name: "Florida", population: 21500000 },
            { name: "New York", population: 19450000 },
            { name: "Pennsylvania", population: 12800000 },
        ],
    },
    {
        name: "India",
        code: "IN",
        population: 1417173000,
        flag: "https://flagcdn.com/in.svg",
        region: "Asia",
        capital: "New Delhi",
        states: [
            { name: "Uttar Pradesh", population: 232900000 },
            { name: "Maharashtra", population: 125100000 },
            { name: "Bihar", population: 104100000 },
            { name: "West Bengal", population: 93100000 },
            { name: "Madhya Pradesh", population: 85400000 },
        ],
    },
    {
        name: "China",
        code: "CN",
        population: 1425887000,
        flag: "https://flagcdn.com/cn.svg",
        region: "Asia",
        capital: "Beijing",
        states: [
            { name: "Guangdong", population: 126400000 },
            { name: "Shandong", population: 101700000 },
            { name: "Henan", population: 99400000 },
            { name: "Sichuan", population: 83400000 },
            { name: "Jiangsu", population: 84800000 },
        ],
    },
    {
        name: "United Kingdom",
        code: "GB",
        population: 67736800,
        flag: "https://flagcdn.com/gb.svg",
        region: "Europe",
        capital: "London",
        states: [
            { name: "England", population: 56500000 },
            { name: "Scotland", population: 5460000 },
            { name: "Wales", population: 3110000 },
            { name: "Northern Ireland", population: 1937000 },
        ],
    },
    {
        name: "Germany",
        code: "DE",
        population: 83406000,
        flag: "https://flagcdn.com/de.svg",
        region: "Europe",
        capital: "Berlin",
        states: [
            { name: "North Rhine-Westphalia", population: 17930000 },
            { name: "Bavaria", population: 13140000 },
            { name: "Baden-Württemberg", population: 11070000 },
            { name: "Lower Saxony", population: 7940000 },
            { name: "Hesse", population: 6270000 },
        ],
    },
    {
        name: "France",
        code: "FR",
        population: 65880000,
        flag: "https://flagcdn.com/fr.svg",
        region: "Europe",
        capital: "Paris",
        states: [
            { name: "Île-de-France", population: 12405000 },
            { name: "Provence-Alpes-Côte d'Azur", population: 5055000 },
            { name: "Auvergne-Rhône-Alpes", population: 8085000 },
            { name: "Occitanie", population: 6000000 },
            { name: "Nouvelle-Aquitaine", population: 6033000 },
        ],
    },
    {
        name: "Japan",
        code: "JP",
        population: 125100000,
        flag: "https://flagcdn.com/jp.svg",
        region: "Asia",
        capital: "Tokyo",
        states: [
            { name: "Tokyo", population: 14000000 },
            { name: "Kanagawa", population: 9215000 },
            { name: "Osaka", population: 8835000 },
            { name: "Aichi", population: 7552000 },
            { name: "Hyogo", population: 5469000 },
        ],
    },
    {
        name: "Brazil",
        code: "BR",
        population: 215313000,
        flag: "https://flagcdn.com/br.svg",
        region: "Americas",
        capital: "Brasília",
        states: [
            { name: "São Paulo", population: 46649000 },
            { name: "Minas Gerais", population: 21168000 },
            { name: "Rio de Janeiro", population: 17463000 },
            { name: "Bahia", population: 14985000 },
            { name: "Paraná", population: 11963000 },
        ],
    },
    {
        name: "Russia",
        code: "RU",
        population: 144713000,
        flag: "https://flagcdn.com/ru.svg",
        region: "Europe",
        capital: "Moscow",
        states: [
            { name: "Moscow Oblast", population: 8607000 },
            { name: "Saint Petersburg", population: 5601000 },
            { name: "Krasnodar Krai", population: 5608000 },
            { name: "Tatarstan", population: 3941000 },
            { name: "Sverdlovsk Oblast", population: 4321000 },
        ],
    },
    {
        name: "Canada",
        code: "CA",
        population: 39742000,
        flag: "https://flagcdn.com/ca.svg",
        region: "Americas",
        capital: "Ottawa",
        states: [
            { name: "Ontario", population: 15603000 },
            { name: "Quebec", population: 8574000 },
            { name: "British Columbia", population: 5457000 },
            { name: "Alberta", population: 4857000 },
            { name: "Manitoba", population: 1435000 },
        ],
    },
    {
        name: "Australia",
        code: "AU",
        population: 26100000,
        flag: "https://flagcdn.com/au.svg",
        region: "Oceania",
        capital: "Canberra",
        states: [
            { name: "New South Wales", population: 8182000 },
            { name: "Victoria", population: 6648000 },
            { name: "Queensland", population: 5226000 },
            { name: "Western Australia", population: 2660000 },
            { name: "South Australia", population: 1816000 },
        ],
    },
    {
        name: "Mexico",
        code: "MX",
        population: 128933000,
        flag: "https://flagcdn.com/mx.svg",
        region: "Americas",
        capital: "Mexico City",
        states: [
            { name: "Mexico City", population: 21919000 },
            { name: "State of Mexico", population: 17361000 },
            { name: "Veracruz", population: 7643000 },
            { name: "Jalisco", population: 8341000 },
            { name: "Puebla", population: 6602000 },
        ],
    },
];
const seedCountries = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synced");
        // Check if countries already exist
        const existingCount = await Country.count();
        if (existingCount > 0) {
            console.log(`${existingCount} countries already exist. Skipping seed.`);
            return;
        }
        // Bulk create countries
        await Country.bulkCreate(countriesData);
        console.log("✅ Sample countries with state data added successfully!");
    }
    catch (error) {
        console.error("Error seeding countries:", error);
    }
};
seedCountries().then(() => process.exit(0));
//# sourceMappingURL=seedCountries.js.map