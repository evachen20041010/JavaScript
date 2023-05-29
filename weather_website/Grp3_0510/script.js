// 城市對照表，用於將英文城市名稱轉換為中文名稱
var cityMap = {
    "london": "倫敦",
    "paris": "巴黎",
    "newyork": "紐約",
    "tokyo": "東京",
    "beijing": "北京",
    "sydney": "悉尼"
    // 在這裡添加其他城市的對照
};

function searchCities() {
    var cityInput = document.getElementById("cityInput");
    var keyword = cityInput.value;
    var apiKey = "e94b684fdbcadd1b5dd9cd49122603ce"; // 請替換為你的天氣API金鑰
    var lang = "zh_tw"; // 設定語言為繁體中文

    // 發出城市搜尋請求
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${keyword}&limit=10&appid=${apiKey}&lang=${lang}`)
        .then(response => response.json())
        .then(data => {
            var citySelect = document.getElementById("citySelect");
            citySelect.innerHTML = ""; // 清空下拉選單

            // 將搜尋結果顯示在下拉選單中
            data.forEach(city => {
                var option = document.createElement("option");
                option.value = city.name;
                option.text = getCityNameInChinese(city.name);
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.log("發生錯誤：", error);
        });
}

function getCityNameInChinese(cityName) {
    // 在城市對照表中尋找對應的中文名稱
    for (var key in cityMap) {
        if (cityMap.hasOwnProperty(key)) {
            if (cityName.toLowerCase() === key.toLowerCase()) {
                return cityMap[key];
            }
        }
    }
    return cityName; // 若找不到對應的中文名稱，則返回原始英文名稱
}

getWeather();

function reload() {
    var citySelect = document.getElementById("citySelect");
    var selectedCity = citySelect.value;
    localStorage.setItem('selectedCity', selectedCity);
    window.location.reload();
}

function getWeather() {
    var citySelect = document.getElementById("citySelect");
    var selectedCity = citySelect.value;
    var apiKey = "e94b684fdbcadd1b5dd9cd49122603ce"; // 請替換為你的天氣API金鑰
    var lang = "zh_tw"; // 設定語言為繁體中文

    try {
        selectedCity = localStorage.getItem('selectedCity');
        // 發出API請求
        if (selectedCity != null && selectedCity != "") {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&lang=${lang}`)
                .then(response => response.json())
                .then(data => {
                    // 解析天氣數據
                    var temperature = data.main.temp - 273.15; // 將溫度轉換為攝氏溫度
                    var description = data.weather[0].description;

                    // 將天氣數據顯示在網頁上
                    var resultElement = document.getElementById("result");
                    resultElement.innerText = `城市：${getCityNameInChinese(selectedCity)}\n溫度：${temperature.toFixed(1)}℃\n天氣狀況：${description}`;

                    // 顯示 OpenStreetMap
                    showMap(data.coord.lat, data.coord.lon);
                })
                .catch(error => {
                    console.log("發生錯誤：", error);
                });
        }
    } catch (e) {
        console.log("發生錯誤：", e);
    }
}

function showMap(lat, lon) {
    const center = [lat, lon]; // 中心點座標
    const zoom = 8; // 縮放 0 - 18
    const map = L.map('map').setView(center, zoom);
    const osmUri = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';    // 商用時必須要有版權出處
    const attribution = '© OpenStreetMap';

    // 主要地圖
    L.tileLayer(osmUri, {
        attribution: attribution,
        zoomControl: true,  // 是否秀出 - + 按鈕
    }).addTo(map);

    // 小地圖
    let miniWidth = 150, miniHeight = 150;;
    if (document.body.clientWidth <= 640) {
        miniWidth = 75;
        miniHeight = 75;
    }
    const miniOSM = new L.TileLayer(osmUri, {
        minZoom: zoom, maxZoom: 13,
        attribution: attribution
    });
    const miniMap = new L.Control.MiniMap(miniOSM, {
        width: miniWidth,
        height: miniHeight,
    }).addTo(map);

    //放置 Marker
    const marker = L.marker(center, {
        //title: '跟 <a> 的 title 一樣', // 跟 <a> 的 title 一樣
        opacity: 1.0
    }).addTo(map);

    // 加上 Popup
    marker.bindPopup("<b>我在這裡！</b>").openPopup();

    //Map 點擊事件
    const popup = L.popup();
    function onMapClick(e) {
        let lat = e.latlng.lat; // 緯度
        let lng = e.latlng.lng; // 經度
        popup
            .setLatLng(e.latlng)
            .setContent(`緯度：${lat}<br/>經度：${lng}`)
            .openOn(map);
    }
    map.on('click', onMapClick);

    //改變地圖樣式
    var baselayers = {
        'OpenStreetMap.Mapnik': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        'OpenStreetMap.DE': L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'),
        'OpenStreetMap.CH': L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png'),
        'OpenStreetMap.France': L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),
        'OpenStreetMap.HOT': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
        'OpenStreetMap.BZH': L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'),
        'OpenTopoMap': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
    };
    var overlays = {};
    L.control.layers(baselayers, overlays).addTo(map);
    baselayers['OpenStreetMap.Mapnik'].addTo(map);

    //定位使用者位置
    L.control.locate({
        position: 'topleft',
        locateOptions: {
            enableHighAccuracy: true
        },
        strings: {
            title: '定位我的位置',
            metersUnit: '公尺',
            feetUnit: '英尺',
            popup: '距離誤差：{distance}{unit}以內'
        },
        clickBehavior: {
            inView: 'stop',
            outOfView: 'setView',
            inViewNotFollowing: 'inView'
        }
    }).addTo(map);
}