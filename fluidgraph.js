//
// FluidGraph
//

function FluidGraph() {
	this.canvas = null;
	this.setRangeX(0, 0);
	this.setRangeY(0, 0);
	this.dataSource = function() { return null; };
	this.autoUpdate = null;
}

FluidGraph.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
	this.canvasWidth = canvas.width;
	this.canvasHeight = canvas.height;
	this.changed();
};

FluidGraph.prototype.setRangeX = function(from, to) {
	this.rangeXFrom = from;
	this.rangeXTo = to;
	this.rangeX = (this.rangeXTo - this.rangeXFrom);
	this.changed();
};

FluidGraph.prototype.setRangeY = function(from, to) {
	this.rangeYFrom = from;
	this.rangeYTo = to;
	this.rangeY = (this.rangeYTo - this.rangeYFrom);
	this.changed();
};

FluidGraph.prototype.setDataSource = function(dataSource) {
	this.dataSource = dataSource;
	this.changed();
};

FluidGraph.prototype.setAutoUpdate = function(autoUpdate) {
	this.autoUpdate = !!autoUpdate;
};

FluidGraph.prototype.changed = function() {
	if(this.autoUpdate) {
		this.render();
	}
};

FluidGraph.prototype.init = function() {
	if(this.autoUpdate == null) {
		this.autoUpdate = true;
		this.render();
	}
};

FluidGraph.prototype.render = function() {
	throw('render() not implemented');
};

FluidGraph.prototype.data2drawX = function(dataX) {
	return  ((dataX - this.rangeXFrom) / this.rangeX) * this.scope.width;
};

FluidGraph.prototype.data2drawY = function(dataY) {
	return  (1 - ((dataY - this.rangeYFrom) / this.rangeY)) * this.scope.height;
};

FluidGraph.prototype.draw2dataX = function(drawX) {
	return (drawX / this.scope.width) * this.rangeX + this.rangeXFrom;
};

FluidGraph.prototype.draw2dataY = function(drawY) {
	return (drawY / this.scope.heigth) * this.rangeY + this.rangeYFrom;	// XXX
};

//
// FluidGraphLine
//

FluidGraphLine.prototype = new FluidGraph();
FluidGraphLine.prototype.constructor = FluidGraphLine;
function FluidGraphLine(canvas) {
	this.setCanvas(canvas);

	this.lineWidth = 2;
	this.lineStyle = '#169DC9';
	this.fillStyle = '#CFF3FF';

	this.xAxisWidth = 2;
	this.xAxisStyle = '#000000';
	this.yAxisWidth = 2;
	this.yAxisStyle = '#000000';
}

FluidGraphLine.prototype.setLine = function(width, style) {
	this.lineWidth = width || 0;
	if(width && style) {
		this.lineStyle = style;
	}
};

FluidGraphLine.prototype.setFill = function(style) {
	this.fillStyle = style;
};

FluidGraphLine.prototype.setXAxis = function(width, style) {
	this.xAxisWidth = width || 0;
	if(width && style) {
		this.xAxisStyle = style;
	}
};

FluidGraphLine.prototype.setYAxis = function(width, style) {
	this.yAxisWidth = width || 0;
	if(width && style) {
		this.yAxisStyle = style;
	}
};

FluidGraphLine.prototype.setAxes = function(width, style) {
	this.setXAxis(width, style);
	this.setYAxis(width, style);
};

FluidGraphLine.prototype.render = function() {
	this.canvas.width = this.canvas.width;
	var context = this.canvas.getContext('2d');

	this.scope = {
		width: this.canvasWidth - 10,
		height: this.canvasHeight - 10,
		x: 5,
		y: 5
	}

	var xAxisY = this.data2drawY(0);
	var yAxisX = this.data2drawX(0);

	context.beginPath();
	context.moveTo(this.scope.x, this.scope.y + xAxisY);

	for(var drawX = 0; drawX < this.scope.width; drawX++) {
		var dataX = this.draw2dataX(drawX);
		var dataY = this.dataSource(dataX);
		var drawY = this.data2drawY(dataY);

		context.lineTo(this.scope.x + drawX, this.scope.y + drawY);
	}

	context.lineTo(this.scope.x + this.scope.width, this.scope.y + xAxisY);
	context.closePath();

	context.lineWidth = this.lineWidth;
	if(this.fillStyle) {
		context.fillStyle = this.fillStyle;
		context.fill();
	}
	if(this.lineWidth) {
		context.strokeStyle = this.lineStyle;
		context.stroke();
	}

	if(this.xAxisWidth) {
		context.beginPath();
		context.moveTo(this.scope.x, this.scope.y + xAxisY);
		context.lineTo(this.scope.x + this.scope.width, this.scope.y + xAxisY);
		context.closePath();

		context.lineWidth = this.xAxisWidth;
		context.strokeStyle = this.xAxisStyle;
		context.stroke();
	}

	if(this.yAxisWidth) {
		context.beginPath();
		context.moveTo(this.scope.x + yAxisX, this.scope.y);
		context.lineTo(this.scope.x + yAxisX, this.scope.y + this.scope.height);
		context.closePath();

		context.lineWidth = this.yAxisWidth;
		context.strokeStyle = this.yAxisStyle;
		context.stroke();
	}
};
