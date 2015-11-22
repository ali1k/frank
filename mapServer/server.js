var Config = require('./config');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var rp = require("request-promise");
var async = require("async");
var path = require('path');
//-----------template engine
var hogan  = require("hogan-express");
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'html');
app.set('view options', { layout: false });
//server.enable('view cache');
app.engine('html', hogan);
//------------------
//Creating Router() object

app.get("/",function(req,res){
  res.json({"message" : "Hello! I am an app! Try this example: /events"});
});
var parseVirtPolygon = function(input) {
    var tmp = input.split(')');
    var tl = tmp.length;
    if(tl){
        if(tl === 3){
            //normal polygon
            //console.log(tmp);
        }else if (tl === 4){
            //polygon with holes
            //console.log(tmp);
        }
        var tmp2 = tmp[0].split('(');
        var tmp3 = tmp2[2].split(',');
        return tmp3;
    }else{
        return [];
    }
};

function get_random_color() {var letters = "ABCDE".split("");var color = "#";for (var i=0; i<3; i++ ) {color += letters[Math.floor(Math.random() * letters.length)];}return color;}

app.get('/events', function(req, res) {

    var apiURI = 'http://localhost:3000/api/dataset.polygons;';
    var polygons;
    var colors = ['#0bc4a7', '#1a48eb', '#ecdc0b', '#ed1ec6', '#d9990b', '#0c0d17', '#e3104f', '#6d8ecf', '#0bc4a7'];
    rp.get({uri: apiURI}).then(function(body){
        var parsed = JSON.parse(body);
        //list of regions
        polygons = parsed.polygons;
        // All tasks are done now
            var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" /><style>		.info {padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.8);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px;}.info h4 {margin: 0 0 5px;color: #777;}</style><title>PointToMunicipality: ('+req.params.country+')</title> ';
            var features = [];
            var colorsObject = {};
            polygons.forEach(function(input, i){
                //console.log(input.name, input.id);
                var points = parseVirtPolygon(input.geometry);
                //console.log(input.name, input.id);
                var coordinatesArr = [];
                points.forEach(function(el){
                    var tmp = el.split(' ');
                    coordinatesArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])])
                })
                features.push({"type": "Feature", "id": encodeURIComponent(input.s), "properties": {"name": input.label}, "geometry": {"type": "Polygon", coordinates: [coordinatesArr]}});
                colorsObject[encodeURIComponent(input.s)] = get_random_color();
            });
            var focusPoint = features[0].geometry.coordinates[0][0];
            var mapboxAccessToken = Config.mapboxKey;
            var mcpData = {"type":"FeatureCollection","features": features};
            finalScript = finalScript +  '</head><body><div class="ui segments"><div class="ui segment"></div><div class="ui segment"><div id="map" style="width:1000px;height:700px;"></div></div></div><script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script><script> var colorObject = '+JSON.stringify(colorsObject)+'; function getColor(d) { return colorObject[d];}	function style(feature) {return {weight: 2,opacity: 1,color: "black",dashArray: "3",fillOpacity: 1,fillColor: getColor(feature.id)};} var map = L.map("map").setView([ "48.2000", "16.3667"], 7); var info = L.control();info.onAdd = function (map) {this._div = L.DomUtil.create("div", "info");this.update();return this._div;};info.update = function (props) {this._div.innerHTML = "<h4>Events: </h4>" +  (props ? "<b>" + props.name + "</b><br/>" : "Hover over a region");}; info.addTo(map);function highlightFeature(e) {var layer = e.target;layer.setStyle({weight: 5,color: "#666",dashArray: "",fillOpacity: 0.7}); if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); } info.update(layer.feature.properties); } function resetHighlight(e) { geojson.resetStyle(e.target); info.update();} function zoomToFeature(e) {map.fitBounds(e.target.getBounds());} function onEachFeature(feature, layer) {layer.on({mouseover: highlightFeature,mouseout: resetHighlight,click: zoomToFeature});}  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {attribution: \'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>\',maxZoom: 18,id: "mapbox.light",accessToken: "'+mapboxAccessToken+'"}).addTo(map); var geojson = L.geoJson('+JSON.stringify(mcpData)+', {style: style, onEachFeature: onEachFeature}).addTo(map);</script></body></html>';
            res.send(finalScript);

    }).catch(function (err) {
        console.log(err);
        res.send('');
        return 0;
    });
});

app.listen(5432,function(){
  console.log("Live at Port 5432");
});
