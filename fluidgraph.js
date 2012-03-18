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
	throw('Render not implemented!');
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
}

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

	context.beginPath();
	context.moveTo(this.scope.x, xAxisY);

	for(var drawX = 0; drawX < this.scope.width; drawX++) {
		var dataX = this.draw2dataX(drawX);
		var dataY = this.dataSource(dataX);
		var drawY = this.data2drawY(dataY);

		var canvasX = drawX + this.scope.x;
		var canvasY = drawY + this.scope.y;

		context.lineTo(canvasX, canvasY);
	}

	context.lineTo(this.scope.x + this.scope.width, xAxisY);
	context.closePath();

	context.lineWidth = 2;
	context.fillStyle = '#CFF3FF';
	context.fill();
	context.strokeStyle = '#169DC9';
	context.stroke();
};
