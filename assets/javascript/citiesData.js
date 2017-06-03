

var cities = [
    {
        name: "New York",
        lat: 40.7128,
        lng: -74.0059,
    },
    {
        name: "Buenos Aires",
        lat: -34.6037,
        lng: -58.3816,
    },
    {
        name: "Bogotá",
        lat: 4.7110,
        lng: -74.0721,
    },
    {
        name: "Rio de Janeiro",
        lat: 22.9068,
        lng: -43.1729,
    },
    {
        name: "Lima",
        lat: -12.0464,
        lng: -77.0428,
    },
    {
        name: "Quito",
        lat: -0.1807,
        lng: -78.4678,
    },
    {
        name: "São Paulo",
        lat: -23.5505,
        lng: -46.6333,
    },
    {
        name: "Medellín",
        lat: 6.2442,
        lng: -75.5812,
    },
    {
        name: "Belo Horizonte",
        lat: -19.9245,
        lng: -43.9352,
    },
    {
        name: "London",
        lat: 51.5074,
        lng: -0.1278,
    },
    {
        name: "Barcelona",
        lat: 41.3851,
        lng: 2.1734,
    },
    {
        name: "Madrid",
        lat: 40.4168,
        lng: 3.7038,
    },
    {
        name: "Munich",
        lat: 48.1351,
        lng: 11.5820,
    },
    {
        name: "Moscow",
        lat: 55.7558,
        lng: 37.6173,
    },
    {
        name: "Berlin",
        lat: 52.5200,
        lng: 13.4050,
    },
    {
        name: "Budapest",
        lat: 47.4979,
        lng: 19.0402,
    },

    {
        name: "Minsk",
        lat: 53.9045,
        lng: 27.5615,
    },
    {
        name: "Prague",
        lat: 50.0755,
        lng: 14.4378,
    },
    {
        name: "Odessa",
        lat: 46.4825,
        lng: 30.7233,
    },
    {
        name: "Torino",
        lat: 45.0703,
        lng: 7.6869,
    },
    {
        name: "Saratov",
        lat: 51.5924,
        lng: 45.9608,
    },
    {
        name: "Sevilla",
        lat: 37.3891,
        lng: 5.9845,
    },
    {
        name: "Irkutsk",
        lat: 52.2870,
        lng: 104.3050,
    },
    {
        name: "Stuttgart",
        lat: 48.7758,
        lng: 9.1829,
    },
    {
        name: "Copenhagen",
        lat: 55.6761,
        lng: 12.5683,
    },
    {
        name: "Oslo",
        lat: 12.5683,
        lng: 10.7522,
    },
    {
        name: "Athens",
        lat: 37.9838,
        lng: 23.7275,
    },
    {
        name: "Valencia",
        lat: 39.4699,
        lng: -0.3763,
    },
    {
        name: "Amsterdam",
        lat: 52.3702,
        lng: 4.8952,
    },
    {
        name: "Tokyo",
        lat: 35.6895,
        lng: 139.6917,
    },
    {
        name: "Kyoto",
        lat: 35.0116,
        lng: 1135.7680,
    },
    {
        name: "Beijing",
        lat: 39.9042,
        lng: 116.4074,
    },
    {
        name: "Hong Kong",
        lat: 22.3964,
        lng: 114.1095,
    },
    {
        name: "Jakarta",
        lat: -6.1751,
        lng: 106.8650,
    },
    {
        name: "Sydney",
        lat: -33.8688,
        lng: 151.2093,
    },
    {
        name: "Mumbai",
        lat: 19.0760,
        lng: 72.8777,
    },
    {
        name: "Hong Kong",
        lat: 22.3964,
        lng: 114.1095,
    },
    {
        name: "Seoul",
        lat: 37.5665,
        lng: 126.9780,
    },
    {
        name: "Chicago",
        lat: 41.8781,
        lng: -87.6298,
    },
    {
        name: "Boston",
        lat: 42.3601,
        lng: -71.0589,
    },
    {
        name: "San Francisco",
        lat: 37.7749,
        lng: -122.4149,
    },
    {
        name: "Los Angeles",
        lat: 35.0522,
        lng: -118.2437,
    },
    {
        name: "Philadelphia",
        lat: 39.9526,
        lng: -75.1652,
    },
    {
        name: "Seattle",
        lat: 47.6062,
        lng: -122.3321,
    },
    {
        name: "New Orleans",
        lat: 29.9511,
        lng: -90.0715,
    },
    {
        name: "Austin",
        lat: 30.2672,
        lng: -97.7431,
    },
    {
        name: "San Diego",
        lat: 32.7157,
        lng: -117.1611,
    },
    {
        name: "Baltimore",
        lat: 39.2904,
        lng: -76.6122,
    },
    {
        name: "Portland",
        lat: 45.512794,
        lng: -122.679565,
    },
    {
        name: "Nashville",
        lat: 36.1627,
        lng: -86.7816,
    },
    {
        name: "Miami",
        lat: 25.7617,
        lng: -80.1918,
    },
    {
        name: "Honolulu",
        lat: 21.3069,
        lng: -157.8583,
    },
    {
        name: "Houston",
        lat: 29.7604,
        lng: -95.3698,
    },
    {
        name: "Minneapolis",
        lat: 44.9778,
        lng: -93.2650,
    },
    {
        name: "Las Vegas",
        lat: 36.1699,
        lng: -115.1398,
    },
    {
        name: "Dallas",
        lat: 32.7767,
        lng: -96.7970,
    },
    {
        name: "San Antonio",
        lat: 29.4241,
        lng: -98.4936,
    },
    {
        name: "Denver",
        lat: 39.7392,
        lng: -104.9903,
    },
    {
        name: "St.Louis",
        lat: 38.6270,
        lng: -90.1994,
    },
    {
        name: "Indianapolis",
        lat: 39.7684,
        lng: -86.1581,
    },
    {
        name: "Detroit",
        lat: 42.3314,
        lng: -83.0458,
    },
    {
        name: "Orlando",
        lat: 28.5383,
        lng: -81.3792,
    },
    {
        name: "Pittsburgh",
        lat: 40.4406,
        lng: -79.9959,
    },
    {
        name: "Kansas City",
        lat: 39.0997,
        lng: -94.5786,
    },
    {
        name: "Fort Worth",
        lat: 32.7555,
        lng: -97.3308,
    },
    {
        name: "Phoenix",
        lat: 33.4484,
        lng: -112.0740,
    },
    {
        name: "Albuquerque",
        lat: 35.0853,
        lng: -106.6056,
    },
    {
        name: "Oklahoma City",
        lat: 35.4676,
        lng: -97.5164,
    },
    {
        name: "Memphis",
        lat: 35.1495,
        lng: -90.0490,
    },
    {
        name: "Raleigh",
        lat: 35.7796,
        lng: -78.6382,
    },
    {
        name: "Omaha",
        lat: 41.2524,
        lng: -95.9980,
    },
    {
        name: "Charleston",
        lat: 32.7765,
        lng: -79.9311,
    },
    {
        name: "Tampa",
        lat: 27.9506,
        lng: -82.4572,
    },
    {
        name: "Cincinnati",
        lat: 39.1031,
        lng: -84.5120,
    },
    {
        name: "San Jose",
        lat: 37.3382,
        lng: -121.8863,
    },
    {
        name: "Jacksonville",
        lat: 30.3322,
        lng: -81.6557,
    },
    {
        name: "Columbus",
        lat: 39.9612,
        lng: -82.9988,
    },
    {
        name: "Charlotte",
        lat: 35.2271,
        lng: -80.8431,
    },
    {
        name: "Cleveland",
        lat: 41.4993,
        lng: -81.6944,
    },
    {
        name: "Savannah",
        lat: 32.0835,
        lng: -81.0998,
    },
    {
        name: "Buffalo",
        lat: 42.8864,
        lng: -78.8784,
    },
    {
        name: "Wichita",
        lat: 37.6872,
        lng: -97.3301,
    },
    {
        name: "Tulsa",
        lat: 36.1540,
        lng: -95.9928,
    },
    {
        name: "Tucson",
        lat: 32.2217,
        lng: -110.9265,
    },
    {
        name: "Oakland",
        lat: 37.8044,
        lng: -122.2711,
    }

];










