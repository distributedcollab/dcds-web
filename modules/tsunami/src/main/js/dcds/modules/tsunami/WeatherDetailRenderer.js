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
define(['ext', 'ol', 'iweb/CoreModule'], function(Ext, ol, Core){
	
	return Ext.define('tsunami.WeatherDetailRenderer', {
		
		constructor: function() {
		},
		
		render: function(container, feature) {
			var weather = feature.get('weather');
			if (weather) {
				var name = feature.get('name'),
					 	main = feature.get('main'),
						wind = feature.get('wind'),
						clouds = feature.get('clouds');
				
				container.add({
					html: ['<img src="http://openweathermap.org/img/w/',
								weather[0].icon, '.png" />', weather[0].main]
				});
				container.add( new Ext.form.field.Display({
					fieldLabel: 'City',
					value: name
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Temp',
					value: main.temp + '°F'
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Min Temp',
					value: main.temp_min + '°F'
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Max Temp',
					value: main.temp_max + '°F'
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Humidity',
					value: main.humidity + '%'
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Wind',
					value: wind.speed + ' mph'
				}));
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Clouds',
					value: clouds.all + '%'
				}));
			}
			
			return true;
		}
		
	});

});
