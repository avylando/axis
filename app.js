'use strict';

(function() {

    // Work with canvas

    const endY = 200;
    const step = 39;
    const myA = 80;
    const myB = 120;
    
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
    
    aElement.textContent = a;
    bElement.textContent = b;
    
    // ctx.bezierCurveTo(100, 100, 200, 100, 270, 200);

    ctx.strokeStyle = '#ED1D30';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    function renderArrow(start) {

        ctx.moveTo(start, 200);
        ctx.lineTo((start - 10), 192);
        ctx.moveTo(start, 200);
        ctx.lineTo((start + 2), 188);
    }

    function renderCurve() {
        let counter = 0;
        
        return function (value, cb) {
            let mY;
            let middleX;

            if (counter === 0) {
                mY = myA;
                let startX = 37;

                ctx.moveTo(startX, 200);

                let k = (value - minA) * step;
                
                let mx1 = 80 + (k/value);
                let mx2 = 220 + k;
                let endX = 270 + k;
                
                ctx.bezierCurveTo(mx1, myA, mx2, myA, endX, endY);
                renderArrow(endX, -1);

                middleX = (startX + endX) / 2;
            }

            if (counter === 1) {
                mY = myB;
                let startX = 270 + ((a - minA) * step);
                
                ctx.moveTo(startX, 200);

                let k = value * step;
                
                let mx1 = startX + (k/sum) - 10;
                let mx2 = startX + (k);
                let endX = startX + k;

                ctx.bezierCurveTo(mx1, myB, mx2, myB, endX, endY);
                renderArrow(endX);

                middleX = (startX + endX) / 2;
            }
            
            setTimeout(function() {
                ctx.stroke();
                cb(middleX, mY, value, counter);
                counter++;
            }, 600);
            
        }
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

            default: return false;
        }
    }

    function inputValid(input, curVal, val) {
        if (parseInt(curVal, 10) === val) {
            return true;
        }

        if (curVal === '') {
            input.style.color = '#000000';
            return;

        } else if (curVal !== val){
            setTimeout(function() {
                    let el = blockMap(val);
                    if (el) {
                        el.style.backgroundColor = '#EDAC31';
                    }
                    
                    input.style.color = '#ED1D30';
                }, 300);
            return;
        }
    }

    function renderFields(x, y, val, counter, cb = null) {

        let coordX = x - 15;
        let coordY = container.clientHeight + (y - 260 - (y/4));
        let input = createInput(coordX, coordY);
        let label = createLabel(coordX, coordY, val);
        
        container.appendChild(input);

        input.focus();

        input.addEventListener('input', function() {
            let validity = inputValid(input, input.value, val);

            if (validity) {
                setTimeout(function() {
                    let el = blockMap(val);
                    el.style.backgroundColor = 'transparent';
                    input.style.opacity = '0';
                    input.disabled = 'true';
                    let label = createLabel(coordX, coordY, val);

                    container.appendChild(label);

                    if (counter === 0) {
                        startApp(b, renderFields);
                    }

                    if (counter === 1) {
                        let coordX = sumElement.offsetLeft - 2;
                        let coordY = sumElement.offsetTop + 6;

                        let input = createInput(coordX, coordY);
                        input.className = 'ext';

                        container.appendChild(input);

                        input.focus();

                        input.addEventListener('input', function() {
                            let validity = inputValid(input, input.value, sum);

                            if (validity) {
                                setTimeout(function() {
                                    input.style.opacity = '0';
                                    input.disabled = 'true';
                                    sumElement.textContent = sum;
                                }, 300);
                            }
                        });
                    }
                }, 300);
            }
        })
    }

    let startApp = renderCurve();

    startApp(a, renderFields);

})();