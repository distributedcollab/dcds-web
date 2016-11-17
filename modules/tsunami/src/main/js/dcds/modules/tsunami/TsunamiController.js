/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(['ext', 'ol', 'iweb/CoreModule', "./TsunamiModel", 'dcds/modules/UserProfileModule'],
		function(Ext, ol, Core, TsunamiModel, UserProfile){
	
	return Ext.define('modules.tsunami.TsunamiController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.tsunamicontroller',
		
		startex: null,
		
		layerInited: false,
		
		tsunamiLayer: null,
		
		vectorSource: null,
		
		constructor: function(datatree){
			this.model = new TsunamiModel();
			this.addTreeItem(datatree.getRootNode());
			datatree.getStore().on("rootchange", this.onTreeRootChange.bind(this));
			datatree.on("checkchange", this.onTreeCheckchange.bind(this));
		},
		
		addTreeItem: function(root) {
			this.node = root.appendChild({
				text: "Tsunami",
				checked: false,
				leaf: true,
				iconCls: 'datatree-no-icon'
			});
		},
		
		onTreeRootChange: function(newRoot, oldRoot, eOpts) {
			this.addTreeItem(newRoot);
		},
		
		onTreeCheckchange: function(node, checked, eOpts) {
			if (node !== this.node) {
				return;
			}
			
			if (checked) {
				this.layer = this.buildLayer();
				Core.Ext.Map.addLayer(this.layer);
			} else {
				Core.Ext.Map.removeLayer(this.layer);
				this.layer = null;
			}
		},
		
		defaultStyle: new ol.style.Style({
			image: new ol.style.Circle({
				fill: new ol.style.Fill({
					color: 'rgba(40, 40, 215, 0.9)'
				}),
				stroke: new ol.style.Stroke({
					color: '#3399CC',
			    	width: 3
			    }),
				radius: 10
			}),
			fill: new ol.style.Fill({
				color: 'rgba(40, 40, 215, 0.9)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(40, 40, 215, 0.9)',
		    	width: 3
		    }) 
	    }), // TODO:
		
	    
	    quakeStyle: new ol.style.Style({
			image: new ol.style.Circle({
				fill: new ol.style.Fill({
					color: 'rgba(40, 40, 215, 0.9)'
				}),
				stroke: new ol.style.Stroke({
					color: '#3399CC',
			    	width: 3
			    }),
				radius: 10
			}),
			fill: new ol.style.Fill({
				color: 'rgba(40, 40, 215, 0.9)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(40, 40, 215, 0.9)',
		    	width: 3
		    }) 
	    }),
		
		
		init: function(){
			this.mediator = Core.Mediator.getInstance();
			
			//Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
		},
		
		onLoadUserProfile: function(e) {
			//request the active users
			var url = Ext.String.format("{0}/users/{1}/active", 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
			this.mediator.sendRequestMessage(url, "DCDS.activeUsers");
		},
		
		onStartClick: function(e, what) {
			this.doStart();
		},
		
		onToggleClick: function(e, what) {						
			this.tsunamiLayer.setVisible(!this.tsunamiLayer.getVisible());
		},
		
		onRefreshClick: function(e, what) {
			this.doRefresh();
		},
		
		onTestClick: function() {
			var feature = this.vectorSource.getFeatureById("PAC-WAK");			
			
			var style = this.getTsunamiStyle("orange");
			feature.setStyle(style);
			
		},
		
		initTsunamiLayer: function() {
		
			this.vectorSource = new ol.source.Vector();
			
			this.tsunamiLayer = new ol.layer.Vector({
				title: "Tsunami Layer",
				source: this.vectorSource 
			});
		},
		
		
		buildLayer: function() {
			if(!this.tsunamiLayer) {
				this.initTsunamiLayer();
				this.startex = new Date().getTime() / 1000;
				this.addInitialDataset(this.startex, this.model.getDatasetCopy());
			}
			
			return this.tsunamiLayer;
		},
		
		
		doRefresh: function() {
			var newNow = new Date().getTime() / 1000;
			var id;
			for(var i = 0; i < this.model.tsunami_dataset.length; i++) {
				id = this.model.tsunami_dataset[i].id;
				
				this.updateFeature(newNow, this.vectorSource.getFeatureById(id));
			}
		},
		
		updateFeature: function(newNow, feature) {
			var arrivalTime = feature.get('arrivalTime');
			
			var diff = arrivalTime - newNow;
			
			var style = this.getTsunamiStyle( this.getUpdatedWarningLevel(newNow, arrivalTime) );
			
			feature.setStyle(style);
		},
		
		getTsunami: function(data) {
			var tsunami = {};
			
			/*
			 {
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450640979,
				"maxAmplitude": {
					"unit": "cm",
					"value": 19.31
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -7.81774
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "5th Street",
				"warningPointCode": "5ST",
				"location": {
					"lon": 202.03,
					"lat": 21.35
				},
				"id": "PAC-5ST"
			}
			  
			 */
			
			tsunami.id = data.id;
			tsunami.country = data.country;
			tsunami.location = data.name + ", " + data.grid + ", " + data.country;
			tsunami.lon = data.location.lon;
			tsunami.lat = data.location.lat;
			tsunami.warningPointCode = data.warningPointCode;
			tsunami.arrivalTime = data.arrivalTime;
			tsunami.amplitude = data.minAmplitude.value + data.minAmplitude.unit +
				" / " + data.maxAmplitude.value + data.maxAmplitude.unit;
			tsunami.twc = data.twc;
			tsunami.ifmCode = data.ifmCode;
			tsunami.provider = data.provider;
			
			//console.log("Original arrival time: " + data.arrivalTime);
			tsunami.diff = data.arrivalTime - this.model.getOriginalStartex();
			//console.log("Diff is initial arrivalTime - original startex: " + data.arrivalTime + " - " + 
				//	this.model.getOriginalStartex() + " = " + tsunami.diff);
			
			//console.log("New Arrival time is startex + diff: " + this.startex + ", " + tsunami.diff);
			tsunami.newArrivalTime = this.startex + tsunami.diff;
			//console.log("new arrival time: " + tsunami.newArrivalTime + ", " + 
				//	(new Date(tsunami.newArrivalTime*1000)));
						
			tsunami.warningLevel = this.getUpdatedWarningLevel(new Date().getTime()/1000, tsunami.newArrivalTime);
			//console.log("Got warning level: " + tsunami.warningLevel);
			
			return tsunami;
		},
		
		addInitialDataset: function(startex, dataset) {
			for(var i = 0; i < dataset.length; i++) {
				this.addFeature(this.getTsunami(dataset[i]));
			}
		},
		
		buildGeometry: function(lon, lat) {
			var geometry = null;
			try {
				console.log(Ext.String.format("Setting LON,LAT: ({0},{1})", lon, lat));
				
				// Adjust source data to within bounds
				lon = (lon > 180) ? (lon - 360) : lon;
                lon = (lon < -180) ? (lon + 360) : lon;
				
				var xformedPoint = new ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326',     
					'EPSG:3857');
				console.log("LON/LAT transformed to: " + xformedPoint);
				geometry = new ol.geom.Point(xformedPoint);
				
			} catch(e) {
				console.log(Ext.String.format("Exception transforming report geometry ({0}, {1}): {2}:{3}",
						lon, lat, e.name, e.message));
				return null;
			}
			
			return geometry;
		},
		
		addFeature: function(tsunami, style) {
			
			var geometry = this.buildGeometry(tsunami.lon, tsunami.lat);
			if(geometry === null) {
				console.log("Error building valid geometry, not adding feature");
				return;
			}
			
			var description = Ext.String.format(
					"<b>ID</b>: {0}<br/><b>Amplitude (min/max)</b>: {1}<br/><b>Arrival Time</b>: {2}<br/>" +
					"<b>Location</b>: {3}", 
					tsunami.id, tsunami.amplitude,
					new Date(tsunami.newArrivalTime*1000).toUTCString(), tsunami.location);
						
			var feature = new ol.Feature({
				geometry: geometry,
				type: 'Tsunami Warning',
				name: tsunami.name,
				arrivalTime: tsunami.newArrivalTime,
				description: description ? description : "No description"
			});
			
			// Note: not necessarily a requirement, but clicking the feature causes exceptions in OL when
			// it ends up doing a getFeatureById on it, and id is undefined
			feature.setId(tsunami.id);
						
			var style = this.getTsunamiStyle(tsunami.warningLevel);
						
			// TODO: For some reason setting it as an attribute in the Feature constructor doesn't take, it
			// needs to get set by setStyle for getStyle to return it so the layer uses it
			if(!style) {
				style = this.defaultStyle;
			}
			feature.setStyle(style);
			
			try {
				var result = this.tsunamiLayer.getSource().addFeature(feature);
			} catch(e) {
				console.log(Ext.String.format("ERROR: There was an error trying to add a Report feature to " +
						"the map: {0}: {1}", e.name, e.message));
			}
		},
		
		getTsunamiStyle: function(warning) {
			var icon = 'images/tsunami/marker-' + warning + '.png';
			
			return  new ol.style.Style({
				image: new ol.style.Icon({
					src: icon
				})
			});
		},
		
		addQuakeFeature: function() {
			var now = new Date();
			
			// 30.03 N, 142.77 E
			var lat = 30.03;
			var lon = 142.77;
			
			var geo = this.buildGeometry(lon, lat);
			
			var feature = new ol.Feature({
				geometry: geo,
				name: 'Earthquake',
				type: 'Earthquake',
				description: "<b>Magnitude</b>: 8.9<br/>" +
					"<b>Depth</b>: 12 km<br/><b>Time</b>: " + now.toUTCString()
			});
			feature.setId('earthquake1');
			feature.setStyle(this.quakeStyle);
			
			try {
				var result = this.tsunamiLayer.getSource().addFeature(feature);
			} catch(e) {
				console.log(Ext.String.format("ERROR: There was an error trying to add the Earthquake feature to " +
						"the map: {0}: {1}", e.name, e.message));
			}
		},
		
		getUpdatedWarningLevel: function(curtime, arrivalTime) {
		    var diff = arrivalTime - curtime;
		    var warn = this.getWarnLevel(diff);
		    return warn;
		},
		
		
		/**
		    Function: getWarnLevel
	
		    @param diff The difference in seconds between the original startex and
		                the arrivalTime
	
		    @returns The warning level color associated with the specified difference
		 */
		getWarnLevel: function(diff) {
		    
			var RED = 3.9*60*60; // 0 to RED
			var ORANGE = 5*60*60; // RED to YELLOW
			var YELLOW = 7*60*60; // YELLOW +
			
			//console.log("getWarnLevel got diff: " + diff);			
		    
		    if(diff >= 0 && diff < RED) {
		        return "red";
		    } else if(diff >= RED && diff <= ORANGE) {
		        return "orange";
		    } else if(diff > ORANGE) {
		        return "yellow";
		    } else {
		        return "black"
		    }
		}		
		
	});
});
