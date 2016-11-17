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
define(['ol'], function(ol){

	/**
	 * @classdesc
	 * Feature format for reading and writing data in the GeoJSON format.
	 *
	 * @constructor
	 * @extends {ol.format.GeoJSON}
	 * @param {olx.format.GeoJSONOptions=} opt_options Options.
	 * @api stable
	 */
	var OWMFormat = function(opt_options) {
		ol.format.GeoJSON.call(this, opt_options);
		
		this.dataProjection = ol.proj.get('EPSG:4326');
		this.featureProjection = ol.proj.get('EPSG:3857');
	};
	OWMFormat.prototype = Object.create(ol.format.GeoJSON.prototype);
	OWMFormat.prototype.constructor = OWMFormat;

	/**
	 * @inheritDoc
	 */
	OWMFormat.prototype.readFeatureFromObject = function(object, opt_options) {
	  var geometry = this.readGeometryFromObject(object.coord, opt_options);
	  var feature = new ol.Feature();
	  feature.setGeometry(geometry);
	  if (object.id !== undefined) {
	    feature.setId(object.id);
	  }
	  feature.setProperties(object);
		feature.set("type", "weather");
	  return feature;
	};


	/**
	 * @inheritDoc
	 */
	OWMFormat.prototype.readFeaturesFromObject = function(object, opt_options) {
		return object.list.map(function(item){
			return this.readFeatureFromObject(item, opt_options);
		}, this);
	};

	/**
	 * @inheritDoc
	 */
	OWMFormat.prototype.readGeometryFromObject = function(object, opt_options) {
		var geom = new ol.geom.Point([object.lon, object.lat]);
		return geom.transform(this.dataProjection, this.featureProjection);
		//return ol.format.Feature.transformWithOptions(geom, false, opt_options);
	};

	/**
	 * @inheritDoc
	 */
	OWMFormat.prototype.readProjectionFromObject = function(object) {
		return ol.proj.get('EPSG:4326');
	};
	
	return OWMFormat;
});
