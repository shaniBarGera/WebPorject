var apps = [];
var apps_num = -1;

function addApp(td, title){
    apps_num++;
    apps[apps_num] = new App().run(this.window, td.id, title);
    td.setAttribute("app", apps_num);
    
}

function findApp(td){
    for(var i = 0; i < apps_num; ++i){

    }
}

function removeApp(td){
    
}

function clearWindow(td_id) {
    var td = document.getElementById(td_id);
    if(td == null) return;
    var canvas = document.getElementById(td_id + "_canvas");
    if(canvas != null){
        var ctx = canvas.getContext('2d');
        clearCanvas(ctx, canvas.width, canvas.height, 'rgba(30, 30, 30, 1.0)');
    }
    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }
}

function createWindow(td, title){
    td.setAttribute("curvename", title);
    td.appendChild(createHeader(td.id, title), td.firstChild);
    td.appendChild(createControls(td.id, title));
    td.appendChild(createFormula(td, title));
    td.appendChild(createCanvas(td));
    addApp(td, title);
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
    label.style.width = "70px";
    label.style.height = "20px";
    label.style.display = "inline-block";
    label.style.overflow = "hidden";
    label.style.textAlign = "left";
    label.style.marginLeft = "2px";
    label.innerHTML = "t = 0.0";
    

    var input = document.createElement("input");
    input.type = "range";
    input.id = "tSlider_" + td_id;
    input.min = "0";
    input.max = "100";
    input.value = "0";
    input.className = "slider";
    input.oninput = function(){
        label.innerHTML = "t = " + this.value;
    }
    div.appendChild(input);
    div.appendChild(label);
    return div;
}

function createControls(td_id, title){
    // controls main box
    var controls = document.createElement("div");
    controls.id = td_id + "_controls";
    controls.className = "controls";

    if(title == "Monomial Basis" || title == "B-Spline"){
        controls.appendChild(createNumInput(td_id, "k", 3));
    }
    controls.appendChild(createNumInput(td_id, "n", 4));
    controls.appendChild(createNumInput(td_id, "steps", 20));
    controls.appendChild(createSlider(td_id));

    return controls;
}

function addFormualImg(title){
    var img = document.createElement("img");
    if(title == "Monomial Basis"){
        img.src = "imgs/Monomial-formula.png";
    } else if(title == "Cubic Spline" || title == "Cubic Hermite Spline"){
        img.src = "imgs/C-Spline-formula.png"
     } else{
        img.src="imgs/"+title+"-formula.png";
    }
    
    img.height = "50";
    img.style.width = "100%";
    img.style.objectFit = "scale-down";
    return img;
}

function createToolTip(title, modal){
    var info_tooltip = document.createElement("div");
    info_tooltip.className = "tooltip-top";
    var info_btn = document.createElement("button");
    info_btn.className = "info-btn";
    info_btn.id = title + "_info";
    info_btn.onclick = function(){
        modal.style.display = "block";
    };
    var text = document.createElement('a');
    text.innerText = '\u{2148}';
    info_btn.appendChild(text);
   
    var tooltip = document.createElement("span");
    tooltip.className = "tooltiptext-top";
    tooltip.innerHTML = "more info about equation";
    
    info_tooltip.appendChild(info_btn);
    info_tooltip.appendChild(tooltip);

    return info_tooltip;
}

function createModal(title){
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "myModal";

    var modal_content = document.createElement("div");
    modal_content.className = "modal-content";

    var close = document.createElement("span");
    close.className = "close";
    close.innerHTML = "&times;";
    modal_content.appendChild(close);

    var info_text = document.createElement("p");
    info_text.innerText = "hello world";
    modal_content.appendChild(info_text);

    modal.appendChild(modal_content);

    return modal;
}

function createFormula(td, title){
    var formula = document.createElement("div");
    formula.id = td.id + "_formula";
    formula.className = "formula";

    var modal = createModal(title);
    var info_tooltip = createToolTip(title, modal);
    info_tooltip.appendChild(modal);

    var img = addFormualImg(title);
   
    formula.appendChild(img); 
    formula.appendChild(info_tooltip);

    return formula;
}

function drawZoneHeight(td){
    var td_controls = document.getElementById(td.id + "_controls");
    var td_header = document.getElementById(td.id + "_header");
    var td_formula = document.getElementById(td.id + "_formula");
    var header_height = td_header.offsetHeight;
    var controls_height = td_controls.offsetHeight;
    var formula_height = td_formula.offsetHeight;
    //var formula_height = 0;
    return header_height + controls_height + formula_height;
}

function resizeCanvas(box, td){
    var bw = (td.offsetWidth - 10);
    var bh = (td.offsetHeight - drawZoneHeight(td));
    box.width = bw;
    box.height = bh;
}

function createCanvas(td){
    var box = document.createElement("canvas");
    box.id = td.id + "_canvas";
    resizeCanvas(box, td);
    return box;
}





