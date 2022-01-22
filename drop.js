function createHeader(data){
    var header = document.createElement("div");
    header.innerHTML = data;
    header.style.backgroundImage = "linear-gradient(rgb(36, 35, 35), rgb(56, 55, 55), rgb(46, 45, 45))";
    header.style.backgroundColor = "rgb(46, 45, 45)";
    header.style.display = 'inline-block';
    header.style.verticalAlign = "top";
    header.style.width = "100%";
    header.style.height= "30px";
    header.style.textAlign = "center";
    header.style.margin= "0";
    header.style.paddingTop = "10px";
    
    var title = header.firstElementChild;
    title.style.color = "rgb(184, 184, 184)";
    title.style.font ="bold 20px Arial, sans-serif";
    title.style.textDecoration = "none";
    header.id = title.innerHTML + "_Header";

    return header;
}

function createControls(){
    // controls main box
    var controls = document.createElement("div");
    controls.id = "controls";
    controls.style.backgroundColor = "rgb(56, 55, 55)";
    controls.style.display = 'inline-block';
    controls.style.verticalAlign = "top";
    controls.style.width = "100%";
    controls.style.height= "40px";
    controls.style.textAlign = "center";
    controls.style.marginTop= "0";
    controls.style.top = "0";
    controls.style.paddingTop= "10px";
    controls.style.paddingBottom = "0";
    controls.style.color = "rgb(184, 184, 184)";
    controls.style.font ="15px Arial";
    //controls.style.grid-template-columns = "30% 30% 30%";


    // order input
    var orderText = document.createTextNode("Order ");
    controls.appendChild(orderText);
    var input = document.createElement("input");
    input.type = "text";
    input.name = "order";
    input.style.backgroundColor = "black";
    input.style.color = "rgb(184, 184, 184)";
    input.size = "3";
    input.style.marginRight = "50px";
    controls.appendChild(input);

    //steps input
    var stepsText = document.createTextNode("Steps# ");
    controls.appendChild(stepsText);
    var input2 = document.createElement("input");
    input2.type = "text";
    input2.name = "steps";
    input2.style.backgroundColor = "black";
    input2.style.color = "rgb(184, 184, 184)";
    input2.size = "3";
    input2.style.marginRight = "50px";
    controls.appendChild(input2);

    // t input
    var slider = document.createElement("span");
    slider.id = "SliderControl"
    //slider.style.width = "10%";
    slider.style.alignItems = "center";
    controls.appendChild(slider);
    var label = document.createElement("label");
    label.id = "tValue";
    label.innerHTML = "t = 0.0";
    label.style.display = "inline-block";
    slider.appendChild(label);

    var input3 = document.createElement("input");
    //input3.style.width = "10%";
    input3.type = "range";
    input3.name = "tSlider";
    input3.min = "0";
    input3.max = "100";
    input3.value = "0";
    input3.class = "slider";
    //input3.style.marginRight = "50px";
    input3.style.color = "-internal-light-dark(rgb(16, 16, 16), rgb(255, 255, 255))";
    input3.style.backgroundColor = "-internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59))";
    slider.appendChild(input3);

    return controls;
}



function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function drawCurve(t){
    var c = createCanvas(t);
    t.appendChild(c);

    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgb(102, 51, 153)";
    ctx.lineWidth = "5px";

    switch(t.firstChild.id.toString()){
        case "Bezier_Header":
            drawBezier(c, ctx);
            break;
        case "Monomial_Header":
            drawRect(c, ctx);
            break;
        default:
            drawLine(c, ctx);
            break;
    }
}


function droppoint(event) {
    event.preventDefault();
    removeAllChildNodes(event.target);

    var data = event.target.dataTransfer.getData("text/html");
    event.target.appendChild(createHeader(data));
    event.target.appendChild(createControls());
    //drawCurve(event.target);
}

function allowDropOption(event) {
    event.preventDefault();
}

function dragpoint(event) {
    event.dataTransfer.setData("Text", event.target.id);
}