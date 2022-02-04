function clearWindow(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createWindow(td, title){
    td.appendChild(createHeader(td.id, title));
    td.appendChild(createControls(td.id));
    td.appendChild(createCurve(td, title));
}

function createHeader(td_id, title){
    var header = document.createElement("div");
    header.id = td_id + "_header";
    header.className = "window-header";
    var text = document.createElement('a');
    text.innerText = title;
    header.appendChild(text);

    return header;
}

function createNumInput(td_id, title, value){
    var div = document.createElement("div");
    div.id = title + "_input_wrapper_" + td_id;
    div.className = "control-input";

    var text = document.createTextNode(title + " ");
    div.appendChild(text);

    var input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.size = "1";
    input.min = "1";
    input.className ="input-num";
    input.id = title + "_input_" + td_id;
    div.appendChild(input);

    return div;
}

function createSlider(td_id){
    var div = document.createElement("div");
    div.id = "sliderControl_" + td_id;
    div.className = "control-input";

    var label = document.createElement("label");
    label.id = "tValue_" + td_id;
    label.innerHTML = "t = 0.0";
    div.appendChild(label);

    var input = document.createElement("input");
    input.type = "range";
    input.id = "tSlider_" + td_id;
    input.min = "0";
    input.max = "100";
    input.value = "0";
    input.className = "slider";
    input.oninput = function(){
        label.innerHTML = "t = " + this.value.toFixed(2);
    }
    div.appendChild(input);
    return div;
}

function createControls(td_id){
    // controls main box
    var controls = document.createElement("div");
    controls.id = td_id + "_controls";
    controls.className = "controls";

    controls.appendChild(createNumInput(td_id, "Order", 3));
    controls.appendChild(createNumInput(td_id, "Steps", 16));
    controls.appendChild(createSlider(td_id));

    return controls;
}

function createFormula(td_id, title){
    var formula = document.createElement("div");
    formula.id = td_id + "_formula";
    formula.className = "formula";
    var text = document.createElement('a');
    switch(title){
        case "Monomial":
            text.innerText = "L(t) = t^2 + t + 1";
            break;
        case "Lagrange":
            text.innerText = "L(t) = t";
            break;
        case "Bezier":
            text.innerText = "B(t) = P0 + t(P1-P0)";
            break;
        default:
            text.innerText = title;
            break;
    }
    formula.appendChild(text);
    return formula;

}

function drawZoneHeight(td){
    var td_controls = document.getElementById(td.id + "_controls");
    var td_header = document.getElementById(td.id + "_header");
    //var td_formula = document.getElementById(td.id + "_formula");
    var header_height = td_header.offsetHeight;
    var controls_height = td_controls.offsetHeight;
    //var formula_height = td_formula.offsetHeight;
    var formula_height = 0;
    return header_height + controls_height + formula_height;
}

function resizeCanvas(box, td){
    var bw = (td.offsetWidth - 30);
    var bh = (td.offsetHeight - drawZoneHeight(td));
    box.width = bw;
    box.height = bh
}

function createCanvas(td){
    var box = document.createElement("canvas");
    box.id = td.id + "_canvas";
    resizeCanvas(box, td);
    return box;
}

function createCurve(td, title){
    var box = document.createElement("canvas");
    box.id = td.id + "_draw";
    box.style.borderColor = "blue";
    box.style.borderStyle = "solid";
    var bw = (td.offsetWidth - 30);
    var bh = (td.offsetHeight - drawZoneHeight(td));
    box.width = bw;
    box.height = bh;

    var ctx = box.getContext("2d");
    ctx.clearRect(0, 0, box.width, box.height);
    ctx.strokeStyle = "rgb(102, 51, 153)";
    ctx.lineWidth = "5px";
  
    switch(title){
        case "Bezier":
            drawBezier(box, ctx);
            break;
        case "Monomial":
            drawRect(box, ctx);
            break;
        case "Lagrange":
            drawBezierInteractive(box);
            break;
        default:
            myDrawLine(box, ctx);
            break;
    }
    return box;
}