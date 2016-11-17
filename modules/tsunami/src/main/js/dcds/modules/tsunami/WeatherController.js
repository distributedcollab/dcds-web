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
		'./OWMFormat', './WeatherDetailRenderer'],
		function(Ext, ol, Core, MapModule, OWMFormat, WeatherDetailRenderer){
	
	return Ext.define('modules.tsunami.WeatherController', {
		
		constructor: function(datatree){
			this.addTreeItem(datatree.getRootNode());
			datatree.getStore().on("rootchange", this.onTreeRootChange.bind(this));
			datatree.on("checkchange", this.onTreeCheckchange.bind(this));
			
			MapModule.getMapStyle().addStyleFunction(this.layerStyle);
			MapModule.getClickListener().addRenderer(new WeatherDetailRenderer());
		},
		
		addTreeItem: function(root) {
			this.node = root.appendChild({
				text: "City Weather",
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
			return new ol.layer.VectorTile({
				source: new ol.source.VectorTile({
					attributions: [new ol.Attribution({
						html: 'Weather from <a href="http://openweathermap.org/" alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>'
					})],
					tileUrlFunction: this.tileUrlFunction,
					tileGrid: ol.tilegrid.createXYZ({
						tileSize: 1024
					}),
					format: new OWMFormat()
				}),
				style: this.layerStyle
			});
		},
		
		tileUrlFunction: function(tileCoord, pixelRatio, projection) {
			var map = Core.Ext.Map.getMap(),
					size = map.getSize(),
					view = map.getView(),
					zoom = view.getZoom(),
					extent = view.calculateExtent(size),
					destProj = ol.proj.get('EPSG:4326'),
					destExtent = ol.proj.transformExtent(extent, projection, destProj);
			
			destExtent.push(zoom);
			destExtent.push(destProj.getCode());
			
			return "proxy?url=http://api.openweathermap.org/data/2.5/box/city?cluster=yes&units=imperial&lang=en&cnt=200&APPID=d068ab7d7138617700b423b7a0f3c6aa&bbox=" + destExtent.join(',');
		},
		
		layerStyle: function(feature, resolution, selected) {
			var weather = feature.get('weather'),
					main = feature.get('main');
			
			if (weather === undefined) {
				return;
			}
			
			return [new ol.style.Style({
				text: new ol.style.Text({
					text: (Math.round(10 * main.temp) / 10) + '°F',
					scale: 1,
					textAlign: 'start',
					textBaseline: 'top',
					font: 'bold 12px arial',
					fill: new ol.style.Fill({
						color: 'black'
					}),
					stroke: new ol.style.Stroke({
						color: 'white',
						width: 2
					})
				}),
				image: new ol.style.Icon({
					src: 'http://openweathermap.org/img/w/' + weather[0].icon + '.png'
				})
			})];
		}
	});
});
