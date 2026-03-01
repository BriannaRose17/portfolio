let selectedItem = null;
let zCounter = 10;

// 1. BACKGROUND UPLOAD
document.getElementById('bgInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('canvas').style.backgroundImage = `url(${event.target.result})`;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. SELECTION SYSTEM
function selectItem(e, el, name) {
    e.stopPropagation(); // Prevents the canvas from deselecting immediately
    if (selectedItem) selectedItem.classList.remove('selected');
    
    selectedItem = el;
    selectedItem.classList.add('selected');
    document.getElementById('targetLabel').innerText = "Editing: " + name;

    // Sync sliders to the item's current state
    const style = window.getComputedStyle(el);
    document.getElementById('sizeSlider').value = parseInt(style.fontSize) || 120;
    // We don't sync rotation here to keep the slider smooth
}

// 3. DESELECT WHEN CLICKING EMPTY SPACE
document.getElementById('canvas').onclick = (e) => {
    if (e.target.id === 'canvas') {
        if (selectedItem) selectedItem.classList.remove('selected');
        selectedItem = null;
        document.getElementById('targetLabel').innerText = "Select an item...";
    }
};

// 4. ADD FLOWER LOGIC
function addFlower(emoji) {
    const canvas = document.getElementById('canvas');
    const f = document.createElement('div');
    f.className = 'flower-instance';
    f.innerHTML = emoji;
    f.style.fontSize = document.getElementById('sizeSlider').value + 'px';
    f.style.left = '45%';
    f.style.top = '30%';
    f.style.zIndex = zCounter++; 
    f.dataset.flip = "1";
    f.dataset.rotation = "0";

    // Re-attach Drag & Drop
    f.onmousedown = function(e) {
        selectItem(e, f, 'Flower');
        
        let shiftX = e.clientX - f.getBoundingClientRect().left;
        let shiftY = e.clientY - f.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            let rect = canvas.getBoundingClientRect();
            f.style.left = (pageX - rect.left - shiftX) + 'px';
            f.style.top = (pageY - rect.top - shiftY) + 'px';
        }

        function onMouseMove(me) { moveAt(me.pageX, me.pageY); }
        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    f.ondragstart = () => false;
    canvas.appendChild(f);
}

// 5. STYLING TOOLS
function updateProp(prop, val) {
    if (!selectedItem) return;
    if (selectedItem.id === 'theVase' && prop === 'color') {
        selectedItem.querySelector('path').style.fill = val;
    } else {
        selectedItem.style[prop] = val;
    }
}

function updateRotation(val) {
    if (!selectedItem) return;
    selectedItem.dataset.rotation = val;
    applyTransforms();
}

function flipItem() {
    if (!selectedItem) return;
    let currentFlip = selectedItem.dataset.flip === "-1" ? "1" : "-1";
    selectedItem.dataset.flip = currentFlip;
    applyTransforms();
}

function applyTransforms() {
    if (!selectedItem) return;
    const rotation = selectedItem.dataset.rotation || 0;
    const flip = selectedItem.dataset.flip || 1;
    const center = selectedItem.id === 'theVase' ? 'translateX(-50%) ' : '';
    selectedItem.style.transform = `${center}rotate(${rotation}deg) scaleX(${flip})`;
}

function moveLayer(dir) {
    if (!selectedItem) return;
    let currentZ = parseInt(selectedItem.style.zIndex) || 10;
    selectedItem.style.zIndex = currentZ + dir;
}

function clearAll() {
    document.querySelectorAll('.flower-instance').forEach(el => el.remove());
    document.getElementById('canvas').style.backgroundImage = 'none';
}
function updateVaseTexture(val) {
    const vasePath = document.getElementById('vasePath');
    // If it's a URL (for patterns like Marble), we use background images
    if (val.startsWith('url')) {
        vasePath.style.fill = 'white'; // Base color for texture
        vasePath.style.backgroundImage = val;
        vasePath.style.backgroundSize = 'cover';
    } else {
        // If it's a color (like Gold or Glass), we just change the fill
        vasePath.style.fill = val;
        vasePath.style.backgroundImage = 'none';
    }
}
