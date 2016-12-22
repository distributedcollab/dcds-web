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
define(["ol",'ext', 'iweb/CoreModule','dcds/modules/UserProfileModule', './FeatureTopicListener'], 
		function(ol, Ext, Core, UserProfile, FeatureTopicListener){
	
	// custom Vtype for alphanum only fields, plus apostrophes, and - .  + , ? _ %
	Ext.apply(Ext.form.field.VTypes, {
	     extendedalphanum:  function(v) {
	        return /^[^\<\>";\(\)\{\}\&]*$/i.test(v);
	    },
	   extendedalphanumText: Core.Translate.i18nJSON('This field should only contain letters, numbers, apostrophes, and - .  + , ? _ %'),
	    extendedalphanumMask: /[^\<\>";\(\)\{\}\&]/i
	});
	
	return Ext.define('features.FeatureDetailRenderer', {
		

		constructor: function() {
			Core.EventManager.addListener('dcds.collabroom.activate', this.onActivateRoom.bind(this));
		},
		
		onActivateRoom: function(evt, collabRoomId, readOnly){
			this.readOnly = readOnly;
		},
		
		render: function(container, feature) {
	      if (this.supportsComments(feature)){

			//clone attributes object, fixes feature.set equality check
			var attributes = Ext.Object.merge({}, feature.get('attributes'));
			var user = feature.get('username');
			var description = feature.get('description');
			if (!description) {
				//The description is either in the feature itself (when it is first created) or in the attributes (when it is an existing feature)
				//get description from the attributes
				if (attributes && attributes.description){
					
						description = new Ext.form.field.Display({
						fieldLabel: Core.Translate.i18nJSON('Description'),
						value: attributes.description
						
					});
					container.add( description);
				
				}
			}

			if (user) {
				user = new Ext.form.field.Display({
					fieldLabel: 'User',
					value: user
				});
				container.add(user);
			}
			 
			
			var updateDate= this.formatDateString(feature.get('lastupdate'));
			if (updateDate ) {	
				updateDate = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Last Updated'),
					value: updateDate
				});
				container.add( updateDate );
			
			}
			var importName = feature.get('name');
			
			if(importName){
				importName = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Name'),
					value: importName
				});
				container.add( importName );
			}	
			
			if (attributes && attributes.length){
				var length = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Distance'),
					value: attributes.length
				});
				container.add( length );
			}	

			if (attributes && attributes.layerid) {
				var layerid = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Layer'),
					value: attributes.layerid
				});
				container.add( layerid );
			}

			if (attributes && attributes.area) {
				var area = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Area'),
					value: attributes.area
				});
				container.add( area );
			}	
		
			//Add sketch info


			//Add Comments
			//if attributes is undefined, define it with empty comments so that it won't throw an error
			if (!attributes) attributes = {comments:""};	
			var commentsText=attributes.comments;
			var	comments = new Ext.form.field.Display({
					fieldLabel: Core.Translate.i18nJSON('Comments'),
					value: commentsText,
					htmlEncode:true,
					reference: 'displayComments'
				});
			container.add( comments );
			var newComments = new Ext.form.field.TextArea({
				fieldLabel: Core.Translate.i18nJSON('Comments'),
				value: commentsText,
				hidden:true,
				vtype:'extendedalphanum',
				reference: 'textAreaComments'
			}); 
			
			
			container.add( newComments );

			if (!this.readOnly) {	
				
				var editState = Core.Translate.i18nJSON("Edit");
				var editButton = new Ext.Button({
					text: editState,
					margin:'0 0 10 10',
					handler: function(btn) {
						switch (this.getText()){
							case Core.Translate.i18nJSON('Edit'):
								comments.hide();
								newComments.show();
								this.setText(Core.Translate.i18nJSON('Update'));
								break;
							case Core.Translate.i18nJSON('Update'):
								if (newComments.isValid()) {
									this.setText(Core.Translate.i18nJSON('Edit'));
									attributes.comments = newComments.getValue();
									feature.set("attributes", attributes);
									newComments.hide();
									comments.setValue(newComments.getValue());			
									comments.show();
								}
								else {
									alert(Core.Translate.i18nJSON('Please enter a valid comment'));
									newComments.setValue("");
								}			
								break;
							}
							
						}	
					
				});
				container.add( editButton );
			}
			  return true;
		    }
		  return false;
		},
		supportsComments: function(feature) {
			return feature.get('featureId') != undefined;
		},
		
		
	
	    calculateAcres: function(feature){
	    	var wgs84Sphere = new ol.Sphere(6378137);
	    	var linearRing = feature.getGeometry().getLinearRing(0).clone();
			//TODO: get projection from map / controller?
			linearRing.transform("EPSG:3857", "EPSG:4326");
			var sqMetersArea = wgs84Sphere.geodesicArea(linearRing.getCoordinates());
			return(sqMetersArea  * 0.000247105381);
	    	
	    },
		
    	formatDateString: function(date)
        {
    		/*Takes a string in the form 'YYY-MM-DD' and formats it into a locale friendly string
             *Since the date is a string, and has no time, when we convert it to a JS date, it will convert the date to midnight, UTC.
             *For users west of GMT this will change the date to the day before (01/01/2016 00:00:00 GMT is 12/31/15  19:00:00 EST).  
             *So, we will set all dates to be noon on the date passed in, and add/subtract the timezoneoffset.  Setting it to noon should take 
             *care of the issue of timezoneoffset changing with Daylight Savings. 
             *And, JS numbers its months as 0 - 11, so we subtract one from the month number passed in
             *And we don't actually know the users locale.  So we pass undefined into LocateDateString so it will use the user's default locale
            */
            var str = "";
            if (date){
              var components = date.split("-",3);
              var utcDate = new Date( Date.UTC(components[0],  (components[1]-1),  components[2], 12,0));
              var tzOffset = utcDate.getTimezoneOffset();
              utcDate.setHours( utcDate.getHours() + (tzOffset/60))
              var options = {  year: 'numeric', month: 'numeric', day: 'numeric' };
              str =  utcDate.toLocaleDateString(undefined, options);
            }
            return str;
        
        },
        formatDate: function(date)
        {
            var str = (date.getMonth() + 1) + "/"
            + date.getDate() + "/"
            + date.getFullYear();

            return str;
        },
	    formatDashStyle: function(dashStyle)
        {
    		var str = "";
    		if (dashStyle){
    		  var str = dashStyle.replace(/-/g, " ");
    		  str = str.charAt(0).toUpperCase() + str.slice(1);
    		  
        	}
            return str;
        
        }

		
	});

});
