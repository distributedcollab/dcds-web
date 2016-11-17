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
define(['ext'], function(Ext) {

	return Ext.define('modules.tsunami.TsunamiModel', {	 
	 	extend: 'Ext.data.Model',
	 	
	 	idProperty: 'id',
	 	
	 	// Original startex in seconds
	 	startex_original: 1450614015,
	 	
	 	startex: 1450614015, // Defaults to original startex
	 		 	
		fields : [
			{
				name : 'fullname',
				depends: [ 'firstname', 'lastname' ],
				
				// Will be called whenever forename or surname fields are set
				convert: function (v, rec) {
					return rec.get('firstname') + ' ' + rec.get('lastname');
				}
			}, {
				name : 'firstname',
				mapping : 'firstname'
			}, {
				name : 'lastname',
				mapping : 'lastname'
			}, {
				name : 'loggedin',
				mapping : 'currentusersessions[0].loggedin',
				type : 'date',
				dateFormat : 'time'
			}, {
				name : 'lastseen',
				mapping : 'currentusersessions[0].lastseen',
				type : 'date',
				dateFormat : 'time'
			}
		],
		
		getOriginalStartex: function() {
			return this.startex_original;
		},
		
		getStartex: function() {
			return this.startex;
		},
		
		setStartex: function(startex) {
			this.startex = startex;
		},
		
		
		getDatasetCopy: function() { 
			return this.tsunami_dataset.slice(0);
		},
		
		tsunami_dataset: [
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
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450641147,
				"maxAmplitude": {
					"unit": "cm",
					"value": 14.99
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -5.91777
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Astoria Street",
				"warningPointCode": "ASS",
				"location": {
					"lon": 202.05,
					"lat": 21.36
				},
				"id": "PAC-ASS"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "HAL",
				"arrivalTime": 1450640652,
				"maxAmplitude": {
					"unit": "cm",
					"value": 139.2
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -127.16
				},
				"provider": "C_GRID",
				"grid": "Haleiwa, HI",
				"name": "Haleiwa",
				"warningPointCode": "HAL",
				"location": {
					"lon": 201,
					"lat": 21.59
				},
				"id": "PAC-HAL"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "HAN",
				"arrivalTime": 1450639802,
				"maxAmplitude": {
					"unit": "cm",
					"value": 144.98
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -148.44
				},
				"provider": "C_GRID",
				"grid": "Hanalei, HI",
				"name": "Hanalei",
				"warningPointCode": "HAN",
				"location": {
					"lon": 200,
					"lat": 22.21
				},
				"id": "PAC-HAN"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450640811,
				"maxAmplitude": {
					"unit": "cm",
					"value": 44.53
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -33.09
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Hickman Bike Path",
				"warningPointCode": "HBP",
				"location": {
					"lon": 202.03,
					"lat": 21.33
				},
				"id": "PAC-HBP"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "HIL",
				"arrivalTime": 1450643107,
				"maxAmplitude": {
					"unit": "cm",
					"value": 202.86
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -189.71
				},
				"provider": "C_GRID",
				"grid": "Hilo, HI",
				"name": "Hilo",
				"warningPointCode": "HIL",
				"location": {
					"lon": 204.944074,
					"lat": 19.73
				},
				"id": "PAC-HIL"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450641535,
				"maxAmplitude": {
					"unit": "cm",
					"value": 13.26
				},
				"timeZone": "Pacific\/Honolulu",
				"minAmplitude": {
					"unit": "cm",
					"value": -18.39
				},
				"provider": "B_GRID",
				"grid": "Kailua-Kona, HI",
				"name": "Honuapo",
				"warningPointCode": "HNU",
				"location": {
					"lon": 204.44,
					"lat": 19.08
				},
				"id": "PAC-HNU"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "HON",
				"arrivalTime": 1450640585,
				"maxAmplitude": {
					"unit": "cm",
					"value": 57.41
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -63.2
				},
				"provider": "C_GRID",
				"grid": "Honolulu, HI",
				"name": "Honolulu",
				"warningPointCode": "HON",
				"location": {
					"lon": 202.1357408,
					"lat": 21.3
				},
				"id": "PAC-HON"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "KAH",
				"arrivalTime": 1450642131,
				"maxAmplitude": {
					"unit": "cm",
					"value": 165.98
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -197.3
				},
				"provider": "C_GRID",
				"grid": "Kahului, HI",
				"name": "Kahului",
				"warningPointCode": "KAH",
				"location": {
					"lon": 203.5312962,
					"lat": 20.89
				},
				"id": "PAC-KAH"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450640922,
				"maxAmplitude": {
					"unit": "cm",
					"value": 37.28
				},
				"timeZone": "Pacific\/Honolulu",
				"minAmplitude": {
					"unit": "cm",
					"value": -29.21
				},
				"provider": "B_GRID",
				"grid": "Lahaina, HI",
				"name": "Kalaupapa",
				"warningPointCode": "KAL",
				"location": {
					"lon": 203.0166666,
					"lat": 21.2
				},
				"id": "PAC-KAL"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "KAW",
				"arrivalTime": 1450641567,
				"maxAmplitude": {
					"unit": "cm",
					"value": 62.03
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -70.17
				},
				"provider": "C_GRID",
				"grid": "Kawaihae, HI",
				"name": "Kawaihae",
				"warningPointCode": "KAW",
				"location": {
					"lon": 204.1706,
					"lat": 20.03
				},
				"id": "PAC-KAW"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "KEA",
				"arrivalTime": 1450641157,
				"maxAmplitude": {
					"unit": "cm",
					"value": 38.78
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -55.42
				},
				"provider": "C_GRID",
				"grid": "Kailua-Kona, HI",
				"name": "Keauhou",
				"warningPointCode": "KEA",
				"location": {
					"lon": 204,
					"lat": 19.56
				},
				"id": "PAC-KEA"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "KIH",
				"arrivalTime": 1450641855,
				"maxAmplitude": {
					"unit": "cm",
					"value": 69.78
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -72.4
				},
				"provider": "C_GRID",
				"grid": "Kihei, HI",
				"name": "Kihei",
				"warningPointCode": "KIH",
				"location": {
					"lon": 203,
					"lat": 20.74
				},
				"id": "PAC-KIH"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "KN1",
				"arrivalTime": 1450641106,
				"maxAmplitude": {
					"unit": "cm",
					"value": 39.28
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -37.93
				},
				"provider": "C_GRID",
				"grid": "Kailua-Kona, HI",
				"name": "Kailua-Kona",
				"warningPointCode": "KKA",
				"location": {
					"lon": 204,
					"lat": 19.63
				},
				"id": "PAC-KKA"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "LHN",
				"arrivalTime": 1450641795,
				"maxAmplitude": {
					"unit": "cm",
					"value": 50.57
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -45.22
				},
				"provider": "C_GRID",
				"grid": "Lahaina, HI",
				"name": "Lahaina",
				"warningPointCode": "LHN",
				"location": {
					"lon": 203.3,
					"lat": 20.87
				},
				"id": "PAC-LHN"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450641099,
				"maxAmplitude": {
					"unit": "cm",
					"value": 14.89
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -9.44133
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Laffey Street",
				"warningPointCode": "LST",
				"location": {
					"lon": 202.05,
					"lat": 21.35
				},
				"id": "PAC-LST"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "MID",
				"arrivalTime": 1450630934,
				"maxAmplitude": {
					"unit": "cm",
					"value": 175.29
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -148.61
				},
				"provider": "C_GRID",
				"grid": "Midway, UM",
				"name": "Midway Island",
				"warningPointCode": "MID",
				"location": {
					"lon": 182.63898,
					"lat": 28.2
				},
				"id": "PAC-MID"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450640595,
				"maxAmplitude": {
					"unit": "cm",
					"value": 32.26
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -29.21
				},
				"provider": "B_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Moku o Loe",
				"warningPointCode": "MOK",
				"location": {
					"lon": 202.22,
					"lat": 21.47
				},
				"id": "PAC-MOK"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "NAW",
				"arrivalTime": 1450639875,
				"maxAmplitude": {
					"unit": "cm",
					"value": 52
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -58.79
				},
				"provider": "C_GRID",
				"grid": "Nawiliwili, HI",
				"name": "Nawiliwili",
				"warningPointCode": "NAW",
				"location": {
					"lon": 200,
					"lat": 21.95
				},
				"id": "PAC-NAW"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "PRL",
				"arrivalTime": 1450640523,
				"maxAmplitude": {
					"unit": "cm",
					"value": 55.52
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -82.24
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Pearl Harbor",
				"warningPointCode": "PRL",
				"location": {
					"lon": 202,
					"lat": 21.3
				},
				"id": "PAC-PRL"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": "WAK",
				"arrivalTime": 1450625119,
				"maxAmplitude": {
					"unit": "cm",
					"value": 32.48
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -41.54
				},
				"provider": "C_GRID",
				"grid": "Wake Island, UM",
				"name": "Wake Island",
				"warningPointCode": "WAK",
				"location": {
					"lon": 166.6174,
					"lat": 19.2
				},
				"id": "PAC-WAK"
			},
			{
				"country": "United States",
				"twc": "PTWC",
				"ifmCode": null,
				"arrivalTime": 1450641291,
				"maxAmplitude": {
					"unit": "cm",
					"value": 15.17
				},
				"timeZone": "Universal",
				"minAmplitude": {
					"unit": "cm",
					"value": -11.99
				},
				"provider": "C_GRID",
				"grid": "Pearl Harbor, HI",
				"name": "Waipio Pt. Access Rd.",
				"warningPointCode": "WPR",
				"location": {
					"lon": 202,
					"lat": 21.37
				},
				"id": "PAC-WPR"
			}
		] // End Tsunami dataset

	 });
});
