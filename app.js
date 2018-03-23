'use strict';

(function() {

    // Work with canvas

    const endY = 200;
    const step = 39;
    const myA = 80;
    const myB = 130;
    
    let minA = 6;
    let maxA = 9;
    let a = Math.floor(Math.random() * (maxA - minA + 1)) + minA;

    let minSum = 11;
    let maxSum = 14;
    let sum = Math.floor(Math.random() * (maxSum - minSum + 1)) + minSum;

    let b = sum - a;
    let minB = minSum - maxA;
    let maxB = maxSum - minA;

    let container = document.querySelector('.container');
    let aElement = container.querySelector('.a');
    let bElement = container.querySelector('.b');
    let sumElement = container.querySelector('.sum');
    let canvas = document.querySelector('#canvas');

    let ctx = canvas.getContext('2d');
    
    
    // ctx.bezierCurveTo(100, 100, 200, 100, 270, 200);

    ctx.strokeStyle = '#ED1D30';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    function renderArrow(start, offset = 0) {
        start = start + offset;

        ctx.moveTo(start, 200);
        ctx.lineTo((start - 10), 192);
        ctx.moveTo(start, 200);
        ctx.lineTo((start + 2), 188);
    }

    function renderCurve(value, cb) {
        
        if (value === a) {
            let startX = 37;

            ctx.moveTo(startX, 200);

            let k = (value - minA) * step;
            
            let mx1 = 80 + (k/value);
            let mx2 = 220 + k;
            let endX = 270 + k;

            ctx.bezierCurveTo(mx1, myA, mx2, myA, endX, endY);
            renderArrow(endX, -1);

            let middleX = (startX + endX) / 2;

            cb(middleX, myA, value);
        }
        
        if (value === b) {
            let startX = 270 + ((a - minA) * step);
            
            ctx.moveTo(startX, 200);

            let k = value * step;
            
            let mx1 = startX + (k/sum) - 10;
            let mx2 = startX + (k) - 5;
            let endX = startX + k;

            ctx.bezierCurveTo(mx1, myB, mx2, myB, endX, endY);
            renderArrow(endX, 1);

            let middleX = (startX + endX) / 2;

            cb(middleX, myB, value);
        }
        
        ctx.stroke();
    }
    

    // Input logic

    function createInput (x, y) {
        let input = document.createElement('input');

        input.type = 'text';
        input.maxLength = '2';
        input.style.left = x + 'px';
        input.style.top = y + 'px';

        return input;
    }

    function createLabel(x, y, val) {
        let label = document.createElement('div');

        label.className = 'label';
        label.style.left = (x + 10) + 'px';
        label.style.top = (y + 4) + 'px';
        label.textContent = val;

        return label;
    }

    function blockMap(key) {
        switch (key) {
            case a: return aElement;
        
            case b: return bElement;

            case sum: return sumElement;

            default: return false;
        }
    }

    function inputValid(input, curVal, val) {
        if (curVal === val) {
            return true;
        }

        if (curVal.isNaN) {
            input.style.color = '#000000';
            return;

        } else if (curVal !== val){
            setTimeout(function() {
                    let el = blockMap(val)
                    el.style.backgroundColor = '#EDAC31';
                    input.style.color = '#ED1D30';
                }, 300);
            return;
        }

        // console.log(curVal);
        // switch (curVal) {
        //     case val:
        //         return true;

        //     default:
                
        //         break;
        // }
    }

    function renderFields(x, y, val, cb = null) {
        
        aElement.textContent = a;
        bElement.textContent = b;

        let coordX = x - 15;
        let coordY = container.clientHeight + (y - 260 - (y/4));
        let input = createInput(coordX, coordY);
        let label = createLabel(coordX, coordY, val);

        container.appendChild(input);

        input.addEventListener('input', function() {
            let validity = inputValid(input, parseInt(input.value, 10), val);

            if (validity) {
                setTimeout(function() {
                    let el = blockMap(val);
                    el.style.backgroundColor = 'transparent';
                    input.style.display = 'none';
                    let label = createLabel(coordX, coordY, val);

                    container.appendChild(label);

                    if (val === a) {
                        renderCurve(b, renderFields);
                    }

                    if (val === b) {
                        let coordX = sumElement.offsetLeft;
                        let coordY = sumElement.offsetTop + 11;
                        console.log(coordY);
                        console.log(coordX);
                        let input = createInput(coordX, coordY);

                        container.appendChild(input);

                        // input.addEventListener('input', function() {
                        //     if (input.value === )
                        // })
                    }
                    
                }, 300);
            }
            // if (input.value === '') {
            //     input.style.color = '#000000';

            // } else if (parseInt(input.value, 10) !== val) {
            //     setTimeout(function() {
            //         let el = blockMap(val)
            //         el.style.backgroundColor = '#EDAC31';
            //         input.style.color = '#ED1D30';
            //     }, 300);
            // }
            
            // if (parseInt(input.value, 10) === val) {
            //     setTimeout(function() {
            //         let el = blockMap(val);
            //         el.style.backgroundColor = 'transparent';
            //         input.style.display = 'none';
            //         let label = createLabel(coordX, coordY, val);

            //         container.appendChild(label);

            //         if (val === a) {
            //             renderCurve(b, renderFields);
            //         }

            //         if (val === b) {
            //             let coordX = sumElement.offsetLeft;
            //             let coordY = sumElement.offsetTop + 11;
            //             console.log(coordY);
            //             console.log(coordX);
            //             let input = createInput(coordX, coordY);

            //             container.appendChild(input);

            //             // input.addEventListener('input', function() {
            //             //     if (input.value === )
            //             // })
            //         }
                    
            //     }, 300);
            // }
        })
    }

    
    // renderCurve(b, renderFields);

    function startApp() {
        let counter = 0;
        let firstTask = renderCurve(a, renderFields);

        if (firstTask) {
            let secondTask = renderCurve(b, renderFields);
        }
    }

    startApp();

    console.log(a);
    console.log(b);
})();