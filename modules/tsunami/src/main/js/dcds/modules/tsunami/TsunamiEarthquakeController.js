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
define(['ext', 'ol', 'iweb/CoreModule'],
		function(Ext, ol, Core){
	
	return Ext.define('modules.tsunami.TsunamiEarthquakeController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.tsunamiearthquakecontroller',
		
		startex: null,
		
		layerInited: false,
		
		tsunamiLayer: null,
		
		vectorSource: null,
		
		constructor: function(datatree){
			this.addTreeItem(datatree.getRootNode());
			datatree.getStore().on("rootchange", this.onTreeRootChange.bind(this));
			datatree.on("checkchange", this.onTreeCheckchange.bind(this));
		},
		
		addTreeItem: function(root) {
			this.node = root.appendChild({
				text: "Tsunami Earthquake",
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
		
		initTsunamiLayer: function() {
		
			this.vectorSource = new ol.source.Vector();
			
			this.tsunamiLayer = new ol.layer.Vector({
				title: "Tsunami Earthquake Layer",
				source: this.vectorSource 
			});
		},
		
		
		buildLayer: function() {
			if(!this.tsunamiLayer) {
				this.initTsunamiLayer();
				this.addQuakeFeature();
			}
			
			return this.tsunamiLayer;
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
		}		
		
	});
});
