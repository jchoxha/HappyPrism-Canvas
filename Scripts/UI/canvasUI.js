import { Logger } from "../Debug/logger.js";
import { setUpAddShapeMenuEvents } from "../Events/CanvasEvents/canvasBarPopupEvents.js";

let canvasManager = null;

function updateCanvasUI(appManager){
    canvasManager = appManager.canvasManager;
}

function closeAllPopups(){

    if(canvasManager.popUpOpen){
        //Lower Center Popup
        let lowerCenterPopup = document.getElementById('lower-center-popup');
        lowerCenterPopup.innerHTML = "";
        if(canvasManager.toggleAddShapeMenu) canvasManager.toggleAddShapeMenu = false;
        if(canvasManager.toggleSelectOrDragMenu) canvasManager.toggleSelectOrDragMenu = false;


        canvasManager.popUpOpen = false;
    }
    

    
}

function toggleAddShapeMenu(){
    setCanvasManagerInteractionMode("addShape");
    canvasManager.toggleAddShapeMenu = !canvasManager.toggleAddShapeMenu;

    let lowerCenterPopup = document.getElementById('lower-center-popup');

    if (canvasManager.toggleAddShapeMenu) {

        canvasManager.popUpOpen = true;

        
        let addShapeButton = document.getElementById('add-shape-button');
        // Calculate the center point of the addShapeButton
        var rect = addShapeButton.getBoundingClientRect();
        var centerX = rect.left + (rect.width / 2);
        // Convert centerX to string and append 'px', assign as left of popup
        lowerCenterPopup.style.left = centerX + 'px';
        lowerCenterPopup.innerHTML = `
        <button id="elipse-shape-button"><img src="Assets/Images/Icons/ui/Canvas/Lower/Popups/AddShape/elipse.svg" alt="Elipse"></button>
        <button id="rounded-rectangle-shape-button"><img src="Assets/Images/Icons/ui/Canvas/Lower/Popups/AddShape/rounded-rectangle.svg" alt="Rounded Rectangle"></button>
        `;
        setUpAddShapeMenuEvents();
    } else {
        lowerCenterPopup.innerHTML = "";
    }
}

function toggleSelectOrDragMenu(){
    setCanvasManagerInteractionMode("selectCanvas");
    canvasManager.toggleSelectOrDragMenu = !canvasManager.toggleSelectOrDragMenu;

    let lowerCenterPopup = document.getElementById('lower-center-popup');
    

    if (canvasManager.toggleSelectOrDragMenu) {

        canvasManager.popUpOpen = true;

        let addShapeButton = document.getElementById('select-or-drag-button');
        // Calculate the center point of the addShapeButton
        var rect = addShapeButton.getBoundingClientRect();
        var centerX = rect.left + (rect.width / 2);
        // Convert centerX to string and append 'px', assign as left of popup
        lowerCenterPopup.style.left = centerX + 'px';
        lowerCenterPopup.innerHTML = `
        <button id="elipse-shape-button"><img src="Assets/Images/Icons/ui/Canvas/Lower/Popups/AddShape/elipse.svg" alt="Elipse"></button>
        <button id="rounded-rectangle-shape-button"><img src="Assets/Images/Icons/ui/Canvas/Lower/Popups/AddShape/rounded-rectangle.svg" alt="Rounded Rectangle"></button>
        `;
        setUpAddShapeMenuEvents();
    } else {
        lowerCenterPopup.innerHTML = "";
    }
}

function setCanvasManagerInteractionMode(mode){
    if(mode == "selectCanvas" || mode == "IM1" || mode == 1){
        canvasManager.interactionMode = "selectCanvas";
        document.getElementById("canvas").style.cursor = "url('Assets/Images/Cursors/Select/cursor_select.cur'), url('Assets/Images/Cursors/Select/cursor_select.svg'), auto";
    }
    else if(mode == "dragCanvas" || mode == "IM2" || mode == 2){
        canvasManager.interactionMode = "dragCanvas";
    }
    else if(mode == "addShape" || mode == "IM3" || mode == 3){
        canvasManager.interactionMode = "addShape";
        document.getElementById("canvas").style.cursor = "url('Assets/Images/Cursors/Crosshair/crosshair.svg') 16 16, auto";
    }
}

function setContentCanvasDetails(canvasManager) {
    let toggleCanvasDetails = "+";
    let canvasDetailsContent = "";
    if (canvasManager.toggleCanvasDetails) {
        toggleCanvasDetails = "-";
        canvasDetailsContent =
            `Canvas Details:<br>
            Width: ${canvasManager.canvas.width}<br>
            Height: ${canvasManager.canvas.height}<br>
            xCenter: ${canvasManager.xCenter}<br>
            yCenter: ${canvasManager.yCenter}<br>
            Scale: ${canvasManager.scale.toFixed(2)}<br>
            TranslateX: ${canvasManager.translateX.toFixed(0)}<br>
            TranslateY: ${canvasManager.translateY.toFixed(0)}<br>
            <br>Current Mouse Coords:<br>
            X: ${canvasManager.currentmousePos.x.toFixed(0)}<br>
            Y: ${canvasManager.currentmousePos.y.toFixed(0)}<br>
            <br>Mouse Down Coords:<br>
            X: ${canvasManager.mousePositionOnDown.x.toFixed(0)}<br>
            Y: ${canvasManager.mousePositionOnDown.y.toFixed(0)}<br>
            <br>Mouse Up Coords:<br>
            X: ${canvasManager.mousePositionOnUp.x.toFixed(0)}<br>
            Y: ${canvasManager.mousePositionOnUp.y.toFixed(0)}<br>
            <br>Mouse Drag Coords:<br>
            X: ${canvasManager.mousePositionOnMoveStart.x.toFixed(0)}<br>
            Y: ${canvasManager.mousePositionOnMoveStart.y.toFixed(0)}<br>
            <br>View Range:<br>
            X: ${Math.round(canvasManager.topLeftX.toFixed(0))} to ${Math.round(canvasManager.bottomRightX.toFixed(2))}<br>
            Y: ${Math.round(canvasManager.topLeftY.toFixed(0))} to ${Math.round(canvasManager.bottomRightY.toFixed(2))}`;
    }
    document.getElementById('toggle-canvas-details').innerHTML = toggleCanvasDetails;
    document.getElementById('canvas-details-content').innerHTML = canvasDetailsContent;
}

function setContentNodeDetails(canvasManager, node = null) {
    let toggleNodeDetails = "+";
    let nodeDetailsContentDynamic = "";
    let nodeDetailsContentStatic = "";

    if (canvasManager.toggleNodeDetails && node) {
        toggleNodeDetails = "-";
        nodeDetailsContentDynamic = `
            <u>${node.name}</u><br>
            Position: ${Math.round(node.x)}, ${Math.round(node.y)}<br>
            X Velocity: ${node.vx.toFixed(2)}<br>
            Y Velocity: ${node.vy.toFixed(2)}<br>
            Size: ${node.size}<br>
            Shape: ${node.shapeType.name}<br>
        `;
        document.getElementById('node-details-content-dynamic').innerHTML = nodeDetailsContentDynamic;

        if (!canvasManager.nodeDetailsStaticContentInit) {
            Logger.log("Initializing static node details content")
            canvasManager.nodeDetailsStaticContentInit = true;
            nodeDetailsContentStatic = ``;
            nodeDetailsContentStatic += `<input type="range" min="30" max="500" value="${node.size}" id="node-size-range"><br>`;
            nodeDetailsContentStatic += `<button id="toggle-node-position-fixed">${node.positionFixed ? "Unfix Position" : "Fix Position"}</button><br>`;
            nodeDetailsContentStatic += `Fill color: <input id ="node-color-picker" value="${node.fill}" data-jscolor="{preset:'small dark', position:'right'}" onclick="canvasManager.blur();"><br> `;
            
            document.getElementById('node-details-content-static').innerHTML = nodeDetailsContentStatic;
            
            // setUpNodeDetailsEvents(canvasManager, node);

        }
    } else {
        canvasManager.toggleNodeDetails = false;
        canvasManager.nodeDetailsStaticContentInit = false;
        document.getElementById('node-details-content-dynamic').innerHTML = "";
        document.getElementById('node-details-content-static').innerHTML = "";
    }

    document.getElementById('toggle-node-details').innerHTML = toggleNodeDetails;
}

export { updateCanvasUI, closeAllPopups, toggleSelectOrDragMenu, toggleAddShapeMenu };