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
define(["iweb/CoreModule", "d3"],
    function(Core, d3)
    {
        return Ext.define('modules.report.BarChart',
            {
                extend: "Ext.Component",
                alias: "widget.barchart",

                onRender: function()
                {
                    this.callParent(arguments);
                    this.el.on("load", this.onLoad, this);
                },

                onLoad: function()
                {
                    this.fireEvent("load", this);
                },

                setData: function(data, axisLabelY)
                {
                    var margin = {top: 20, right: 20, bottom: 120, left: 50},
                        width = 500 - margin.left - margin.right;

                    this.color = d3.scale.category20();
                    if (this.colors != undefined)
                    {
                        this.color = d3.scale.ordinal();
                        this.color.range(this.colors);
                    }

                    this._height = 450 - margin.top - margin.bottom;

                    this.graphX = d3.scale.ordinal().rangeRoundBands([10, width], .05);

                    this.graphY = d3.scale.linear().range([this._height, 0]);

                    this.xAxis = d3.svg.axis()
                        .scale(this.graphX)
                        .orient("bottom");

                    this.yAxis = d3.svg.axis()
                        .scale(this.graphY)
                        .orient("left")
                        .ticks(10);

                    this.svg = d3.select("#" + this.el.dom.id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", this._height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                    this.graphX.domain(data.map(function(d) { return d.name; }));
                    this.graphY.domain([0, d3.max(data, function(d) { return d.value; })]);

                    this.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + this._height + ")")
                        .call(this.xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", "-.55em")
                        .attr("transform", "rotate(-90)" );

                    this.svg.append("g")
                        .attr("class", "y axis")
                        .call(this.yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(axisLabelY);

                    var _color = this.color;
                    var _x = this.graphX;
                    var _y = this.graphY;
                    var _height = this._height;

                    this.svg.selectAll("bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .style("fill", function(d) { return _color(d.name); })
                        .attr("x", function(d) { return _x(d.name); })
                        .attr("width", _x.rangeBand())
                        .attr("y", _height)
                        .attr("height", 0)
                        .transition()
                        .duration(500)
                        .delay(function(d, i) { return i * (1000 / data.length); })
                        .attr("height", function(d) { return _height - _y(d.value); })
                        .attr("y", function(d) { return _y(d.value); })

                    var svg = this.svg;

                    d3.select("#" + this.el.dom.id).append("br");

                    // Download as SVG button
                    var svgButton = d3.select("#" + this.el.dom.id).append("button")
                        .text("SVG")
                        .on("click", function () {
                            var svgEl = svg[0][0];
                            window.open("data:text/xml;charset=utf-8," + new XMLSerializer().serializeToString(svgEl.ownerSVGElement), 'Download');
                        });

                    // Download as PNG button
                    var pngButton = d3.select("#" + this.el.dom.id).append("button")
                        .text("PNG")
                        .on("click", function() {
                            // Add SVG identifiers to svg element
                            var sel = d3.select(this.parentNode.firstChild)
                                .attr("version", 1.1)
                                .attr("xmlns", "http://www.w3.org/2000/svg");
                            // Get the SVG elements
                            var html = sel.node().outerHTML;

                            // Convert SVG data to base64
                            var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
                            // Create a canvas element to draw into
                            var canvas = document.createElement("canvas");
                            canvas.setAttribute("width", 500);
                            canvas.setAttribute("height", 450);
                            canvas.setAttribute("style", "display:none"); // not rendered on page
                            svg[0][0].ownerSVGElement.parentNode.appendChild(canvas);

                            var context = canvas.getContext("2d");

                            var image = new Image;
                            image.src = imgsrc;
                            image.onload = function ()
                            {
                                // Draw image data onto canvas
                                context.drawImage(image, 0, 0);

                                // Get Data URL from canvas
                                var canvasdata = canvas.toDataURL("image/png");

                                // Create a link to download the image
                                var a = document.createElement("a");
                                a.download = "graph.png";
                                a.href = canvasdata;
                                document.body.appendChild(a);
                                // Activate the link
                                a.click();
                            }

                        });
                }
            }
        );
    }
);
