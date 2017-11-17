ne.util.defineNamespace("fedoc.content", {});
fedoc.content["plugins_raphaelLineTypeBase.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview RaphaelLineTypeBase is base class for line type renderer.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar raphaelRenderUtil = require('./raphaelRenderUtil');\n\nvar DEFAULT_DOT_WIDTH = 3,\n    HOVER_DOT_WIDTH = 4;\n\n/**\n * @classdesc RaphaelLineTypeBase is base for line type renderer.\n * @class RaphaelLineTypeBase\n */\nvar RaphaelLineTypeBase = tui.util.defineClass(/** @lends RaphaelLineTypeBase.prototype */ {\n    /**\n     * To make line paths.\n     * @param {{left: number, top: number}} fromPos from position\n     * @param {{left: number, top: number}} toPos to position\n     * @returns {{start: string, end: string}} line paths.\n     */\n    makeLinePath: function(fromPos, toPos) {\n        var startLinePath = raphaelRenderUtil.makeLinePath(fromPos, fromPos),\n            endLinePath = raphaelRenderUtil.makeLinePath(fromPos, toPos);\n        return {\n            start: startLinePath,\n            end: endLinePath\n        };\n    },\n\n    /**\n     * Render tooltip line.\n     * @param {object} paper raphael paper\n     * @param {number} height height\n     * @returns {object} raphael object\n     * @private\n     */\n    _renderTooltipLine: function(paper, height) {\n        var linePath = raphaelRenderUtil.makeLinePath({\n                left: 10,\n                top: height\n            }, {\n                left: 10,\n                top: 0\n            });\n        return raphaelRenderUtil.renderLine(paper, linePath, 'transparent', 1);\n    },\n\n    /**\n     * To make border style.\n     * @param {string} borderColor border color\n     * @param {number} opacity opacity\n     * @returns {{stroke: string, stroke-width: number, strike-opacity: number}} border style\n     */\n    makeBorderStyle: function(borderColor, opacity) {\n        var borderStyle;\n        if (borderColor) {\n            borderStyle = {\n                stroke: borderColor,\n                'stroke-width': 1,\n                'stroke-opacity': opacity\n            };\n        }\n        return borderStyle;\n    },\n\n    /**\n     * To make dot style for mouseout event.\n     * @param {number} opacity opacity\n     * @param {object} borderStyle border style\n     * @returns {{fill-opacity: number, stroke-opacity: number, r: number}} style\n     */\n    makeOutDotStyle: function(opacity, borderStyle) {\n        var outDotStyle = {\n            'fill-opacity': opacity,\n            'stroke-opacity': 0,\n            r: DEFAULT_DOT_WIDTH\n        };\n\n        if (borderStyle) {\n            tui.util.extend(outDotStyle, borderStyle);\n        }\n\n        return outDotStyle;\n    },\n\n    /**\n     * Render dot.\n     * @param {object} paper raphael papaer\n     * @param {{left: number, top: number}} position dot position\n     * @param {string} color dot color\n     * @param {object} borderStyle border style\n     * @returns {object} raphael dot\n     */\n    renderDot: function(paper, position, color) {\n        var dot = paper.circle(position.left, position.top, DEFAULT_DOT_WIDTH),\n            dotStyle = {\n                fill: color,\n                'fill-opacity': 0,\n                'stroke-opacity': 0\n            };\n\n        dot.attr(dotStyle);\n\n        return dot;\n    },\n\n    /**\n     * Render dots.\n     * @param {object} paper raphael paper\n     * @param {array.&lt;array.&lt;object>>} groupPositions positions\n     * @param {string[]} colors colors\n     * @param {object} borderStyle border style\n     * @returns {array.&lt;object>} dots\n     */\n    renderDots: function(paper, groupPositions, colors) {\n        var dots = tui.util.map(groupPositions, function(positions, groupIndex) {\n            var color = colors[groupIndex];\n            return tui.util.map(positions, function(position) {\n                var dot = this.renderDot(paper, position, color);\n                return dot;\n            }, this);\n        }, this);\n\n        return dots;\n    },\n\n    /**\n     * Get center position\n     * @param {{left: number, top: number}} fromPos from position\n     * @param {{left: number, top: number}} toPos to position\n     * @returns {{left: number, top: number}} position\n     * @private\n     */\n    _getCenter: function(fromPos, toPos) {\n        return {\n            left: (fromPos.left + toPos.left) / 2,\n            top: (fromPos.top + toPos.top) / 2\n        };\n    },\n\n    /**\n     * Bind hover event.\n     * @param {object} dot raphael obejct\n     * @param {{left: number, top: number}} position position\n     * @param {number} groupIndex group index\n     * @param {number} index index\n     * @param {function} inCallback in callback\n     * @param {function} outCallback out callback\n     * @private\n     */\n    _bindHoverEvent: function(dot, position, groupIndex, index, inCallback, outCallback) {\n        dot.hover(function() {\n            inCallback(position, index, groupIndex);\n        }, function() {\n            outCallback();\n        });\n    },\n\n    /**\n     * Attach event.\n     * @param {array.&lt;array.&lt;object>>} groupDots dots\n     * @param {array.&lt;array.&lt;object>>} groupPositions positions\n     * @param {object} outDotStyle dot style\n     * @param {function} inCallback in callback\n     * @param {function} outCallback out callback\n     */\n    attachEvent: function(groupDots, groupPositions, outDotStyle, inCallback, outCallback) {\n        tui.util.forEach(groupDots, function(dots, groupIndex) {\n            tui.util.forEach(dots, function(dot, index) {\n                var position = groupPositions[groupIndex][index];\n                this._bindHoverEvent(dot, position, groupIndex, index, inCallback, outCallback);\n            }, this);\n        }, this);\n    },\n\n    /**\n     * Show dot.\n     * @param {object} dot raphael object\n     * @private\n     */\n    _showDot: function(dot) {\n        dot.attr({\n            'fill-opacity': 1,\n            'stroke-opacity': 0.3,\n            'stroke-width': 2,\n            r: HOVER_DOT_WIDTH\n        });\n    },\n\n    /**\n     * Show animation.\n     * @param {{groupIndex: number, index:number}} data show info\n     */\n    showAnimation: function(data) {\n        var index = data.groupIndex, // Line chart has pivot values.\n            groupIndex = data.index,\n            dot = this.groupDots[groupIndex][index];\n        this._showDot(dot);\n    },\n\n    /**\n     * Get pivot group dots.\n     * @returns {array.&lt;array>} dots\n     * @private\n     */\n    _getPivotGroupDots: function() {\n        if (!this.pivotGroupDots) {\n            this.pivotGroupDots = tui.util.pivot(this.groupDots);\n        }\n\n        return this.pivotGroupDots;\n    },\n\n    /**\n     * Show group dots.\n     * @param {number} index index\n     * @private\n     */\n    _showGroupDots: function(index) {\n        var dots = this._getPivotGroupDots();\n        tui.util.forEachArray(dots[index], tui.util.bind(this._showDot, this));\n    },\n\n    /**\n     * Show tooltip line.\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} bound bound\n     * @private\n     */\n    _showTooltipLine: function(bound) {\n        var linePath = raphaelRenderUtil.makeLinePath({\n            left: bound.position.left,\n            top: bound.dimension.height\n        }, {\n            left: bound.position.left,\n            top: bound.position.top\n        });\n        this.tooltipLine.attr({\n            path: linePath,\n            stroke: '#999',\n            'stroke-opacity': 1\n        });\n    },\n\n    /**\n     * Show group animation.\n     * @param {number} index index\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} bound bound\n     */\n    showGroupAnimation: function(index, bound) {\n        this._showGroupDots(index);\n        this._showTooltipLine(bound);\n    },\n\n    /**\n     * Hide dot.\n     * @param {object} dot raphael object\n     * @private\n     */\n    _hideDot: function(dot) {\n        dot.attr(this.outDotStyle);\n    },\n\n    /**\n     * Hide animation.\n     * @param {{groupIndex: number, index:number}} data hide info\n     */\n    hideAnimation: function(data) {\n        var index = data.groupIndex, // Line chart has pivot values.\n            groupIndex = data.index,\n            dot = this.groupDots[groupIndex][index];\n        if (dot) {\n            this._hideDot(dot);\n        }\n    },\n\n    /**\n     * Hide group dots.\n     * @param {number} index index\n     * @private\n     */\n    _hideGroupDots: function(index) {\n        var dots = this._getPivotGroupDots();\n        tui.util.forEachArray(dots[index], tui.util.bind(this._hideDot, this));\n    },\n\n    /**\n     * Hide tooltip line.\n     * @private\n     */\n    _hideTooltipLine: function() {\n        this.tooltipLine.attr({\n            'stroke-opacity': 0\n        });\n    },\n\n    /**\n     * Hide group animation.\n     * @param {number} index index\n     */\n    hideGroupAnimation: function(index) {\n        this._hideGroupDots(index);\n        this._hideTooltipLine();\n    },\n\n    /**\n     * Animate line.\n     * @param {object} line raphael object\n     * @param {string} linePath line path\n     * @param {number} time play time\n     * @param {number} startTime start time\n     */\n    animateLine: function(line, linePath, time, startTime) {\n        setTimeout(function() {\n            line.animate({path: linePath}, time);\n        }, startTime);\n    }\n});\n\nmodule.exports = RaphaelLineTypeBase;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"