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
    './ExplosivesFormViewModel',
    './ExplosivesFormController',
    'dcds/modules/report/common/FormVTypes'], function(Core) {
    Ext.define('modules.report-explosives.ExplosivesForm', {

        extend: 'Ext.form.Panel',

        controller: 'explosivesformcontroller',

        buttonAlign: 'center',

        viewModel: {
            type: 'explosives'
        },

        autoHeight: true,
        autoWidth: true,

        defaults: {
            scrollable: true,
            bodyPadding: 5,
            border: false
        },

        listeners: {
            beforedestroy: 'onClose'
        },

        layout: 'border',

        referenceHolder: true,

        setReadOnly: function () {
            this.getForm().getFields().each (function (field) {
                field.setReadOnly(true);
            });

            Ext.Array.forEach(this.query("button"), function(button){
                if(button.text == "Submit"){
                    button.hide();
                }else if(button.text != "Cancel"){
                    button.disable();
                }
            });
            this.controller.setReadOnly(true);
        },

        items: [{
            xtype: 'container',
            region: 'center',
            defaultType: 'textfield',
            reference: 'explosivesForm',
            margin: '5 5 5 5',
            items: [{
                xtype: 'fieldcontainer',
                defaultType: 'textfield',
                reference: 'explosivesFields',
                items: [
                    {
                        fieldLabel: Core.Translate.i18nJSON('Reporting Unit'),
                        bind: '{reportingUnit}',
                        allowBlank: false,
                        labelWidth: 160
                    }]
            },{
                xtype: 'fieldcontainer',
                defaultType: 'textfield',
                items: [
                    {
                        fieldLabel: Core.Translate.i18nJSON('Reporting Location'),
                        bind: '{reportingLocation}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Longitude'),
                        bind: '{longitude}',
                        reference: 'longitudeInput',
                        allowBlank: false,
                        labelWidth: 160,
                        vtype: 'latlon'
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Latitude'),
                        bind: '{latitude}',
                        reference: 'latitudeInput',
                        allowBlank: false,
                        labelWidth: 160,
                        vtype: 'latlon'
                    }]
            },{
                xtype: 'fieldcontainer',
                defaultType: 'textfield',
                items: [
                    {
                        fieldLabel: Core.Translate.i18nJSON('Contact Info'),
                        bind: '{contactInfo}',
                        labelWidth: 160
                    },
                    {
                        xtype: 'combobox',
                        margin: '0 0 5 0',
                        forceSelection: true,
                        editable: false,
                        displayField: 'label',
                        valueField: 'name',
                        triggerAction: 'all',
                        queryMode: 'local',
                        labelWidth: 160,
                        bind: {
                            store: '{uxoType}',
                            value: '{uxoTypeValue}'
                        },
                        allowBlank: false,
                        fieldLabel: Core.Translate.i18nJSON('UXO Type')
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Size'),
                        bind: '{size}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Shape'),
                        bind: '{shape}',
                        labelWidth: 160
                    },
                    {
                        xtype: 'pickerfield',
                        id: 'colorpicker',
                        editable: false,
                        createPicker: function()
                        {
                            return Ext.create('Ext.picker.Color', {
                                resizable: false,
                                floating: true,
                                select: function(selColor) {
                                    selColor = "#"+selColor;
                                    var picker = Ext.getCmp('colorpicker');
                                    picker.setValue(selColor);
                                    picker.setFieldStyle('background-color:'+selColor+';color:'+selColor+';background-image:none');
                                    picker.collapse();
                                }
                            });
                        },
                        fieldLabel: Core.Translate.i18nJSON('Color'),
                        bind: '{color}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Condition'),
                        bind: '{condition}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('CbrnContamination'),
                        bind: '{cbrnContamination}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Resource Threatened'),
                        bind: '{resourceThreatened}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Impact On Mission'),
                        bind: '{impactOnMission}',
                        labelWidth: 160
                    },
                    {
                        fieldLabel: Core.Translate.i18nJSON('Protective Measures'),
                        bind: '{protectiveMeasures}',
                        labelWidth: 160
                    },
                    {
                        xtype: 'combobox',
                        margin: '0 0 5 0',
                        forceSelection: true,
                        editable: false,
                        displayField: 'label',
                        valueField: 'name',
                        triggerAction: 'all',
                        queryMode: 'local',
                        labelWidth: 160,
                        allowBlank: false,
                        bind: {
                            store: '{priority}',
                            value: '{priorityValue}'
                        },
                        fieldLabel: Core.Translate.i18nJSON('Recommended Priority')

                    }
                ]
            }]
        }],

        buttons: [{
            text: Core.Translate.i18nJSON('Submit'),
            handler: 'submitForm',
            formBind: true, //only enabled once the form is valid
            disabled: true
        },{
            text: Core.Translate.i18nJSON('Cancel'),
            handler: 'cancelForm'
        },
        {
            text: Core.Translate.i18nJSON('Locate'),
            enableToggle: true,
            reference: 'locateButton',
            toggleHandler: 'locateReport'
        }]
    });
});
