mapboxgl.accessToken = 'pk.eyJ1IjoiaW9zZXJ2aWNlZGVzayIsImEiOiJjanZvaXVhejkxdDh5NDhwYmxqbzE0MmZqIn0.-wFzMVbZTxRePP3py2QbXA'; //Mapbox token 
var map = new mapboxgl.Map({
    container: 'map', // container id
    // style: 'mapbox://styles/ioservicedesk/cjyfq2zsf56wl1ds8p1hc6xb2',
    style:'mapbox://styles/mapbox/light-v10',
    center: [0, 0], // starting position
    zoom: 1.4,// starting zoom
});


map.on('load', function(e){
    // add data source
    map.addSource('working_area',{
        type:'geojson',
        data:'./data.geojson'
    });

    map.addLayer({
        id:'working_area',
        type:'fill',
        source:'working_area',
        paint:{
            'fill-color':[
                'match',
                ['get', 'membe'],
                'true',
                '#B81E3C',
                'false',
                '#CCD0D6',
                '#CCD0D6'
            ],
            'fill-opacity':1,
            'fill-outline-color':'#fff',
        }
    });

    map.addLayer({
        id:'line-poly',
        source:'working_area',
        type:'line',
        paint:{
            'line-width':1.6,
            'line-color':"#fff"
        }
    });

    // load the data
    // fetch('data.geojson')
    //     .then(res=>res.json())
    //     .then(data =>{
    //         map.getSource('').setData(data);
    //     });
    
    // click events
    map.on('click', 'working_area', function(e){
        var features = map.queryRenderedFeatures(e.point, {
            layers:['working_area']
        });

        // console.log(features)

        // get the first feature
        var feature = features[0];
        var coordinates = e.lngLat;

        // var description = "<div>"+feature.properties.NAME+"</div>"

        // get the tags
        var countryName = feature.properties.NAME.toString().toLowerCase();
        countryName = countryName.replace(' ','-');

        var description = $('#'+countryName).html();

        if(feature.properties.membe == 'false'){
            return;
        }

        // fit to layer bounds
        var bbox = turf.bbox(feature);
        console.log(bbox);
        map.fitBounds(bbox, { padding: 50, maxZoom:3 });

        setTimeout(function(e){
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        },400);
        
    });

    // Change mouse type
    map.on('mouseover', 'working_area', function(e){
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'working_area', function(e){
        map.getCanvas().style.cursor = '';
    });


});