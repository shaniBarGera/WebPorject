/**
 * Creates a new 2-D Point object
 * @param x - The value of the point in the first dimension
 * @param y - The value of the point in the second dimension
 * @constructor
 */
 function Point(x, y) {
    this.x = x;
    this.y = y;
}

function distance(p1, p2){
    let y = p2.x - p1.x;
    let x = p2.y - p1.y;
    
    return Math.sqrt(x * x + y * y);
}

function tangent(p1, p2){
    if(p2.x == p1.x) return 1;
    return (p2.y - p1.y) / (p2.x - p1.x);
}

function KControlLine(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
    this.tan = tangent(p1, p2);
    this.dist = distance(p1, p2);
}

KControlLine.changePoint = function (p, index){
    if(index % 2 == 0)
        this.p1 = p;
    else
        this.p2 = p;

    var p1 = this.p1;
    var p2 = this.p2;
    this.tan = tangent(p1, p2);
    this.dist = distance(p1, p2);
}

KControlLines(points){
    this.points = points;
    this.lines = [];
    for(var i = 0; i < points.length; i++){
        this.lines.push(new KControlLine(points[i], points[i+1]);
    }
}

/**
 * Clear and fill a canvas with the specified color
 * @param ctx - The drawing context
 * @param width - The width of the canvas
 * @param height - The height of the canvas
 * @param color - The color with which to paint over the canvas
 */
function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
}

/**
 * Draw a line from (startX,startY) to (endX,endY)
 * @param ctx - The drawing context
 * @param startX - The x-coordinate of the starting point
 * @param startY - The y-coordinate of the starting point
 * @param endX - The x-coordinate of the ending point
 * @param endY - The y-coordinate of the ending point
 * @param width - The width of the line to draw
 * @param style - The color to draw the line
 */
function drawLine(ctx, startX, startY, endX, endY, width, style) {
    ctx.lineWidth = width;
    ctx.strokeStyle = style;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
}

/**
 * Draw a circle at (xPos,yPos)
 * @param ctx - The drawing context
 * @param xPos - The x-coordinate of the center of the circle
 * @param yPos - The y-coordinate of the center of the circle
 * @param radius - The radius of the circle to draw
 * @param borderWidth - The line width of the border to draw
 * @param borderStyle - The color of the border to draw
 * @param fillStyle - The color with which to fill the circle
 */
function drawCircle(ctx, xPos, yPos, radius, borderWidth, borderStyle, fillStyle) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

/**
 * Draw a rectangle centered at (centerX,centerY)
 * @param ctx - The drawing context
 * @param centerX - The x-coordinate of the center of the rectangle
 * @param centerY - The y-coordinate of the center of the rectangle
 * @param width - The width of the rectangle to draw
 * @param height - The height of the rectangle to draw
 * @param borderWidth - The line width of the border to draw
 * @param borderStyle - The color of the border to draw
 * @param fillStyle - The color with which to fill the rectangle
 */
function drawRectangle(ctx, centerX, centerY, width, height, borderWidth, borderStyle, fillStyle) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.rect(centerX - width/2, centerY - height/2, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}