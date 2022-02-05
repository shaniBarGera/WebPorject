/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function CHSPL(controlPoints, step, num_steps) {
    this.cp = controlPoints;
    this.step_n = num_steps;
    this.cp_n = controlPoints.length;  
    this.step = step;

    if(step >= num_steps -1){
        this.point = controlPoints[this.cp_n - 1];
        console.log(this);
        return;
    }

    this.Arr = CHSPL._gaussJ.zerosMat(this.cp_n, this.cp_n);
    CHSPL.fillMatrix(this.Arr);

    this.xs = [];
    this.ys = [];
    CHSPL.fillXY(this.xs, this.ys, controlPoints);

    this.x_RHS = [];
    buildKnotsRHS(this.cp_n, this.xs, this.x_RHS);
    this.y_RHS = [];
    buildKnotsRHS(this.cp_n, this.ys, this.y_RHS);

    // CHANGE: get xks,xky by input
    // by default use gauss solve
    // use inputs dx, dy for control point i as xks[i], yks[i]
    // dx,dy will be inputed by tangents(mashik) to control points that user could rotate and stretch
    this.Arr_temp = CHSPL._gaussJ.zerosMat(this.cp_n, this.cp_n + 1);
    copy_arr(this.Arr, this.Arr_temp, this.x_RHS, this.cp_n);
    this.xks = [];
    CHSPL._gaussJ.solve(this.Arr_temp, this.xks);
    
    copy_arr(this.Arr, this.Arr_temp, this.y_RHS, this.cp_n);
    this.yks = [];
    CHSPL._gaussJ.solve(this.Arr_temp, this.yks);

    this.xks[2] *= 5;
    this.yks[2] *= 5;

    var relative_pos = findRelativePos(this.cp_n, num_steps, step);
    var i = relative_pos[0];
    var t = relative_pos[1];
    
    this.point = interpolateXY(i, t, this.xs, this.ys, this.xks, this.yks);
   
    console.log(this);
}

function interpolateXY(i, t, xs, ys, xks, yks){
    var prev_x = xs[i];
    var next_x = xs[i + 1];
    var prev_xk = xks[i];
    var next_xk = xks[i + 1];
    var prev_c_w = 1-3*Math.pow(t,2)+2*Math.pow(t,3);
    var next_c_w = 3*Math.pow(t,2)-2*Math.pow(t,3);
    var prev_k_w = t*Math.pow(1-t,2);
    var next_k_w = Math.pow(t,2)*(t-1);

    var prev_y = ys[i];
    var next_y = ys[i + 1];
    var prev_yk = yks[i];
    var next_yk = yks[i + 1];

    var x = prev_x * prev_c_w + next_x * next_c_w + prev_xk * prev_k_w + next_xk * next_k_w;
    var y = prev_y * prev_c_w + next_y * next_c_w + prev_yk * prev_k_w + next_yk * next_k_w;
    console.log(x,y);
    return new Point(x,y);
}
	
CHSPL._gaussJ = {};
CHSPL._gaussJ.solve = function(A, x)	// in Matrix, out solutions
{
    var m = A.length;
    for(var k=0; k<m; k++)	// column
    {
        // pivot for column
        var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
        for(var i=k; i<m; i++) if(Math.abs(A[i][k])>vali) { i_max = i; vali = Math.abs(A[i][k]);}
        CHSPL._gaussJ.swapRows(A, k, i_max);
        
        //if(A[k][k] == 0) console.log("matrix is singular!");
        
        // for all rows below pivot
        for(var i=k+1; i<m; i++)
        {
            var cf = (A[i][k] / A[k][k]);
            for(var j=k; j<m+1; j++)  A[i][j] -= A[k][j] * cf;
        }
    }
    
    for(var i=m-1; i>=0; i--)	// rows = columns
    {
        var v = A[i][m] / A[i][i];
        x[i] = v;
        for(var j=i-1; j>=0; j--)	// rows
        {
            A[j][m] -= A[j][i] * v;
            A[j][i] = 0;
        }
    }
}
CHSPL._gaussJ.zerosMat = function(r,c) {var A = []; for(var i=0; i<r; i++) {A.push([]); for(var j=0; j<c; j++) A[i].push(0);} return A;}
CHSPL._gaussJ.printMat = function(A){ for(var i=0; i<A.length; i++) console.log(A[i]); }
CHSPL._gaussJ.swapRows = function(m, k, l) {var p = m[k]; m[k] = m[l]; m[l] = p;}
    
    
CHSPL.getNaturalKs = function(xs, ys, ks)	// in x values, in y values, out k values
{
    var n = xs.length-1;
    var A = CHSPL._gaussJ.zerosMat(n+1, n+2);
        
    for(var i=1; i<n; i++)	// rows
    {
        A[i][i-1] = 1/(xs[i] - xs[i-1]);
        
        A[i][i  ] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
        
        A[i][i+1] = 1/(xs[i+1] - xs[i]);
        
        A[i][n+1] = 3*( (ys[i]-ys[i-1])/((xs[i] - xs[i-1])*(xs[i] - xs[i-1]))  +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
    }
    
    A[0][0  ] = 2/(xs[1] - xs[0]);
    A[0][1  ] = 1/(xs[1] - xs[0]);
    A[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
    
    A[n][n-1] = 1/(xs[n] - xs[n-1]);
    A[n][n  ] = 2/(xs[n] - xs[n-1]);
    A[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));
        
    CHSPL._gaussJ.solve(A, ks);		
}
   

/**
 * Creates a curve object
 * @param x the x of the point we want to calc y for
 * @param xs array of sorted
 * @returns y for a specific x
 */
CHSPL.evalSpline = function(x, xs, ys, ks)
{
    var i = 1;
    while(xs[i]<x) i++;
    
    var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
    
    var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    var b = -ks[i  ]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
    
    var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return q;
}

function copy_arr(arr, newArray, RHS, n){
    for (var i = 0; i < n; i++){
        for(var j = 0; j < n; ++j){
            newArray[i][j] = arr[i][j];
        }
        newArray[i][n] = RHS[i];
    }
        
}

CHSPL.fillXY = function(xs, ys, controlPoints){
    for(var i = 0; i < controlPoints.length; ++i){
        xs[i] = controlPoints[i].x;
        ys[i] = controlPoints[i].y;
    }
}

/**
 * Creates Matrix
 * @param n - control points num
 * @returns matrix the will calc the knots
 */
 CHSPL.fillMatrix = function(Arr){
    var n = Arr.length;
    for(var i = 0; i < n; ++i){
        Arr[i][i] = 8; // fill diagonal with 8s
        if(i > 0){
            Arr[i][i-1] = 2; // fill lower diagonal with 2s
        }
        if(i < n - 1){
            Arr[i][i+1] = 2; // fill upper diagonal with 2s
        }
    }
    Arr[0][0] = 4;
    Arr[n-1][n-1] = 4;
}
