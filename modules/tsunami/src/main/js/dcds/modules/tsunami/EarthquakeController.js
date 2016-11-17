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
define(['ext', 'ol', 'iweb/CoreModule', 'iweb/modules/MapModule',
		'./EarthquakeDetailRenderer'],
		function(Ext, ol, Core, MapModule, EarthquakeDetailRenderer){
	
	return Ext.define('modules.tsunami.EarthquakeController', {
		
		constructor: function(datatree){
			this.addTreeItem(datatree.getRootNode());
			datatree.getStore().on("rootchange", this.onTreeRootChange.bind(this));
			datatree.on("checkchange", this.onTreeCheckchange.bind(this));
			
			MapModule.getMapStyle().addStyleFunction(this.layerStyle);
			MapModule.getClickListener().addRenderer(new EarthquakeDetailRenderer());
		},
		
		addTreeItem: function(root) {
			this.node = root.appendChild({
				text: "M1.0+ Earthquakes - Past 7 days",
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
		
		buildLayer: function() {
			return new ol.layer.Vector({
				source: new ol.source.Vector({
					url: "proxy?url=http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson",
					format: new ol.format.GeoJSON()
				}),
				style: this.layerStyle.bind(this)
			});
		},
		
		layerStyle: function(feature, resolution) {
			var type = feature.get('type');
			if (type !== "earthquake") {
				return;
			}
			
			var mag = feature.get('mag'),
					coords = feature.getGeometry().getCoordinates(),
					depth = coords[coords.length - 1];
					
			var color;
			if (depth < 33) {
				color = 'rgba(255, 165, 0, 0.6)';
			} else if (depth >= 33 && depth < 70) {
				color = 'rgba(255, 255, 0, 0.6)';
			} else if (depth >= 70 && depth < 150) {
				color = 'rgba(0, 128, 0, 0.6)';
			} else if (depth >= 150 && depth < 300) {
				color = 'rgba(0, 0, 255, 0.6)';
			} else if (depth >= 300 && depth < 500) {
				color = 'rgba(128, 0, 128, 0.6)';
			} else if (depth >= 500) {
				color = 'rgba(255, 0, 0, 0.6)';
			}
			
			return [new ol.style.Style({
				image: new ol.style.Circle({
					radius: (Math.floor(mag) * 2) + 1,
					fill: new ol.style.Fill({
						color: color
					}),
					stroke: new ol.style.Stroke({
						color: 'black'
					})
				})
			})];
		}
		
	});
});
