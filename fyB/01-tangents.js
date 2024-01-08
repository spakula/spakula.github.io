var canvas = $('#myCanvas')[0], 
ctx = canvas.getContext('2d'), 
fn,dfn,
width = canvas.width, 
height = canvas.height,
range, widthScale, heightScale;
    

function plot(fn) { 
    first = true; 
    
    ctx.beginPath(); 
    
    for (var x = 0; x < width; x++) { 
        var xFnVal = (x / widthScale) + range[0], 
        yGVal = (fn(xFnVal) - range[2]) * heightScale; 
        
        yGVal = height - yGVal; // 0,0 is top-left 
        
        if (first) { 
            ctx.moveTo(x, yGVal); 
            first = false; 
        } 
        else { 
            ctx.lineTo(x, yGVal); 
        } 
    } 
    
    ctx.strokeStyle = "red"; 
    ctx.lineWidth = 3; 
    ctx.stroke();  
};

function plotaxes() {
    ctx.beginPath(); 
    ctx.moveTo(-range[0]*widthScale,height-(range[3]-range[2])*heightScale);
    ctx.lineTo(-range[0]*widthScale,height-(range[2]-range[2])*heightScale);
    ctx.moveTo(0,height+range[2]*heightScale);
    ctx.lineTo(width,height+range[2]*heightScale);
    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 1; 
    ctx.stroke();  
}

function plotlinesegment(dx,f,df,l) {
    ctx.beginPath();
    var x0=dx[0],y0=f(x0), x1=dx[1],y1=f(x1);
    var m;
    if (x1 == x0) {
        m = df(x1);
    } else {
        m= (y1-y0)/(x1-x0);
    }
    
    var x3 = -l/Math.sqrt(widthScale*widthScale+heightScale*heightScale*m*m)+x0,y3=m*(x3-x0)+y0;
    var sx3 = (x3-range[0])*widthScale,sy3 = height-(y3-range[2])*heightScale;
    var x4 = l/Math.sqrt(widthScale*widthScale+heightScale*heightScale*m*m)+x1,y4=m*(x4-x1)+y1;
    var sx4 = (x4-range[0])*widthScale,sy4 = height-(y4-range[2])*heightScale;
    
    var sx0 = (x0-range[0])*widthScale,sy0 = height-(y0-range[2])*heightScale;
    var sx1 = (x1-range[0])*widthScale,sy1 = height-(y1-range[2])*heightScale;
    var yaxis = height+range[2]*heightScale;
    
    ctx.moveTo(sx3,sy3);
    ctx.lineTo(sx4,sy4);
    ctx.strokeStyle = "blue"; 
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(sx0,sy0);
    ctx.lineTo(sx0,yaxis);
    ctx.moveTo(sx1,sy1);
    ctx.lineTo(sx1,yaxis);
    ctx.strokeStyle = "red"; 
    ctx.lineWidth = 2; 
    ctx.stroke();
    ctx.closePath();
}

function doplot() {
    var i = 0;
    let id = null;
    id = setInterval(frame,400);
    
    function frame() {
        ctx.clearRect(0, 0, width, height);
        plotaxes();
        plot(fn);
        plotlinesegment([1/4,1/4+1.3-i],fn,dfn,50+50*2*i);
        i = Math.round((i+0.1)*10000)/10000;
        if (i > 1.3) {
            clearInterval(id);
        }
    }
}
    
function init() {
    var list = [
        ['18 November 2020 10:00:00','18 November 2020 12:00:00'],
        ['03 September 2020 09:00:00','03 September 2020 10:00:00']
    ];
    fn = function(x) {return Math.sin(x) + Math.sin(x * 2);}
    dfn = function(x) {return Math.cos(x) + 2*Math.cos(x * 2);}
    range = [-Math.PI*2, Math.PI * 2, -4, 4],
    
    fn = function(x) {return x*x-x+3/4;}
    dfn = function(x) {return 2*x-1;}
    range = [-0.5, 2, -0.5, 2],
    
    widthScale = (width / (range[1] - range[0])), 
    heightScale = (height / (range[3] - range[2]));
    
    var n = Date.now();
    for (var i=0;i<list.length;i++) {
        var u = Date.parse(list[i][0]);
        var v = Date.parse(list[i][1]);
        if ((n > u) && (n < v)) {
            $('#div_head').html('This feature is unavailable at the present time.');
            break;
        }
    }
    ctx.clearRect(0, 0, width, height);
    plotaxes();
    plot(fn);
    plotlinesegment([1/4,1/4+1.3],fn,dfn,50);
}
