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
define(['ext', "iweb/CoreModule", "dcds/modules/UserProfileModule"],
function(Ext, Core, UserProfile)
{
    return Ext.define('modules.report-mitam.MitamGraphsController', {
        extend: 'Ext.app.ViewController',

        alias: 'controller.mitamgraphscontroller',

        init: function()
        {
            this.mediator = Core.Mediator.getInstance();
        },

        setIncident: function(incidentId)
        {
            this.fetchData(incidentId);
        },

        fetchData: function(incidentId)
        {
            var topic = Core.Util.generateUUID();
            Core.EventManager.createCallbackHandler(topic, this, this.handleResponse);

            var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);

            var url = Ext.String.format('{0}/reports/{1}/{2}', endpoint, incidentId, "MITAM");

            this.mediator.sendRequestMessage(url, topic);
        },

        handleResponse: function(e, data)
        {
            if (data.message != "OK")
            {
                console.log("Failed to load data for MITAM graph!");
                return;
            }

            var totals = {};
            totals.organizations = [];
            totals.serviceTypes = [];
            totals.status = [];
            totals.dates = [];

            var firstTime = Number.MAX_VALUE;
            var lastTime = 0;
            var createdDates = [];
            var completedDates = [];

            for (var i = 0; i < data.reports.length; i++)
            {
                var message = JSON.parse(data.reports[i].message);
                var report = message.report;

                // Service types
                var serviceType = report["serviceTypeValue"];
                var found = false;
                for (var j = 0; j < totals.organizations.length; j++)
                {
                    if (totals.serviceTypes[j] && totals.serviceTypes[j].name == serviceType)
                    {
                        totals.serviceTypes[j].value++;
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    totals.serviceTypes.push({name:serviceType, value:1});
                }


                // Reporting organizations
                var organization = report["requestorTypeValue"];
                found = false;
                for (j = 0; j < totals.organizations.length; j++)
                {
                    if (totals.organizations[j].name == organization)
                    {
                        totals.organizations[j].value++;
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    totals.organizations.push({name:organization, value:1});
                }


                // Status
                var status = report["mitamStatusValue"];
                found = false;
                for (j = 0; j < totals.status.length; j++)
                {
                    if (totals.status[j].name == status)
                    {
                        totals.status[j].value++;
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    totals.status.push({name:status, value:1});
                }

                // MITAMs over time
                // Find earliest and latest dates
                var date = this.parseDate(report["requestDate"]);
                if (date != undefined) {
                    firstTime = Math.min(firstTime, date);
                    lastTime = Math.max(lastTime, date);

                    var dateStr = date.toDateString();
                    found = false;
                    for (j = 0; j < createdDates.length; j++) {
                        if (createdDates.name == dateStr) {
                            createdDates.value++;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        createdDates.push({name: dateStr, value: 1});
                    }
                }
            }

            // Populate the full date range with 0-count entries
            d = new Date(firstTime);
            var last = new Date(lastTime);
            // Include one extra day at the end
            last.setDate(new Date(lastTime).getDate() + 1);
            while (d.getTime() < last)
            {
                var str = d.toDateString();
                totals.dates.push({name:str, value:0});
                // Increment to the next day
                d.setDate(d.getDate() + 1);
            }

            // Add values for used dates
            for (i = 0; i < createdDates.length; i++)
            {
                var usedDate = createdDates[i];
                for (j = 0; j < totals.dates.length; j++)
                {
                    if (totals.dates[j].name == usedDate.name)
                    {
                        totals.dates[j].value++;
                        break;
                    }
                }
            }

            this.getView().updateGraphs(totals);
        },
        parseDate: function(dateStr)
        {
            var year, month, day;
            try
            {
                parts = dateStr.split("-");
                year = parts[0];
                month = parts[1] - 1;
                day = parts[2];

                return new Date(year, month, day);
            } catch (e)
            {
                return undefined;
            }
        }
    });
});