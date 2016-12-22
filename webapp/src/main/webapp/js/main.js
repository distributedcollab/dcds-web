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
require(["iweb/CoreModule","dcds/modules/LoginModule", "dcds/modules/UserProfileModule", "iweb/modules/core-view/View"],

    function(Core, LoginModule, UserProfile, View) {

        "use strict";

        Ext.onReady(function(){

	        Ext.QuickTips.init();

	        //Listen for the Config to be loaded (Config.js)
			Core.EventManager.addListener("iweb.config.loaded", initUserProfile);
	        
	         //Instantiate the View
	        var view = new View();
	        view.init();
	        
	        //Config is initialized
	        Core.init(view);
	        Core.View.showDisconnect(true);

	        //Show the Toolbar - Required for drawing menu
	        Core.View.showToolbar(true);
	        
	        function initUserProfile(){
	        	//Load the Translation registry
	        	//The default Translation will be set if indicated in the registry
	        	//If no default translation is configured, the browser language will be set
	        	Core.Translate.init(Core.Config.getProperty("translation.directory"));
	        
	        	//Set the cookies needed to make requests to the endpoint
	        	Core.Mediator.getInstance().setCookies(
	        			Core.Config.getProperty("endpoint.rest"), ["openam", "iplanet"]);
	        
	        	//After the user user properties have been loaded (username, sessionid) load the login module
	        	Core.EventManager.addListener(UserProfile.PROPERTIES_LOADED, LoginModule.load);
	        	
	        	//Listen for the User Profile (UserProfile.js) to be loaded
				//The profile is loaded after the LoginModule is loaded
				Core.EventManager.addListener("dcds.translation.loaded", loadModules);
	    		
	    		UserProfile.init();
	        };
	        
			//Load each module
	        function loadModules(data) {
	        
	        	require(["iweb/modules/MapModule",
				    "iweb/modules/DrawMenuModule", "iweb/modules/GeocodeModule",
				    "dcds/modules/CollabRoomModule", "dcds/modules/IncidentModule",
				    "dcds/modules/WhiteboardModule", "dcds/modules/ReportModule",
					"dcds/modules/DatalayerModule", "dcds/modules/ActiveUsersModule",
					"dcds/modules/FeaturePersistence", "dcds/modules/AdministrationModule",
					"dcds/modules/PhotosModule", "dcds/modules/PrintModule" ,
					"dcds/modules/AccountInfoModule", "dcds/modules/MultiIncidentViewModule",
				    "dcds/modules/FeedbackReportModule", "dcds/modules/MapSyncLocation", "dcds/modules/TsunamiModule"],
				    
				    function(MapModule, DrawMenuModule, GeocodeModule,
				        CollabRoomModule, IncidentModule,
				        WhiteboardModule, ReportModule, DatalayerModule,
				        ActiveUsersModule, FeaturePersistence, AdminModule,
				        PhotosModule, PrintModule, AccountModule, MultiIncidentModule,
				        FeedbackReportModule, MapSyncLocation, TsunamiModule){
				        
				        	Core.EventManager.removeListener("dcds.translation.loaded", loadModules);
	        
				        	//Add Title
							Core.View.addToTitleBar([{xtype: 'tbspacer', width: 5},{xtype: "label", html: "<b>" +
								((Core.Config.getProperty("main.site.label") || '') ? Core.Config.getProperty("main.site.label") :
								"Distributed Collaboration and Decision Support" ) + "</b>"}]);
				        	
				        	var MapController = MapModule.load();
			
				            //Load Modules
							WhiteboardModule.load();
				            IncidentModule.load();
							ReportModule.load();
				            CollabRoomModule.load(CollabRoomModule.getDefaultRoomPresets());
				            DrawMenuModule.load();
				            GeocodeModule.load();
				            AccountModule.load();
				            DatalayerModule.load();
			
				            //Add Tools Menu after Datalayer Module
				            var button = Core.UIBuilder.buildDropdownMenu(Core.Translate.i18nJSON("Tools"));
				            //Add View to Core
							Core.View.addButtonPanel(button);
			
							//Set the Tools Menu on the Core for others to add to
							Core.Ext.ToolsMenu = button.menu;
			
							PrintModule.load();
			
							//Add Export to Tools Menu
							DatalayerModule.addExport();
			
				            FeaturePersistence.load();
				            AdminModule.load();
			
							TsunamiModule.load();
				            ActiveUsersModule.load();
				            PhotosModule.load();
				            MultiIncidentModule.load();
			
			                // Add email report to Tools Menu
			                FeedbackReportModule.load();
			                
			                MapSyncLocation.load();
			                LoginModule.addHelp();
			                LoginModule.addLogout();
			                
			                Core.EventManager.fireEvent(UserProfile.PROFILE_LOADED, [UserProfile]);
			           });
	        }

	        //Mediator
	        /** default topics
	         ** callback
	         */
	        Core.Mediator.initialize();
        });
    });
