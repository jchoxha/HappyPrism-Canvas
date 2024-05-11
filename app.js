import { ShapeType } from './shapes.js';
import { Node, addNode, removeNode, removeOnlyParent } from './nodes.js';
import { CanvasManager } from './canvasManager.js';
import { setupEventListeners } from './eventManager.js'
import { physicsUpdate } from './physics.js'


function toggleDisplay(divId) {
    const infoDiv = document.getElementById(divId);
    if (infoDiv.style.display === 'none') {
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const canvasManager = new CanvasManager('canvas');
    setupEventListeners(canvasManager);
   
    const addButton = document.getElementById('add-node');
    const removeButton = document.getElementById('remove-node');
    const toggleNodeDetails = document.getElementById('toggle-node-details');
    const toggleCanvasDetails = document.getElementById('toggle-canvas-details');

    addButton.addEventListener('click', () => {
        // If no node is selected, add a new node without a parent
        if (!canvasManager.highlightedNode) {
            canvasManager.highlightedNode = addNode(canvasManager);
        } else {
            // Add a child node to the selected node
            addNode(canvasManager, canvasManager.highlightedNode);
        }
        canvasManager.draw();
    });

    removeButton.addEventListener('click', () => {
        const modal = document.getElementById('confirmation-modal');
        if (canvasManager.highlightedNode) {
            modal.style.display = 'block'; // Show the modal
            if (canvasManager.highlightedNode.children.length > 0) {
                document.getElementById('remove-with-children').style.display = 'block';
                document.getElementById('remove-only-this').innerText = "Remove Only This Node";
            } else {
                document.getElementById('remove-with-children').style.display = 'none';
                document.getElementById('remove-only-this').innerText = "Yes - Remove This Node";
            }
    
            document.getElementById('remove-with-children').onclick = () => {
                removeNode(canvasManager.nodes, canvasManager.highlightedNode);
                canvasManager.highlightedNode = null;
                canvasManager.selectedNode = null;
                canvasManager.draw();
                modal.style.display = 'none'; // Hide the modal
            };
    
            document.getElementById('remove-only-this').onclick = () => {
                removeOnlyParent(canvasManager.nodes, canvasManager.highlightedNode);
                canvasManager.highlightedNode = null;
                canvasManager.selectedNode = null;
                canvasManager.draw();
                modal.style.display = 'none'; // Hide the modal
            };
    
            document.getElementById('cancel-remove').onclick = () => {
                modal.style.display = 'none'; // Hide the modal
            };
        }
    });
    if (toggleNodeDetails) {
        toggleNodeDetails.addEventListener('click', () => {
            canvasManager.toggleNodeDetails = !canvasManager.toggleNodeDetails;
        });
    }

    if (toggleCanvasDetails) {
        toggleCanvasDetails.addEventListener('click', () => {
            canvasManager.toggleCanvasDetails = !canvasManager.toggleCanvasDetails;
        });
    }
   
    function update() {
        physicsUpdate(canvasManager);
        canvasManager.draw();
    }
    function animate() {
        update();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});

