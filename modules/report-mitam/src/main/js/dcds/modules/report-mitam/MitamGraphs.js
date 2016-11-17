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
define(['iweb/CoreModule',
        "dcds/modules/report/common/BarChart",
        "dcds/modules/report/common/PieChart",
        "./MitamGraphsController"],
function(Core, BarChart, PieChart, MitamGraphsController) {
    Ext.define('modules.report-mitam.MitamGraphs', {

        extend: 'Ext.form.Panel',

        controller: 'mitamgraphscontroller',

        defaults: {
            scrollable: true,
            bodyPadding: 5,
            border: false
        },

        initComponent: function()
        {
            this.callParent();

            this.setAutoScroll(true);
        },

        items: [{
                xtype: 'label',
                text: 'Service Types',
                reference: 'serviceTypesLabel'
            },
            {
                xtype: 'piechart',
                reference: 'serviceTypesChart'
            },
            {
                xtype: 'label',
                text: 'Reporting Organizations',
                reference: 'organizationsLabel'
            },
            {
                xtype: 'barchart',
                reference: 'organizationsChart'
            },
            {
                xtype: 'label',
                text: 'Status',
                reference: 'statusLabel'
            },
            {
                xtype: 'piechart',
                reference: 'statusChart'
            },
            {
                xtype: 'label',
                reference: 'overTimeLabel'
            },
            {
                xtype: 'barchart',
                reference: 'overTimeChart'
            }],

        updateGraphs: function(data)
        {
            this.lookupReference('serviceTypesLabel').update("<b><div style='margin:10px 10px 10px 10px'>Service Type</div></b>");
            this.lookupReference('serviceTypesChart').setData(data.serviceTypes);
            this.lookupReference('organizationsLabel').update("<b><div style='margin:10px 10px 10px 10px'>Requestor</div></b>");
            this.lookupReference('organizationsChart').setData(data.organizations);
            this.lookupReference('statusLabel').update("<b><div style='margin:10px 10px 10px 10px'>Status</div></b>");
            this.lookupReference('statusChart').setData(data.status);
            this.lookupReference('overTimeLabel').update("<b><div style='margin:10px 10px 10px 10px'>MITAM Request Dates</div></b>");
            this.lookupReference('overTimeChart').setData(data.dates);
        }
    });
});