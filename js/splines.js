function evalSpline(x, xs, ys, ks)
{
    var i = 1;
    while(xs[i]<x) i++;
		
    var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
		
    var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    var b = -ks[i  ]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
		
    var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return q;
}

function getNaturalKs(xs, ys, ks)    // in x values, in y values, out k values
{
    var n = xs.length-1;
    var A = CSPL._gaussJ.zerosMat(n+1, n+2);
        
    for(var i=1; i<n; i++)    // rows
    {
        A[i][i-1] = 1/(xs[i] - xs[i-1]);
        
        A[i][i  ] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
        
        A[i][i+1] = 1/(xs[i+1] - xs[i]);
        
        A[i][n+1] = 3*   ( (ys[i]-ys[i-1])/ ((xs[i] - xs[i-1])*(xs[i] - xs[i-1])) 
                         +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
    }
    
    A[0][0  ] = 2/(xs[1] - xs[0]);
    A[0][1  ] = 1/(xs[1] - xs[0]);
    A[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
    
    A[n][n-1] = 1/(xs[n] - xs[n-1]);
    A[n][n  ] = 2/(xs[n] - xs[n-1]);
    A[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));
        
    CSPL._gaussJ.solve(A, ks);        
}