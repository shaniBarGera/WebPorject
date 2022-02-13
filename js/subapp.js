function SubApp() {
    
}

SubApp.prototype.constants = {
    colors: {
        CURVE: 'rgba(255, 255, 255, 1.0)',
        CURVE_POINTS: 'rgba(255, 255, 255, 0.35)',
        CURVE_POINTS_CURRENT: 'rgba(255, 255, 255, 1.0)',
        CURVE_POINTS_CURRENT_OUTLINE: 'rgba(102, 51, 153, 1.0)',
        PRIMARY_CONTROL_LINE: 'rgba(102, 51, 153, 1.0)',
        SECONDARY_CONTROL_LINES: 'rgba(0, 190, 196, 1.0)',
        BACKGROUND_COLOR: 'rgba(30, 30, 30, 1.0)'
    },
    CONTROL_POINT_WIDTH_HEIGHT: 10,
    CURVE_POINT_RADIUS: 5,
    RANDOM_POINT_PADDING: 20,
    RANDOM_POINT_SPACING: 50,
    LINE_WIDTH: 3,
    ORDERS: ['Linear', 'Quadratic', 'Cubic', 'Quartic']
};

/**
 * Sets the starting values for the app, both environmental references and starting curve data
 * @param window - the browser window object
 */
SubApp.prototype.init = function(window, td_id, title) {
    // Capture the window and canvas elements
    this.window = window;
    this.td_id = td_id;
    this.title = title;
    this.canvas = document.getElementById(this.td_id + '_parambox_canvas');
    this.ctx = this.canvas.getContext('2d');
    this.controlPointIndex = null;
    this.KControlPointIndex = null;
    this.ts = [];

    // Gather initial values from DOM controls
    this.gatherUserInput();

    // Generate the initial control points
    this.generateControlPoints();

    this.calc_ts();

    //this.generateKControlPoints();

    // Add event listener for handling mouse movement
    this.canvas.addEventListener('mousemove', function(evt) {
        this.mousePosition = this.getMousePos(this.canvas, evt);

        // Handle dragging-and-dropping the control points
        if (this.dragging === true) {
            //this.fixKControlPoints();
            this.hoveringPoint.x = this.mousePosition.x;
            this.calc_ts();
            //this.hoveringPoint.y = this.mousePosition.y;
            this.update();
        }

        // Otherwise listen for hovering over the primary control points
        else {
            this.hovering = false;
            for (var point in this.controlPoints) {
                //console.log(point);
                if(point == 0 || point == this.controlPoints.length - 1){
                    continue;
                } 
                if (this.checkPointHover(this.controlPoints[point], this.constants.CONTROL_POINT_WIDTH_HEIGHT)) {
                    this.hovering = true;
                    this.hoveringPoint = this.controlPoints[point];
                    this.KControlPointIndex = null;
                    this.controlPointIndex = point;
                }
            }
            for (var point in this.KControlPoints) {
                if (this.checkPointHover(this.KControlPoints[point], this.constants.CONTROL_POINT_WIDTH_HEIGHT)) {
                    this.hovering = true;
                    this.KControlPointIndex = point;
                    this.hoveringPoint = this.KControlPoints[point];
                }
            }
            if (this.hovering === true) {
                document.body.style.cursor = 'pointer';
            }
            else {
                document.body.style.cursor = 'auto';
                this.hovering = false;
                this.hoveringPoint = null;
            }
        }
    }.bind(this), false);

    // Add event listener for clicking the mouse down
    this.canvas.addEventListener('mousedown', function(evt) {
        if (this.hovering === true) {
            this.dragging = true;
            document.body.classList.add('unselectable');
        }
    }.bind(this));

    // Add event listener for unclicking the mouse
    this.canvas.addEventListener('mouseup', function(evt) {
        this.dragging = false;
        document.body.classList.remove('unselectable')
    }.bind(this));

    // Add event listener to handle any of the control values changing
    var app = this;
    document.getElementById('steps_input_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput();
        app.update();
    }.bind(this));

    // Add an input listener to the custom curve order value input control
    document.getElementById('n_input_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput();
        app.generateControlPoints();
        app.generateKControlPoints();
        app.update();
    });

    // Add an input listener to the custom curve order value input control
    if(title == "Monomial Basis" || title == "B-Spline"){
        document.getElementById('k_input_' + this.td_id).addEventListener('input', function(evt) {
            app.gatherUserInput();
            app.update();
        });
    }

    // Add an input listener to the slider control
    document.getElementById('tSlider_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput();
        app.update();
    });
};

SubApp.prototype.calc_ts = function(){
    var n = this.controlPoints.length;
    if(n < 2) return;
    var dist = this.controlPoints[n - 1].x - this.controlPoints[0].x;
    this.ts[0] = 0;
    this.ts[n-1] = 1;
    for(var i = 1; i < n - 1; i++){
        var dx = this.controlPoints[i].x - this.controlPoints[0].x;
        this.ts[i] = dx / dist;
    }

    console.log("ts:");
    for(var i = 0; i < n; i++){
        console.log(this.ts[i]);
    }
}

SubApp.prototype.fixKControlPoints = function(){
    if(this.title != "Cubic Hermite Spline") return;

    var dx = this.mousePosition.x - this.hoveringPoint.x;
    var dy = this.mousePosition.y - this.hoveringPoint.y;

    var curr_k_index = this.KControlPointIndex;
    var i = curr_k_index, j = curr_k_index;
    if(curr_k_index == null){
        i = this.controlPointIndex * 2;
        j = parseInt(i) + 1;
        this.KControlPoints[i].x += dx;
        this.KControlPoints[i].y += dy;
        this.KControlPoints[j].x += dx;
        this.KControlPoints[j].y += dy;
    } else if(curr_k_index % 2 == 0){
        i = parseInt(curr_k_index);
        j = i + 1;
        this.KControlPoints[j].x -= dx;
        this.KControlPoints[j].y -= dy;
    } else {
        i = curr_k_index - 1;
        j = parseInt(i) + 1;
        this.KControlPoints[i].x -= dx;
        this.KControlPoints[i].y -= dy;
    }

    //var line_index = Math.floor(curr_k_index / 2);

    //this.changeKPoint(i, j, line_index);
    console.log(this);
}

SubApp.prototype.changeKPoint = function (p1_index, p2_index, line_index){
    this.KControlLines[line_index].p1 = this.KControlPoints[p1_index];
    this.KControlLines[line_index].p2 = this.KControlPoints[p2_index];

    var p1 = this.KControlLines[line_index].p1;
    var p2 = this.KControlLines[line_index].p2;
    this.KControlLines[line_index].tan = tangent(p1, p2);
    this.KControlLines[line_index].dist = distance(p1, p2);
}

SubApp.prototype.fixTitle = function(){
    var order_num = 0;
    
    if(this.title == "Lagrange" || this.title == "Bezier"){
        order_num = this.orderSelection;
    } else if(this.title == "Monomial Basis" || this.title == "B-Spline"){
        order_num = this.kValue;
    }
    
    var order = '';
    var new_title = this.title;
    if(order_num < 6 && order_num > 1){
        var order = this.constants.ORDERS[order_num - 2];
        new_title = order + ' ' + this.title;
    }
    else if(order_num >= 6){
        new_title = this.title + ' (Order ' + order_num + ')';
    }
    document.getElementById(this.td_id + '_header').firstChild.innerText = new_title;
}

SubApp.prototype.displayStep = function(){
    t = 't = ' + this.tValue;
    document.getElementById('tValue_' + this.td_id).innerHTML = t;
}

/**
 * Recalculates the curve values and updates the slider based on the other UI values
 */
SubApp.prototype.update = function() {

    //this.fixTitle();
    //this.displayStep();
    
    //document.getElementById('tSlider_' + this.td_id).setAttribute('max', this.numSteps);

    this.curves = this.buildCurves();
    this.draw();
};

/**
 * Method called to recalculate the curve data from the currently stored user-inputted values. This should be called
 * every time any curve-related value is changed
 * @returns {Array}
 */
SubApp.prototype.buildCurves = function() {
    var controlPoints = this.controlPoints;
    var curves = [];

    // Generate the set of curves for each order
    for (var step = 0; step < this.numSteps; step++) {
        switch(this.title){
            case "Bezier":
                var t = step/(this.numSteps - 1);
                var curve = new BezierCurve(controlPoints, t);
                break;
            case "Cubic Spline":
                var curve = new CSPL(controlPoints, step, this.numSteps);
                break;
            case "Lagrange":
                var curve = new LagrangeCurve(controlPoints, step, this.numSteps);
                break;
            case "B-Spline":
                var curve = new BSpline(controlPoints, step, this.numSteps, this.kValue);
                break;
            case "Cubic Hermite Spline":
                var curve = new CHSPL(controlPoints, step, this.numSteps, this.KControlPoints);
                break;
            case "Monomial Basis":
                var curve = new MonomialCurve(controlPoints, step, this.numSteps, this.kValue);
                break;
            default:
                var curve = new LinearCurve(controlPoints, step, this.numSteps);
                break;
        }
        curves.push(curve);
    }
    
    return curves;
};

SubApp.prototype.drawSubCurve = function(step) {
           // If the current step matches the current slider value
           if (step === parseInt(this.tSliderValue)) {

            // Draw all of the control points for the control curve at the current point
            var subCurve = this.curves[step];
            while (subCurve.controlPoints != null) {
                this.drawControlPoints(
                    subCurve.controlPoints,
                    this.constants.colors.SECONDARY_CONTROL_LINES,
                    false
                );
                subCurve = subCurve.curve;
            }
        }
}

/**
 * Renders the curve and all curve-related graphical elements in the app
 */
SubApp.prototype.draw = function() {

    // Clear the render area
    clearCanvas(this.ctx, this.canvas.width, this.canvas.height, this.constants.colors.BACKGROUND_COLOR);

    // Draw the curve and all of the control points
    var prevPoint = null;
    for (var step = 0, t = 0, point = null; step < this.numSteps; step++, t = step / (this.numSteps - 1)) {
        
        var curve = this.curves[step];
        
        if(this.title == "Bezier"){
            this.drawSubCurve(step);

            // Find the point for the current t
            for (var curveNum = 0; curveNum < this.orderSelection - 1; ++curveNum) {
                curve = curve.curve;
            }
        } 

        prevPoint = point;
        point = curve.point;
        // Draw the curve segments
        if (step > 0) {
            drawLine(this.ctx, prevPoint.x, prevPoint.y, point.x, point.y, this.constants.LINE_WIDTH, this.constants.colors.CURVE);
        }

        
        // Draw the curve points
        if (step === parseInt(this.tSliderValue)) {
            drawCircle(
                this.ctx,
                point.x,
                point.y,
                this.constants.CURVE_POINT_RADIUS,
                this.constants.LINE_WIDTH,
                this.constants.colors.CURVE_POINTS_CURRENT,
                this.constants.colors.CURVE_POINTS_CURRENT
            );
        }
        else {
            drawCircle(
                this.ctx,
                point.x,
                point.y,
                this.constants.CURVE_POINT_RADIUS,
                this.constants.LINE_WIDTH,
                this.constants.colors.CURVE_POINTS,
                this.constants.colors.CURVE_POINTS
            )
        }
        
    }


    //this.drawKControlPoints(this.KControlPoints, this.constants.colors.SECONDARY_CONTROL_LINES);

    // Draw the primary curve control points with connecting lines
    this.drawControlPoints(this.controlPoints, this.constants.colors.PRIMARY_CONTROL_LINE, true);

    
    

};

/**
 * Renders a set of control points connected by a line that runs from each control point to the next control point
 * @param controlPoints - The control points to render
 * @param color - The color of the control points
 * @param primaryPoints - True if the given set of control points are the primary control points for the curve
 */
SubApp.prototype.drawControlPoints = function(controlPoints, color, primaryPoints)
{
    // Iterate through every control point in the given set
    for (var ctrlPoint = 0; ctrlPoint < controlPoints.length; ctrlPoint++) {
        var pt = controlPoints[ctrlPoint];

        // Draw a line segment from the previous point to the current point
        if (ctrlPoint > 0) {
            var prevPt = controlPoints[ctrlPoint-1];
            drawLine(this.ctx, pt.x, pt.y, prevPt.x, prevPt.y, this.constants.LINE_WIDTH, color);
        }

        // Draw a circle representing the current control point
        var fillColor = primaryPoints ? color : this.constants.colors.BACKGROUND_COLOR;
        drawRectangle(
            this.ctx,
            pt.x,
            pt.y,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT,
            this.constants.LINE_WIDTH,
            color,
            fillColor
        );
    }
};

/**
 * Renders a set of control points connected by a line that runs from each control point to the next control point
 * @param controlPoints - The control points to render
 * @param color - The color of the control points
 * @param primaryPoints - True if the given set of control points are the primary control points for the curve
 */
 SubApp.prototype.drawKControlPoints = function(controlPoints, color, primaryPoints)
 {
     if(controlPoints.length <= 0) return;
     // Iterate through every control point in the given set
     for (var ctrlPoint = 0; ctrlPoint < controlPoints.length; ctrlPoint++) {
         var pt = controlPoints[ctrlPoint];
 
         // Draw a line segment from the previous point to the current point
         if (ctrlPoint % 2 == 1) {
             var prevPt = controlPoints[ctrlPoint-1];
             drawLine(this.ctx, pt.x, pt.y, prevPt.x, prevPt.y, this.constants.LINE_WIDTH, color);
         }
 
         // Draw a circle representing the current control point
         var fillColor = primaryPoints ? this.constants.colors.SECONDARY_CONTROL_LINES : this.constants.colors.BACKGROUND_COLOR;
         drawCircle(
             this.ctx,
             pt.x,
             pt.y,
             this.constants.CONTROL_POINT_WIDTH_HEIGHT * 0.4,
             this.constants.CONTROL_POINT_WIDTH_HEIGHT * 0.4,
             this.constants.LINE_WIDTH,
             this.constants.colors.SECONDARY_CONTROL_LINES,
             fillColor
         );
     }
 };

/**
 * Refreshes the stored user-inputted values to match what is currently in the UI
 */
SubApp.prototype.gatherUserInput = function() {
    // Step control component
    this.numSteps = parseInt(document.getElementById('steps_input_' + this.td_id).value);

    // Order radio button group
    this.orderSelection = parseInt(document.getElementById('n_input_' + this.td_id).value);

    if(this.title == "Monomial Basis" || this.title == "B-Spline"){
        this.kValue = parseInt(document.getElementById('k_input_' + this.td_id).value);
    }

    // Order_input slider value
    this.tSliderValue = document.getElementById('tSlider_' + this.td_id).value;
    this.tValue = (this.tSliderValue / this.numSteps);
};

/**
 * Generate the primary control points for the curve based on the currently stored user-inputted values.
 */
SubApp.prototype.generateControlPoints = function() {
    var spacePerPoint = (this.canvas.width / this.orderSelection);
    this.controlPoints = [];

    y = 4* this.canvas.height / 5;
    for (var i = 0; i < this.orderSelection; i++) {
        this.controlPoints.push(
            new Point(
                i * spacePerPoint + (spacePerPoint / 2),
                y
            )
        );
    }
};

SubApp.prototype.generateKControlPoints = function() {
    this.KControlPoints = [];
    this.KControlLines = [];
    if(this.title != "Cubic Hermite Spline") return;
    var spacePerPoint = (this.canvas.width / this.orderSelection);
    var const_num = 8;
    var dir = -1;
    for (var i = 0; i < this.orderSelection; i++) {
        this.KControlPoints.push(
            new Point(
                this.controlPoints[i].x - (spacePerPoint / const_num),
                this.controlPoints[i].y - (dir * spacePerPoint / const_num)
            )
        );
            this.KControlPoints.push(
                new Point(
                    this.controlPoints[i].x + (spacePerPoint / const_num),
                    this.controlPoints[i].y + (dir * spacePerPoint / const_num)
                )
            );
            dir *= -1;
    }
    /*for (var i = 0; i < this.KControlPoints.length - 1; i+=2) {
        this.KControlLines.push(new KControlLine(this.KControlPoints[i], this.KControlPoints[i + 1]));
    }*/
}


/**
 * Utility method that returns a random int between min (inclusive) and max (exclusive)
 * @param min - The inclusive lower bound for the random int range
 * @param max - The exclusive upper bound for the random int range
 * @returns {number}
 */
SubApp.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min) + min);
};

/**
 * Return the current mouse position as a Point object
 * @param canvas - The HTML5 canvas element
 * @param evt - The 'mousemove' event
 * @returns {{x: number, y: number}}
 */
SubApp.prototype.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(evt.clientX - rect.left),
        y: Math.floor(evt.clientY - rect.top)
    };
};

/**
 * Check if the current mouse position collides with the given point (with padding)
 * @param point - The point to check the mouse position against
 * @param padding - The padding to use when checking for collision
 * @returns {boolean}
 */
SubApp.prototype.checkPointHover = function(point, padding) {
    if (!point)
        return false;

    return point.x >= this.mousePosition.x - padding && point.x <= this.mousePosition.x + padding &&
        point.y >= this.mousePosition.y - padding && point.y <= this.mousePosition.y + padding;
};

/**
 * Executes the application by initializing all of the app values and event listeners and performing the
 * initial 'update'. Subsequent updates will be performed in response to user-driven events
 * @param window - The browser window object
 */
SubApp.prototype.run = function(window, td_id, title) {
    this.init(window, td_id, title);
    this.update();
};