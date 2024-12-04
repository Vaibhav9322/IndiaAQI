// Initialize the map
const map = L.map("map").setView([22.9734, 78.6569], 5); // Center on India

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

// OpenWeatherMap API details
const API_KEY = "48d082ed2ca3e98c7122bfe06a3e1e6c";

// List of all major cities in India
const cities = [
    { name: "Delhi", coords: [28.7041, 77.1025] },
    { name: "Mumbai", coords: [19.0760, 72.8777] },
    { name: "Chennai", coords: [13.0827, 80.2707] },
    { name: "Kolkata", coords: [22.5726, 88.3639] },
    { name: "Bengaluru", coords: [12.9716, 77.5946] },
    { name: "Hyderabad", coords: [17.3850, 78.4867] },
    { name: "Pune", coords: [18.5204, 73.8567] },
    { name: "Ahmedabad", coords: [23.0225, 72.5714] },
    { name: "Jaipur", coords: [26.9124, 75.7873] },
    { name: "Lucknow", coords: [26.8467, 80.9462] },
    { name: "Kanpur", coords: [26.4499, 80.3319] },
    { name: "Nagpur", coords: [21.1458, 79.0882] },
    { name: "Indore", coords: [22.7196, 75.8577] },
    { name: "Bhopal", coords: [23.2599, 77.4126] },
    { name: "Surat", coords: [21.1702, 72.8311] },
    { name: "Patna", coords: [25.5941, 85.1376] },
    { name: "Vadodara", coords: [22.3072, 73.1812] },
    { name: "Visakhapatnam", coords: [17.6868, 83.2185] },
    { name: "Coimbatore", coords: [11.0168, 76.9558] },
    { name: "Madurai", coords: [9.9252, 78.1198] },
    { name: "Agra", coords: [27.1767, 78.0081] },
    { name: "Chandigarh", coords: [30.7333, 76.7794] },
    { name: "Guwahati", coords: [26.1445, 91.7362] },
    { name: "Nashik", coords: [19.9975, 73.7898] },
    { name: "Jammu", coords: [32.7266, 74.8570] },
    { name: "Ranchi", coords: [23.3441, 85.3096] },
    { name: "Kochi", coords: [9.9312, 76.2673] },
    { name: "Mysore", coords: [12.2958, 76.6394] },
    { name: "Vijayawada", coords: [16.5062, 80.6480] },
    { name: "Faridabad", coords: [28.4089, 77.3178] },
    { name: "Gurgaon", coords: [28.4595, 77.0266] },
    { name: "Noida", coords: [28.5355, 77.3910] },
];

// Function to fetch AQI data
async function fetchAQI(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.list[0].main.aqi; // Return AQI value
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        return null;
    }
}

// AQI Levels with Description and Color
function getAQIDetails(aqi) {
    const levels = [
        { level: "Good", color: "green" },
        { level: "Fair", color: "yellow" },
        { level: "Moderate", color: "orange" },
        { level: "Poor", color: "red" },
        { level: "Very Poor", color: "purple" },
    ];
    return levels[aqi - 1] || { level: "Unknown", color: "gray" };
}

// Function to add markers to the map
async function addMarkers() {
    const markerLayer = L.layerGroup().addTo(map); // Group to manage markers

    for (const city of cities) {
        const aqi = await fetchAQI(city.coords[0], city.coords[1]);
        const { level, color } = getAQIDetails(aqi);

        // Add marker to the map
        const marker = L.marker(city.coords)
            .addTo(markerLayer)
            .bindPopup(
                `<b>${city.name}</b><br>AQI: <span style="color:${color}; font-weight: bold;">${level} (${aqi})</span>`
            );

        // Open popup on click
        marker.on("click", () => {
            marker.openPopup();
        });
    }

    // Add a search control to the map
    const searchControl = new L.Control.Search({
        layer: markerLayer,
        initial: false,
        zoom: 10,
        marker: false,
        textPlaceholder: "Search for a city...",
    });
    map.addControl(searchControl);
}

// Call the function to add markers
addMarkers();
